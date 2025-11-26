
const { createAzureClient } = require('../config/azureConfig.js');

class OpenAIService {
    constructor() {
        console.log('🔑 Configurando Azure OpenAI...');
        this.client = createAzureClient();
    }


    async streamingCompletion(messages, ws) {
        console.log(`[IA Service] Iniciando stream para socket.`);
        const defaultOptions = {
            max_tokens: 4096,
            temperature: 0.7,
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            stream: true
        };

        try {
            const stream = await this.client.chat.completions.create({
                messages,
                ...defaultOptions
            });

            // Iteramos sobre el stream de Azure
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    // --- CALLBACK: ai_chunk ---
                    if (ws.emit) {
                        ws.emit('ai_chunk', { chunk: content });
                    } else if (ws.send) {
                        ws.send(JSON.stringify({ event: 'ai_chunk', chunk: content }));
                    }
                }
            }

            // --- CALLBACK: ai_end ---
            console.log(`[IA Service] Stream finalizado.`);
            if (ws.emit) {
                ws.emit('ai_end', { fullResponse: "Stream finalizado." });
            } else if (ws.send) {
                ws.send(JSON.stringify({ event: 'ai_end', fullResponse: "Stream finalizado." }));
            }

        } catch (error) {
            console.error('❌ Error en streaming Azure OpenAI:', error);
            // --- CALLBACK: remote_error ---
            const errorMsg = {
                message: 'Error durante el stream con Azure OpenAI',
                details: error.message
            };
            if (ws.emit) {
                ws.emit('remote_error', errorMsg);
            } else if (ws.send) {
                ws.send(JSON.stringify({ event: 'remote_error', ...errorMsg }));
            }
        }
    }
}

module.exports = new OpenAIService();
