
const { createAzureClient } = require('../config/azureConfig.js');

class OpenAIService {
    constructor() {
        console.log('🔑 Configurando Azure OpenAI...');
        this.client = createAzureClient(); 
    }


    async streamingCompletion(messages, io, socketId) {
        console.log(`[IA Service] Iniciando stream para socket: ${ socketId } `);
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
                    // Serialización automática de socket.io
                    io.to(socketId).emit('ai_chunk', { chunk: content });
                }
            }

            // --- CALLBACK: ai_end ---
            console.log(`[IA Service] Stream finalizado para socket: ${ socketId } `);
            io.to(socketId).emit('ai_end', { fullResponse: "Stream finalizado." });

        } catch (error) {
            console.error('❌ Error en streaming Azure OpenAI:', error);
            // --- CALLBACK: remote_error ---
            // Así se maneja un "Error Remoto"
            io.to(socketId).emit('remote_error', { 
                message: 'Error durante el stream con Azure OpenAI',
                details: error.message 
            });
        }
    }
}

module.exports = new OpenAIService();
