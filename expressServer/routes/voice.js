var express = require('express');
var router = express.Router();
const { VoiceResponse } = require('twilio').twiml;
const config = require('../config');

// En tu archivo routes/voice.js

router.post('/', (request, response) => {
  //const city = request.body.FromCity || "tu ubicación";
  const twiml = new VoiceResponse();

  twiml.say({
    voice: 'es-MX-Standard-A',
    language: 'es-MX'
  }, `Hola. Asistente de emergencias de Victoria de Durango. Al escuchar el tono, describe tu situación.`);

 //twiml.play('https://api.twilio.com/cowbell.mp3');

  const connect = twiml.connect();
  connect.stream({
    url: `wss://${config.wsUrl}/stream`,
    track: 'inbound_track'
  });

  response.type('text/xml');
  response.send(twiml.toString());
});

/* router.post('/talk', (request, response) => {
  const twiml = new VoiceResponse();
  const { sentence } = request.body; // La pregunta crítica detectada por la IA

  twiml.say({
    voice: 'es-MX-Standard-A',
    language: 'es-MX'
  }, sentence);

    // 🚨 LO QUE FALTABA: Enviar la respuesta TwiML a Twilio
    response.type('text/xml');
    response.send(twiml.toString());
}); */

module.exports = router;