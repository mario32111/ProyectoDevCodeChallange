var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var voiceRouter = require('./routes/voice.js'); // <<< CAMBIO: Importamos tu router de /voice
var chatRouter = require('./routes/chat.js');
var app = express();


const fs = require('fs');
const path = require('path');

const RECORDINGS_DIR = path.join(__dirname, 'recordings');
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR);
}

/**
 * --- TABLA DE DECODIFICACIÓN MU-LAW A PCM LINEAL ---
 * Esta tabla convierte los bytes comprimidos de telefonía (mu-law)
 * a audio de alta calidad de 16 bits (PCM).
 */
const muLawToPcmMap = new Int16Array(256);
for (let i = 0; i < 256; i++) {
  let input = ~i;
  let sign = (input & 0x80) ? -1 : 1;
  let exponent = (input >> 4) & 0x07;
  let mantissa = input & 0x0F;
  let sample = ((mantissa << 3) + 132) << exponent;
  muLawToPcmMap[i] = sign * (sample - 132);
}

// --- ¡NUEVO! Configura express-ws ---
// Esto "mejora" tu app de Express para que pueda manejar WebSockets
// Asegúrate de correr: npm install express-ws
var expressWs = require('express-ws')(app);
// ----------------------------------------

// Inicializamos el WebSocket
require('./ws/stream')(app);

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
app.use('/chat', chatRouter);


// ----------------------------------------


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
