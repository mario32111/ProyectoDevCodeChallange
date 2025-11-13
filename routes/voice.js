var express = require('express');
var router = express.Router();
const { VoiceResponse } = require('twilio').twiml;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (request, response) => {
  // 1. (Opcional) Imprime el body
  console.log("Datos de la llamada:", request.body);
  const city = request.body.FromCity || "tu ubicación";

  // 2. Prepara la respuesta TwiML
  const twiml = new VoiceResponse();

  // 3. Saludo inicial
  twiml.say({
    voice: 'es-MX-Standard-A',
    language: 'es-MX'
  }, `Hola. Te has comunicado con el asistente virtual de emergencias de ${city}. Por favor, describe tu situación.`);

  // 4. --- ¡AQUÍ ESTÁ LA MAGIA! ---
  // Inicia el streaming de audio
  const connect = twiml.connect();
  connect.stream({
    url: 'wss://d7fbe783fc05.ngrok-free.app/stream' // <-- ¡Crítico! Debe ser 'wss://'
  });
  
  // 5. (Opcional) Pausa para que el streaming se establezca
  twiml.pause({ length: 20 }); // Pausa de 20s (puedes ajustar)

  // 6. Envía la respuesta TwiML
  response.type('text/xml');
  response.send(twiml.toString());
});

module.exports = router;