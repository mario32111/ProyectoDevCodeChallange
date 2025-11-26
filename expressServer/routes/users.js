var express = require('express');
var router = express.Router();
const { VoiceResponse } = require('twilio').twiml;
// 1. Importa el generador de TwiML

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});




router.post('/voice', (request, response) => {
  
  // 1. (Opcional pero recomendado) Imprime el body para ver qué info te llega
  console.log("Datos de la llamada:", request.body);
  const city = request.body.FromCity || "tu ubicación"; // Pon un fallback

  // 2. Prepara la respuesta TwiML
  const twiml = new VoiceResponse();

  // 3. Aquí está el cambio:
  twiml.say({
      voice: 'es-MX-Standard-A', // Voz femenina de español (México)
      language: 'es-MX'
  }, `Hola. Te has comunicado con el asistente virtual de emergencias de ${city}. Por favor, describe tu situación.`);

  // 4. (Quitamos el .play() de la canción, ya no es necesario)

  // 5. Envía la respuesta
  response.type('text/xml');
  response.send(twiml.toString());
});

module.exports = router;