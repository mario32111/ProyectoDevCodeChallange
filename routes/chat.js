var express = require('express');
var router = express.Router();

// 1. Importa el generador de TwiML

/* GET users listing. */
router.post('/', (req, res) => {
    
    // Deserialización automática de JSON
    const { messages, socketId } = req.body;
    const io = req.io; // Obtenemos 'io' del middleware

    if (!messages || !socketId) {
        // Error de parámetros
        return res.status(400).json({ error: 'Faltan "messages" o "socketId"' });
    }

    // 1. Iniciar el trabajo (SIN AWAIT)
    // Esto maneja la concurrencia, Node no se bloquea
    aiService.streamingCompletion(messages, io, socketId)
        .catch(err => {
            // Manejo de Error Remoto: Si falla, avisar por el socket
            console.error('[Error de Inicio] Fallo al iniciar el stream:', err);
            io.to(socketId).emit('remote_error', { 
                message: 'Error al iniciar el servicio de IA.', 
                details: err.message 
            });
        });

    // 2. Responder INMEDIATAMENTE
    // Serialización automática de la respuesta JSON
    res.status(202).json({ 
        status: 'Job accepted', 
        message: `Procesando... callback se enviará a ${socketId}` 
    });
});
module.exports = router;