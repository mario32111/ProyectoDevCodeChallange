const path = require('path');
const transcribeService = require('../services/transcribeService');
const emotionService = require('../services/emotionService');
const iaService = require('../services/openAIService');
const { saveWavFile, getPCMFromMuLaw, RECORDINGS_DIR } = require('../services/audioService');
const config = require('../config');
const WebSocketClient = require('ws'); // Cliente WS para conectarse a IAService
const client = require('twilio')(config.twilioAccountSid, config.twilioAuthToken);
const { VoiceResponse } = require('twilio').twiml;

module.exports = (app) => {
    app.ws('/stream', (ws, req) => {
        let fullAiResponse = '';
        let questionSent = false; // Bandera para asegurar que la pregunta solo se envíe una vez.

        console.log('¡Conexión de WebSocket /stream establecida!');
        let streamBuffer = Buffer.alloc(0);
        const CHUNK_SIZE_10S = 80000;
        const CHUNK_SIZE_30S = 240000;
        let callSid = 'unknown_call';
        let aiStreamWs = null; // Socket hacia IAService

        ws.on('message', async (msg) => {
            try {
                const twilioMsg = JSON.parse(msg);
                switch (twilioMsg.event) {
                    case 'start':
                        console.log('Evento "start": La llamada ha comenzado.');
                        callSid = twilioMsg.start.callSid;
                        fullAiResponse = '';
                        questionSent = false;
                        
                        // Conectar con el VAD de Python
                        if (aiStreamWs) {
                            aiStreamWs.close();
                        }
                        const aiWsUrl = config.aiApiUrl ? config.aiApiUrl.replace('http', 'ws') : 'ws://127.0.0.1:8000';
                        console.log(`[VAD] Conectando a ${aiWsUrl}/trans_stream`);
                        aiStreamWs = new WebSocketClient(`${aiWsUrl}/trans_stream`);
                        
                        aiStreamWs.on('open', () => {
                            console.log('[VAD] ⭐ Conectado exitosamente al stream de IA');
                        });
                        
                        aiStreamWs.on('message', (data) => {
                            try {
                                const response = JSON.parse(data);
                                if (response.type === 'transcription' && response.text) {
                                    console.log(`[VAD] 💬 Oración Detectada: "${response.text}"`);
                                    
                                    // Pasanmos la transcripción directamente a OpenAI para su respueta
                                    const userMessageContent = response.text;
                                    const emotionContent = 'neutral'; // Podrías agregar VAD de emociones después
                                    
                                    iaService.streamingCompletion(callSid, userMessageContent, emotionContent, ws);
                                }
                            } catch (error) {
                                console.error('[VAD] Error procesando mensaje de Python:', error);
                            }
                        });
                        
                        aiStreamWs.on('close', () => console.log('[VAD] 🔌 Desconectado del IA Service'));
                        aiStreamWs.on('error', (err) => console.error('[VAD] ❌ Error de WS:', err));
                        break;
                        
                    case 'media':
                        const audioChunkMuLaw = Buffer.from(twilioMsg.media.payload, 'base64');
                        
                        // Convertir de formato Twilio a PCM 16-bit
                        const pcmBuffer = getPCMFromMuLaw(audioChunkMuLaw);
                        
                        // Enviar el PCM inmediatamente al servidor Python para deteccion de silencios
                        if (aiStreamWs && aiStreamWs.readyState === WebSocketClient.OPEN) {
                            aiStreamWs.send(pcmBuffer);
                        }
                        break;
                        
                    case 'stop':
                        console.log('Evento "stop": La llamada ha terminado.');
                        transcribeService.resetContext();
                        if (aiStreamWs) {
                            aiStreamWs.close();
                        }
                        break;
                }
            } catch (error) {
                console.error('Error procesando el mensaje de WebSocket:', error);
            }
        });

        ws.on('ai_chunk', (data) => {
            const chunkContent = data.chunk;

            // 1. Acumulamos el contenido del chunk
            fullAiResponse += chunkContent;

            // 2. Si la pregunta aún no se ha enviado, intentamos detectarla usando RegEx.
            // Esto permite reaccionar MUCHO más rápido sin tener que esperar a que el JSON se complete validamente al final del stream.
            if (!questionSent) {
                const match = fullAiResponse.match(/"proxima_pregunta_agente"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
                if (match && match[1]) {
                    // Mover la asignación a True aquí (síncrona) para evitar que se envíe cientos de veces a Twilio.
                    questionSent = true; 

                    let question = match[1];
                    // Unescape string if necessary
                    question = question.replace(/\\"/g, '"').replace(/\\\\/g, '\\');

                    console.log(`[Agente Talk] 💬 Pregunta Crítica Detectada Temprano: "${question}"`);
                    
                    // 4. Interrumpimos la llamada para que Twilio hable.
                    console.log(`[Agente Talk] 🗣️ Hablando: "${question}"`);

                    const twiml = new VoiceResponse();
                    twiml.say({
                        voice: 'es-MX-Standard-A',
                        language: 'es-MX'
                    }, question);

                    // Reconectamos el stream para escuchar la respuesta del usuario
                    const connect = twiml.connect();
                    connect.stream({
                        url: `wss://${config.wsUrl}/stream`,
                        track: 'inbound_track'
                    });

                    client.calls(callSid)
                        .update({
                            twiml: twiml.toString()
                        })
                        .then(call => {
                            console.log('[Agente Talk] ✅ Llamada actualizada con respuesta de voz.');
                        })
                        .catch(err => {
                            console.error('[Agente Talk] ❌ Error actualizando llamada:', err);
                            // Si falla, permitimos reintentar
                            questionSent = false;
                        });
                }
            }
        });
        
        // --- NUEVA LÓGICA AGREGADA ---
        // Este evento se dispara cuando el servicio de IA termina de enviar la respuesta.
        ws.on('ai_end', () => {
            try {
                const startIdx = fullAiResponse.indexOf('{');
                const endIdx = fullAiResponse.lastIndexOf('}');
                
                if (startIdx !== -1 && endIdx !== -1) {
                    const cleanJsonStr = fullAiResponse.substring(startIdx, endIdx + 1);
                    const finalJson = JSON.parse(cleanJsonStr);
                    console.log('--- JSON FINAL DE LA RESPUESTA DE LA IA ---');
                    console.log(JSON.stringify(finalJson, null, 2));
                    console.log('-------------------------------------------');
                } else {
                    console.log('[Agente Talk] ⚠️ No se encontró JSON válido en la respuesta final.');
                }
            } catch (error) {
                console.error('❌ Error al parsear el JSON completo al finalizar el stream:', error);
            }
            // Después de procesar el JSON final, limpiamos el buffer
            fullAiResponse = ''; 
        });
        // -----------------------------

        ws.on('close', () => {
            console.log('Conexión de WebSocket /stream cerrada.');
            // Limpiamos la bandera y el buffer al cerrar la conexión.
            fullAiResponse = '';
            questionSent = false;
        });
    });
};