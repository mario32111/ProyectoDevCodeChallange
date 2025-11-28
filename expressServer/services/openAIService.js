
const { createAzureClient } = require('../config/azureConfig.js');

class OpenAIService {
    sessions = new Map();

    constructor() {
        console.log('🔑 Configurando Azure OpenAI...');
        this.client = createAzureClient();
    }


    // Método para obtener el contexto del sistema (separado para mantener el constructor limpio)
    getSystemContext() {
        return {
            role: "system",
            content: `
        ## 🚨 Agente de Clasificación de Llamadas de Emergencia 911 🚨

        **OBJETIVO:** Analizar la transcripción y las emociones detectadas en un fragmento de 10 segundos de una llamada de emergencia. El objetivo es proporcionar una clasificación rápida y precisa para la respuesta de los servicios de emergencia y generar una **pregunta de seguimiento crítica** para el agente humano o conversacional.

        **REQUISITOS DE ANÁLISIS (DEBES INCLUIR ESTAS CATEGORÍAS):**

        1.  **Probabilidad de Llamada Falsa (0.0 a 1.0):** Determina la probabilidad de que la llamada sea un engaño o no sea una emergencia real.
        2.  **Tipo de Incidente (Clasificación con Porcentajes):** Asigna un porcentaje de probabilidad a las siguientes categorías:
            * Accidente de Tráfico
            * Robo/Asalto
            * Violencia Doméstica
            * Incendio/Emergencia con Fuego
            * Emergencia Médica (e.g., paro cardíaco, desmayo)
            * Otro Incidente (e.g., disturbio, animales, servicios públicos)
        3.  **Nivel de Urgencia (Bajo, Medio, Alto):** Clasifica la necesidad de respuesta inmediata.
        4.  **Recursos Requeridos:** Identifica los servicios de emergencia esenciales para la respuesta (e.g., Policía, Ambulancia, Bomberos, Protección Civil).
        5.  **Próxima Pregunta:** Genera la pregunta más crítica y necesaria para obtener la información faltante (ej. ubicación exacta, estado de la víctima, armas presentes, etc.) para confirmar el incidente y el despacho de recursos.

        **FORMATO DE RESPUESTA ESTRICTO:**

        Debes responder **SIEMPRE** en un único objeto JSON que se adhiera al siguiente esquema. **No incluyas texto explicativo, preámbulos, o código fuera de este JSON.**

        {
            "probabilidad_falsa": 0.0, // Valor de 0.0 a 1.0
            "urgencia": "Alto", // Valor: "Bajo", "Medio", o "Alto"
            "tipo_incidente_principal": "Accidente de Tráfico", // La categoría con mayor porcentaje.
            "recursos_despacho": ["Policía", "Ambulancia"], // Array de recursos.
            "proxima_pregunta_agente": "¿Cuál es la dirección exacta donde ocurrió el accidente?", // La pregunta de seguimiento.
            "analisis_completo": {
                "falsa_probabilidad": 0.0,
                "urgencia_probabilidad": {
                    "Bajo": 0.0,
                    "Medio": 0.0,
                    "Alto": 1.0
                },
                "incidentes_probabilidad": {
                    "Accidente de Tráfico": 0.0,
                    "Robo/Asalto": 0.0,
                    "Violencia Doméstica": 0.0,
                    "Incendio/Emergencia con Fuego": 0.0,
                    "Emergencia Médica": 1.0,
                    "Otro Incidente": 0.0
                }
            },
            "razonamiento_justificacion": "El tono de voz del llamante es de pánico (emoción detectada), y la transcripción 'No respira, ¡necesito una ambulancia rápido!' indica una Emergencia Médica de alta urgencia. Se requieren Ambulancia y Policía si se asocia a un lugar público."
        }

        **INSTRUCCIÓN FINAL:** Tu análisis debe basarse **ÚNICAMENTE** en la transcripción y las emociones recibidas. Si la información es insuficiente, sé conservador en la clasificación y justifica tu *razonamiento* con la falta de datos.
    `
        };
    }

    // Método para obtener el historial de una sesión específica
    getSessionHistory(callSid) {
        if (!this.sessions.has(callSid)) {
            this.sessions.set(callSid, [this.getSystemContext()]);
        }
        return this.sessions.get(callSid);
    }

    // Método para resetear la conversación de una llamada específica
    resetHistory(callSid) {
        if (this.sessions.has(callSid)) {
            this.sessions.delete(callSid);
        }
    }

    async streamingCompletion(callSid, userMessageContent, emotionContent, ws) {
        console.log(`[IA Service] Iniciando stream para socket. CallSid: ${callSid}`);

        const history = this.getSessionHistory(callSid);
        history.push({ role: 'user', content: userMessageContent });
        history.push({ role: 'user', content: `Emoción detectada: ${emotionContent}` });



        const finalMessages = history;
        const defaultOptions = {
            max_tokens: 4096,
            temperature: 0.7,
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            stream: true,
        };
        let aiResponseContent = "";

        try {
            const stream = await this.client.chat.completions.create({
                messages: finalMessages, // Usa el historial completo
                ...defaultOptions
            });

            // Iteramos sobre el stream de Azure
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    aiResponseContent += content; // Acumulamos el chunk

                    // --- CALLBACK: ai_chunk ---
                    if (ws.emit) {
                        ws.emit('ai_chunk', { chunk: content });
                    } else if (ws.send) {
                        ws.send(JSON.stringify({ event: 'ai_chunk', chunk: content }));
                    }
                }
            }

            // 4. Agregamos la respuesta completa de la IA al historial
            if (aiResponseContent.length > 0) {
                history.push({ role: 'assistant', content: aiResponseContent });
            }


            console.log(`[IA Service] Stream finalizado. Historial con ${history.length} mensajes.`);
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
