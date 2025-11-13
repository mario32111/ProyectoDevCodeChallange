var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var voiceRouter = require('./routes/voice.js'); // <<< CAMBIO: Importamos tu router de /voice

var app = express();

// --- ¡NUEVO! Configura express-ws ---
// Esto "mejora" tu app de Express para que pueda manejar WebSockets
// Asegúrate de correr: npm install express-ws
var expressWs = require('express-ws')(app);
// ----------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // <<< NOTA: Dejé este, el otro 'extended: true' estaba duplicado
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Configura tus rutas HTTP ---
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/voice', voiceRouter); // <<< CAMBIO: Le decimos a Express que use tu router en la ruta /voice


app.ws('/stream', (ws, req) => {
  console.log('¡Conexión de WebSocket /stream establecida!');

  //  'ws' es la conexión. Escuchamos por mensajes
  ws.on('message', (msg) => {
    try {
      // 1. Recibimos el mensaje de Twilio
      const twilioMsg = JSON.parse(msg);

      // 2. Filtramos por tipo de evento
      switch (twilioMsg.event) {
        case 'connected':
          console.log('Evento "connected": El stream de Twilio ha comenzado.');
          break;
        
        case 'start':
          console.log('Evento "start": La llamada ha comenzado.');
          break;

        case 'media':
          // 3. ¡AQUÍ ESTÁ TU AUDIO!
          const audioChunkBase64 = twilioMsg.media.payload;
          console.log(`Recibido chunk de audio de ${audioChunkBase64.length} bytes`);
          
          // --- AQUÍ VA TU LÓGICA DE BÚFER ---
          // 1. Convierte de Base64 a un Buffer de audio
          const audioBuffer = Buffer.from(audioChunkBase64, 'base64');
          
          // 2. Añádelo a tu búfer deslizante
          //    (Esta es la lógica que implementaremos a continuación)
          //    ej: miBufferGlobal.addChunk(audioBuffer);
          
          break;

        case 'stop':
          console.log('Evento "stop": La llamada ha terminado.');
          break;
      }
    } catch (error) {
      console.error('Error procesando el mensaje de WebSocket:', error);
    }
  });

  ws.on('close', () => {
    console.log('Conexión de WebSocket /stream cerrada.');
  });
});
// ----------------------------------------


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
