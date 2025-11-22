var express = require('express');
var router = express.Router();
const { VoiceResponse } = require('twilio').twiml;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// En tu archivo routes/voice.js

router.post('/', (request, response) => {
  const city = request.body.FromCity || "tu ubicación";
  const twiml = new VoiceResponse();

  // Iniciar el stream INMEDIATAMENTE para capturar todo
  const connect = twiml.connect();
  connect.stream({
    url: 'wss://c59e852872c6.ngrok-free.app/stream',
    track: 'inbound_track' // Asegura que grabamos solo al usuario (o 'both_tracks' para ambos)
  });

  // NOTA: Cuando usas <Connect><Stream>, Twilio deja de procesar los verbos <Say> siguientes
  // hasta que el stream termine. Si quieres que el bot hable Y grabe al mismo tiempo,
  // la arquitectura cambia (el bot debe hablar a través del WebSocket).
  
  // PERO, para tu caso actual (Grabar mensaje), lo ideal es:
  // 1. El bot saluda.
  // 2. Inicia la grabación/stream.
  
  // Tu código original estaba bien en orden, pero asegúrate de que el usuario sepa cuándo hablar.
  twiml.say({
     voice: 'es-MX-Standard-A',
     language: 'es-MX'
  }, `Hola. Asistente de emergencias de ${city}. Al escuchar el tono, describe tu situación.`);
  
  // Ahora sí conectamos el flujo de audio
  const connect2 = twiml.connect(); 
  connect2.stream({
    url: 'wss://c59e852872c6.ngrok-free.app/stream'
  });
  response.type('text/xml');
  response.send(twiml.toString());
});

module.exports = router;