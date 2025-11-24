const aiService = require('../services/translateService');

module.exports = (app) => {

    app.ws('/stream', (ws, req) => {
        console.log('¡Conexión de WebSocket /stream establecida!');

        // Búfer para acumular TODO el audio de esta llamada
        let streamBuffer = Buffer.alloc(0);

        // --- CONSTANTES ---
        // 8000 bytes/segundo * 10 segundos = 80,000 bytes
        const CHUNK_SIZE_10S = 80000;
        // 8000 bytes/segundo * 30 segundos = 240,000 bytes
        const CHUNK_SIZE_30S = 240000;

        // --- ESTADO DE LA LLAMADA ---
        let callSid = 'unknown_call';

        // Puntero para saber hasta dónde hemos guardado los clips pequeños
        let processedBytes = 0;
        // Contador para nombrar los archivos (parte_1, parte_2, etc.)
        let chunkCounter = 1;

        // Flag para asegurar que el de 30s solo se guarde una vez
        let saved30s = false;

        ws.on('message', (msg) => {
            try {
                const twilioMsg = JSON.parse(msg);

                switch (twilioMsg.event) {
                    case 'start':
                        console.log('Evento "start": La llamada ha comenzado.');
                        callSid = twilioMsg.start.callSid;
                        break;

                    case 'media':
                        // 1. Añadimos el nuevo audio al búfer general
                        const audioChunk = Buffer.from(twilioMsg.media.payload, 'base64');
                        streamBuffer = Buffer.concat([streamBuffer, audioChunk]);

                        // -------------------------------------------------------
                        // LÓGICA A: Generar clips de 10s INDEFINIDAMENTE
                        // -------------------------------------------------------
                        // Mientras tengamos suficiente audio "nuevo" (no procesado) para hacer 10s:
                        while ((streamBuffer.length - processedBytes) >= CHUNK_SIZE_10S) {

                            // Cortamos desde donde nos quedamos la última vez hasta +10s
                            const endByte = processedBytes + CHUNK_SIZE_10S;
                            const chunk10s = streamBuffer.slice(processedBytes, endByte);

                            // Nombre del archivo secuencial: callID_part_1.wav, callID_part_2.wav...
                            const filename = `${callSid}_part_${chunkCounter}.wav`;
                            const filePath = path.join(RECORDINGS_DIR, filename);

                            saveWavFile(chunk10s, filePath);
                            console.log(`✅ Guardado segmento ${chunkCounter} de 10s.`);
                            aiService.enviarAudio(filePath);
                            // Actualizamos punteros
                            processedBytes += CHUNK_SIZE_10S;
                            chunkCounter++;
                        }

                        // -------------------------------------------------------
                        // LÓGICA B: Guardar UN SOLO clip de los primeros 30s
                        // -------------------------------------------------------
                        if (!saved30s && streamBuffer.length >= CHUNK_SIZE_30S) {
                            // Cortamos desde el inicio (0) hasta los 30s exactos
                            const chunk30s = streamBuffer.slice(0, CHUNK_SIZE_30S);

                            const filename30 = `${callSid}_FIRST_30s.wav`;
                            const filePath30 = path.join(RECORDINGS_DIR, filename30);

                            saveWavFile(chunk30s, filePath30);
                            console.log('🌟 Clip acumulado de 30 segundos guardado.');
                            aiService.enviarAudio(filePath30);

                            saved30s = true; // Bloqueamos para que no se repita
                        }
                        break;

                    case 'stop':
                        console.log('Evento "stop": La llamada ha terminado.');
                        break;
                }
            } catch (error) {
                console.error('Error procesando el mensaje de WebSocket:', error);
            }
        });

        ws.on('close', () => {
            console.log('Conexión de WebSocket /stream cerrada.');
        });
    });
};
