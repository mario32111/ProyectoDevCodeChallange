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

  // PASO 1: El saludo (El usuario escucha esto primero)
  twiml.say({
     voice: 'es-MX-Standard-A',
     language: 'es-MX'
  }, `Hola. Asistente de emergencias de ${city}. Al escuchar el tono, describe tu situación.`);
  
  // PASO 2: El tono (opcional, pero ayuda mucho a saber cuándo hablar)
  // twiml.play('https://api.twilio.com/cowbell.mp3'); // Puedes buscar un 'beep' corto si quieres

  // PASO 3: Conectar al Stream (Aquí empieza a grabar lo que dice el usuario)
  const connect = twiml.connect(); 
  connect.stream({
    url: 'wss://c59e852872c6.ngrok-free.app/stream',
    track: 'inbound_track' // 'inbound_track' = Solo grabamos al usuario (ahorra ancho de banda)
  });

  response.type('text/xml');
  response.send(twiml.toString());
});

module.exports = router;