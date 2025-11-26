const path = require('path');
const transcribeService = require('../services/transcribeService');
const iaService = require('../services/openAIService');
const { saveWavFile, RECORDINGS_DIR } = require('../services/audioService');
const axios = require('axios');
const request = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 20000, // 20 segundos máximo de espera
});
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

                            const response = await transcribeService.enviarAudio(filePath);
                            const messages = [{ role: 'user', content: response.texto }];
                            iaService.streamingCompletion(messages, ws);
                        }
                        if (!saved30s && streamBuffer.length >= CHUNK_SIZE_30S) {
                            // Marcamos como guardado ANTES del await
                            saved30s = true;

                            const chunk30s = streamBuffer.slice(0, CHUNK_SIZE_30S);
                            const filename30 = `${callSid}_FIRST_30s.wav`;
                            const filePath30 = path.join(RECORDINGS_DIR, filename30);
                            saveWavFile(chunk30s, filePath30);
                            console.log('🌟 Clip acumulado de 30 segundos guardado.');
                            const response = await transcribeService.enviarAudio(filePath30, { useContext: false, updateContext: false });
                            const messages = [{ role: 'user', content: response.texto }];
                            iaService.streamingCompletion(messages, ws);
                        }
                        break;
                    case 'stop':
                        console.log('Evento "stop": La llamada ha terminado.');
                        transcribeService.resetContext();
                        break;
                }
            } catch (error) {
                console.error('Error procesando el mensaje de WebSocket:', error);
            }
        });
        ws.on('ai_chunk', (data) => {
            console.log('IA Chunk:', data);
        });
        ws.on('close', () => {
            console.log('Conexión de WebSocket /stream cerrada.');
        });
    });
};
