var express = require('express');
var router = express.Router();

// 1. Importa el generador de TwiML

/* GET users listing. */
router.post('/', (req, res) => {

    // Deserialización automática de JSON
    const { messages } = req.body;
    const ws = req.ws; // Obtenemos 'io' del middleware (si existe)
    const iaService = require('../services/openAIService');
    const userMessageContent = "";
    const emotionContent = 'sad'; // Usa la emoción real aquí cuando esté lista
    if (ws) {
        // 1. Iniciar el trabajo (SIN AWAIT)
        const callSid = req.body.callSid || (ws && ws.id) || 'default_chat_session';
        iaService.streamingCompletion(callSid, userMessageContent, emotionContent, ws)
            .catch(err => {
                console.error('[Error de Inicio] Fallo al iniciar el stream:', err);
                ws.emit('remote_error', {
                    message: 'Error al iniciar el servicio de IA.',
                    details: err.message
                });
            });

        res.status(202).json({
            status: 'Job accepted',
            message: `Procesando...`
        });
    } else {
        // Si no hay socket (ej: llamada HTTP normal), podríamos esperar la respuesta o devolver error.
        // Por ahora, devolvemos un mensaje indicando que no se soporta streaming por HTTP directo sin socket.
        res.status(400).json({
            status: 'Error',
            message: 'Este endpoint requiere una conexión WebSocket activa inyectada en req.ws'
        });
    }
});
module.exports = router;