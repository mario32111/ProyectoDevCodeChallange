var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var voiceRouter = require('./routes/voice.js'); // <<< CAMBIO: Importamos tu router de /voice

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

/**
 * Función optimizada para guardar WAV claro
 */
function saveWavFile(mulawBuffer, filePath) {
    try {
        // 1. Convertir Mu-Law (8-bit) a PCM (16-bit)
        // El tamaño del buffer se duplica porque pasamos de 1 byte a 2 bytes por muestra
        const pcmBuffer = Buffer.alloc(mulawBuffer.length * 2);
        
        for (let i = 0; i < mulawBuffer.length; i++) {
            // Usamos la tabla para obtener el valor de 16 bits
            const pcmVal = muLawToPcmMap[mulawBuffer[i]];
            // Escribimos en Little Endian (estándar WAV)
            pcmBuffer.writeInt16LE(pcmVal, i * 2);
        }

        // 2. Crear el Encabezado WAV (Header) manualmente (44 bytes)
        const header = Buffer.alloc(44);
        const dataLength = pcmBuffer.length;
        const fileSize = 36 + dataLength;
        const sampleRate = 8000;
        const numChannels = 1;
        const bitsPerSample = 16;
        const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
        const blockAlign = numChannels * (bitsPerSample / 8);

        // RIFF chunk descriptor
        header.write('RIFF', 0);
        header.writeUInt32LE(fileSize, 4);
        header.write('WAVE', 8);
        // fmt sub-chunk
        header.write('fmt ', 12);
        header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
        header.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
        header.writeUInt16LE(numChannels, 22);
        header.writeUInt32LE(sampleRate, 24);
        header.writeUInt32LE(byteRate, 28);
        header.writeUInt16LE(blockAlign, 32);
        header.writeUInt16LE(bitsPerSample, 34);
        // data sub-chunk
        header.write('data', 36);
        header.writeUInt32LE(dataLength, 40);

        // 3. Unir Header + Audio PCM
        const finalWav = Buffer.concat([header, pcmBuffer]);

        // 4. Guardar
        fs.writeFileSync(filePath, finalWav);
        console.log(`📁 Audio CLARO guardado: ${filePath} (Tamaño: ${finalWav.length} bytes)`);

    } catch (error) {
        console.error(`❌ Error al guardar WAV:`, error);
    }
}
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


require('./ws/stream')(app);

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
