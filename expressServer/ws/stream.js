const path = require('path');
const transcribeService = require('../services/transcribeService');
const iaService = require('../services/openAIService');
const { saveWavFile, RECORDINGS_DIR } = require('../services/audioService');
const config = require('../config');
const client = require('twilio')(config.twilioAccountSid, config.twilioAuthToken);
const { VoiceResponse } = require('twilio').twiml;

let fullAiResponse = '';
let questionSent = false; // Bandera para asegurar que la pregunta solo se envíe una vez.
module.exports = (app) => {
    app.ws('/stream', (ws, req) => {
        console.log('¡Conexión de WebSocket /stream establecida!');
        let streamBuffer = Buffer.alloc(0);
        const CHUNK_SIZE_10S = 80000;
        const CHUNK_SIZE_30S = 240000;
        let callSid = 'unknown_call';
        let processedBytes = 0;
        let chunkCounter = 1;
        let saved30s = false;
        ws.on('message', async (msg) => {
            try {
                const twilioMsg = JSON.parse(msg);
                switch (twilioMsg.event) {
                    case 'start':
                        console.log('Evento "start": La llamada ha comenzado.');
                        callSid = twilioMsg.start.callSid;
                        break;
                    case 'media':
                        const audioChunk = Buffer.from(twilioMsg.media.payload, 'base64');
                        streamBuffer = Buffer.concat([streamBuffer, audioChunk]);
                        while ((streamBuffer.length - processedBytes) >= CHUNK_SIZE_10S) {
                            const endByte = processedBytes + CHUNK_SIZE_10S;
                            const chunk10s = streamBuffer.slice(processedBytes, endByte);
                            const filename = `${callSid}_part_${chunkCounter}.wav`;
                            const filePath = path.join(RECORDINGS_DIR, filename);
                            saveWavFile(chunk10s, filePath);
                            console.log(`✅ Guardado segmento ${chunkCounter} de 10s.`);

                            // Actualizamos contadores ANTES del await para evitar condiciones de carrera
                            processedBytes += CHUNK_SIZE_10S;
                            chunkCounter++;

                            const transcribeResponse = await transcribeService.enviarAudio(filePath);
                            //const emotionResponse = await emotionService.enviarAudio(filePath);
                            const userMessageContent = transcribeResponse.texto;
                            const emotionContent = 'sad'; // Usa la emoción real aquí cuando esté lista

                            iaService.streamingCompletion(callSid, userMessageContent, emotionContent, ws);
                        }
                        if (!saved30s && streamBuffer.length >= CHUNK_SIZE_30S) {
                            // Marcamos como guardado ANTES del await
                            saved30s = true;

                            const chunk30s = streamBuffer.slice(0, CHUNK_SIZE_30S);
                            const filename30 = `${callSid}_FIRST_30s.wav`;
                            const filePath30 = path.join(RECORDINGS_DIR, filename30);
                            saveWavFile(chunk30s, filePath30);
                            console.log('🌟 Clip acumulado de 30 segundos guardado.');
                            /*                            const response = await transcribeService.enviarAudio(filePath30, { useContext: false, updateContext: false });
                                                       const messages = [{ role: 'user', content: response.texto }];
                                                       const emotions = [{ role: 'user', content: 'sad' }];
                                                       iaService.streamingCompletion(messages, emotions, ws); */
                        }
                        break;
                    case 'stop':
                        console.log('Evento "stop": La llamada ha terminado.');
                        transcribeService.resetContext();
                        // iaService.resetHistory(callSid); // 🚨 Comentado para mantener el contexto entre streams (TwiML updates).
                        break;
                }
            } catch (error) {
                console.error('Error procesando el mensaje de WebSocket:', error);
            }
        });
        ws.on('ai_chunk', (data) => {
            const chunkContent = data.chunk;

            // 1. Acumulamos el contenido del chunk para reconstruir el JSON.
            fullAiResponse += chunkContent;

            // 2. Si la pregunta aún no se ha enviado, intentamos detectarla.
            if (!questionSent) {
                try {
                    // Intentamos parsear el JSON completo acumulado hasta ahora.
                    // Esto solo funcionará si el JSON es lo suficientemente completo (e.g., está cerrado).
                    const partialJson = JSON.parse(fullAiResponse);

                    // 3. Verificamos si el campo de la pregunta existe en el objeto parseado.
                    if (partialJson.proxima_pregunta_agente) {
                        const question = partialJson.proxima_pregunta_agente;

                        console.log(`[Agente Talk] 💬 Pregunta Crítica Detectada: "${question}"`);

                        // 4. Enviamos la pregunta crítica a /talk.
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
                                questionSent = true;
                            })
                            .catch(err => {
                                console.error('[Agente Talk] ❌ Error actualizando llamada:', err);
                            });
                    }
                } catch (error) {
                    // Es normal que falle el JSON.parse hasta que el JSON esté completo o al menos 
                    // hasta que los primeros campos estén bien formados. No imprimimos errores aquí.
                }
            }

            // 5. Opcional: Si quieres ver el JSON completo al final, puedes usar ws.on('ai_end')
            // En el flujo actual, solo necesitas enviar la pregunta y luego el sistema
            // debería usar 'ai_end' para obtener el JSON final.

            // **IMPORTANTE:** El campo 'message' que estabas usando ya no es necesario aquí.
            // La lógica de envío a /talk debería estar diseñada para que el agente
            // conversacional sepa cuándo hablar (e.g., solo con la pregunta crítica).
        });


        ws.on('close', () => {
            console.log('Conexión de WebSocket /stream cerrada.');
            // Limpiamos la bandera y el buffer al cerrar la conexión.
            fullAiResponse = '';
            questionSent = false;
        });
    });
};
