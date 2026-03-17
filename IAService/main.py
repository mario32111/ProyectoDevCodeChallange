import uvicorn
from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Form, WebSocket, WebSocketDisconnect
import requests
import httpx
from dotenv import load_dotenv

load_dotenv()  # Cargar variables de entorno (para GROQ_API_KEY)

from pydub import AudioSegment
from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
import torch
import torch.nn.functional as F
import librosa
import numpy as np
import tempfile
import shutil
import os
import time
import uuid
import wave
import asyncio

# ==========================================
# CONFIGURACIÓN E INICIALIZACIÓN
# ==========================================

print("--- INICIANDO SERVIDOR DE IA (3 MODELOS INDEPENDIENTES) ---")
device_str = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Dispositivo detectado: {device_str}")

# --- 1. WHISPER (Transcripción con GROQ API) ---
print(f"\n[1/3] Configurando Whisper via Groq API...")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
if not GROQ_API_KEY:
    print("⚠️ ADVERTENCIA: GROQ_API_KEY no encontrada. Transcripción no funcionará correctamente.")
else:
    print("✅ Groq API Configurada.")

# --- 2. EMOCIONES (Voz Humana) ---
print("\n[2/3] Cargando modelo de Emociones...")
EMOTION_MODEL_ID = "superb/wav2vec2-base-superb-er"  # El modelo estable

try:
    print(f"🔄 Cargando: {EMOTION_MODEL_ID}...")
    emotion_extractor = AutoFeatureExtractor.from_pretrained(EMOTION_MODEL_ID, cache_dir="./models_emotion")
    emotion_model = AutoModelForAudioClassification.from_pretrained(EMOTION_MODEL_ID, cache_dir="./models_emotion")
    emotion_model = emotion_model.to(device_str)
    id2label_emotion = emotion_model.config.id2label
    print(f"✅ Sistema de Emociones listo.")
except Exception as e:
    print(f"❌ Error fatal cargando emociones: {e}")
    exit(1)

# --- 3. SONIDO AMBIENTAL (Fondo/Peligros) ---
print("\n[3/3] Cargando modelo de Ambiente (AST)...")
ENV_MODEL_ID = "MIT/ast-finetuned-audioset-10-10-0.4593"

try:
    print(f"🔄 Cargando: {ENV_MODEL_ID}...")
    env_extractor = AutoFeatureExtractor.from_pretrained(ENV_MODEL_ID, cache_dir="./models_env")
    env_model = AutoModelForAudioClassification.from_pretrained(ENV_MODEL_ID, cache_dir="./models_env")
    env_model = env_model.to(device_str)
    id2label_env = env_model.config.id2label
    print(f"✅ Sistema Ambiental listo.")
except Exception as e:
    print(f"❌ Error fatal cargando modelo ambiental: {e}")
    exit(1)

# Lista de sonidos peligrosos para filtrar
DANGEROUS_SOUNDS = [
    "Gunshot, gunfire", "Explosion", "Cap gun", "Fusillade", "Artillery fire", 
    "Siren", "Police car (siren)", "Ambulance (siren)", "Fire engine, fire truck (siren)", 
    "Civil defense siren", "Screaming", "Crying, sobbing", "Whimper", "Glass", 
    "Breaking", "Shatter", "Smash, crash", "Aggressive"
]

# ==========================================
# FUNCIONES AUXILIARES
# ==========================================

def convert_to_wav_16k(file_path):
    """Convierte cualquier audio a WAV 16kHz Mono para las IAs"""
    try:
        audio = AudioSegment.from_file(file_path)
        wav_path = file_path.rsplit('.', 1)[0] + ".wav"
        # Exportar a WAV limpio
        audio.set_frame_rate(16000).set_channels(1).export(wav_path, format="wav")
        return wav_path
    except Exception as e:
        print(f"⚠️ Error conversión audio: {e}")
        return file_path

def predict_emotion_chunked(audio_path):
    """Lógica de ventanas para detectar emociones en audios largos"""
    TARGET_SR = 16000
    try:
        y, sr = librosa.load(audio_path, sr=TARGET_SR, mono=True)
    except: return None

    # Normalizar si es muy bajo
    if np.max(np.abs(y)) < 0.1: y = librosa.util.normalize(y)
    
    chunk_duration = 3.0
    chunk_samples = int(chunk_duration * TARGET_SR)
    
    # Crear chunks
    if len(y) < chunk_samples:
        chunks = [np.pad(y, (0, chunk_samples - len(y)), mode='constant')]
    else:
        stride = int(2.0 * TARGET_SR)
        chunks = [y[i : i + chunk_samples] for i in range(0, len(y) - chunk_samples + 1, stride)]
        if not chunks: chunks = [y]

    all_logits = []
    for chunk in chunks:
        inputs = emotion_extractor(chunk, sampling_rate=TARGET_SR, return_tensors="pt", padding=True)
        inputs = {k: v.to(device_str) for k, v in inputs.items()}
        with torch.no_grad():
            all_logits.append(emotion_model(**inputs).logits)

    if not all_logits: return None
    
    avg_logits = torch.mean(torch.stack(all_logits), dim=0)
    probs = F.softmax(avg_logits, dim=-1)
    
    scores = {id2label_emotion[i]: float(probs[0][i].item() * 100) for i in range(len(probs[0]))}
    predicted_label = id2label_emotion[torch.argmax(probs).item()]
    
    return {"dominante": predicted_label, "confianza": scores[predicted_label], "detalle": scores}

def predict_environment_ast(audio_path):
    """Detecta sonido de fondo (Sirenas, Disparos, etc.)"""
    TARGET_SR = 16000
    try:
        y, sr = librosa.load(audio_path, sr=TARGET_SR, mono=True)
    except: return None

    # El modelo AST procesa todo el clip (máx 10s usualmente, el extractor lo maneja)
    inputs = env_extractor(y, sampling_rate=TARGET_SR, return_tensors="pt", padding="max_length")
    inputs = {k: v.to(device_str) for k, v in inputs.items()}

    with torch.no_grad():
        logits = env_model(**inputs).logits

    # Sigmoid para multi-label (pueden sonar dos cosas a la vez)
    probs = torch.sigmoid(logits).cpu().detach().numpy()[0]
    
    # Top 5 sonidos
    top_5_indices = probs.argsort()[-5:][::-1]
    
    detected_sounds = []
    alerts = []
    
    for i in top_5_indices:
        label = id2label_env[i]
        confidence = float(probs[i] * 100)
        
        if confidence > 5.0: # Umbral mínimo de detección
            detected_sounds.append({"sonido": label, "probabilidad": round(confidence, 2)})
            
            # Checar si es peligroso
            if label in DANGEROUS_SOUNDS and confidence > 15.0:
                alerts.append(label)

    return {"alertas": alerts, "ambiente": detected_sounds}

# ==========================================
# API ENDPOINTS
# ==========================================

app = FastAPI()

# --- ENDPOINT 1: TRANSCRIPCIÓN ---
@app.post("/trans")
def transcribe_audio(file: UploadFile = File(...), language: str = Query(None)):
    temp_path = f"temp_{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    wav_path = None
    try:
        with open(temp_path, "wb") as f: shutil.copyfileobj(file.file, f)
        wav_path = convert_to_wav_16k(temp_path)
        
        if not GROQ_API_KEY:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY no está configurada en el servidor.")
            
        url = "https://api.groq.com/openai/v1/audio/transcriptions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }
        
        with open(wav_path, "rb") as audio_file:
            files = {
                "file": (os.path.basename(wav_path), audio_file, "audio/wav")
            }
            data = {
                "model": "whisper-large-v3-turbo",
            }
            if language:
                data["language"] = language
                
            response = requests.post(url, headers=headers, files=files, data=data)
            
        if response.status_code == 200:
            result = response.json()
            return {"texto": result.get("text", "").strip()}
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Error Groq API: {response.text}")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)
        if wav_path and os.path.exists(wav_path) and wav_path != temp_path: os.remove(wav_path)

# --- ENDPOINT 2: EMOCIONES (Voz Humana) ---
@app.post("/emotion")
def predict_emotion_endpoint(file: UploadFile = File(...)):
    temp_path = f"temp_{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    wav_path = None
    try:
        with open(temp_path, "wb") as f: shutil.copyfileobj(file.file, f)
        wav_path = convert_to_wav_16k(temp_path)
        
        start = time.time()
        result = predict_emotion_chunked(wav_path)
        
        return {
            "archivo": file.filename,
            "emocion": result["dominante"],
            "confianza": f"{round(result['confianza'], 2)}%",
            "detalles": result["detalle"],
            "tiempo": round(time.time() - start, 2)
        }
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(temp_path): os.remove(temp_path)
        if wav_path and os.path.exists(wav_path) and wav_path != temp_path: os.remove(wav_path)

# --- ENDPOINT 3: ANÁLISIS AMBIENTAL (Peligros de Fondo) ---
@app.post("/analyze")
def analyze_background_noise(file: UploadFile = File(...)):
    """Solo detecta sonido de fondo: Sirenas, disparos, tráfico, etc."""
    temp_path = f"temp_{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    wav_path = None
    try:
        with open(temp_path, "wb") as f: shutil.copyfileobj(file.file, f)
        # Convertimos a WAV 16k para que el modelo AST funcione perfecto
        wav_path = convert_to_wav_16k(temp_path)
        
        start = time.time()
        result = predict_environment_ast(wav_path)
        
        # Determinar nivel de riesgo basado SOLO en sonido de fondo
        risk_level = "NORMAL"
        if len(result['alertas']) > 0:
            risk_level = "PELIGRO DETECTADO"

        return {
            "archivo": file.filename,
            "riesgo_ambiental": risk_level,
            "alertas_fondo": result["alertas"],
            "todos_los_sonidos": result["ambiente"],
            "tiempo": round(time.time() - start, 2)
        }
    except Exception as e:
        return {"error": str(e)}
# ==========================================
# ENDPOINT DE WEBSOCKETS (VAD y STREAMING A GROQ)
# ==========================================

# Sesión global asincrónica para conexión Keep-Alive (Ahorra handshake TLS por cada audio)
groq_client = httpx.AsyncClient(timeout=10.0)

async def transcribe_buffer_to_groq(pcm_bytes, sample_rate):
    """Convierte PCM 16-bit a WAV en memoria y hace la petición a Groq (Sin usar disco ni bloques sincrónicos)."""
    if not GROQ_API_KEY: 
        return None
        
    try:
        import io
        wav_io = io.BytesIO()
        with wave.open(wav_io, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2) # 16 bits = 2 bytes
            wf.setframerate(sample_rate)
            wf.writeframes(pcm_bytes)
        
        wav_data = wav_io.getvalue()
            
        url = "https://api.groq.com/openai/v1/audio/transcriptions"
        
        # Petición 100% asíncrona real
        try:
            files = {"file": ("stream.wav", wav_data, "audio/wav")}
            data = {"model": "whisper-large-v3-turbo", "language": "es", "response_format": "json"}
            headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
            
            response = await groq_client.post(url, headers=headers, files=files, data=data)
            
            if response.status_code == 200:
                ret_json = response.json()
                return ret_json.get("text", "").strip()
            else:
                print(f"Error en Groq API ({response.status_code}): {response.text}")
                return None
        except Exception as req_e:
            print(f"Error request asíncrono Groq: {req_e}")
            return None
                
    except Exception as e:
        print(f"Error en transcribe_buffer_to_groq: {e}")
        return None

@app.websocket("/trans_stream")
async def websocket_transcribe(websocket: WebSocket):
    await websocket.accept()
    print("[WS VAD] Conexión abierta para streaming VAD a Groq.")
    
    # Parámetros esperados desde Twilio transformados por expressServer
    SAMPLE_RATE = 8000
    BYTES_PER_SAMPLE = 2  # 16-bit PCM
    
    # Afinación del Detector de Silencio (VAD simple por RMS)
    RMS_THRESHOLD = 500       # Si el volumen cae por debajo de esto, se considera silencio. (Ajustar si es muy sensible)
    SILENCE_TIME_LIMIT = 0.5  # Tiempo en segundos al cual enviamos la frase a Groq y la cortamos. REDUCIDO PARA MAYOR VELOCIDAD
    MIN_SPEECH_TIME = 0.3     # Ignorar interjecciones cortas o ruidos estáticos menores a este tiempo.
    
    buffer = bytearray()
    speech_buffer = bytearray()
    
    is_speaking = False
    silence_duration = 0.0
    speech_duration = 0.0
    
    try:
        while True:
            data = await websocket.receive_bytes()
            buffer.extend(data)
            
            # Extraemos en trozos lógicos de 100ms
            chunk_size = int(SAMPLE_RATE * BYTES_PER_SAMPLE * 0.1)
            
            while len(buffer) >= chunk_size:
                chunk = buffer[:chunk_size]
                buffer = buffer[chunk_size:]
                
                audio_np = np.frombuffer(chunk, dtype=np.int16)
                if len(audio_np) == 0: continue
                
                # Calcular RMS para este chunk (Volumen)
                audio_np_float = audio_np.astype(np.float32)
                rms = np.sqrt(np.mean(audio_np_float**2))
                
                if rms > RMS_THRESHOLD:
                    # Usuario está hablando activo
                    if not is_speaking:
                        print("[WS VAD] Habla detectada, iniciando captura...")
                    is_speaking = True
                    silence_duration = 0.0
                    speech_duration += 0.1
                    speech_buffer.extend(chunk)
                else:
                    # Usuario en pausa o silencio
                    if is_speaking:
                        silence_duration += 0.1
                        speech_buffer.extend(chunk) # Dejamos el silencio natural en la transcripción
                        speech_duration += 0.1
                        
                        # Si estuvo en pausa por 1 segundo, enviaremos la oración completa.
                        if silence_duration >= SILENCE_TIME_LIMIT:
                            
                            # Si de verdad habló una oración larga y no solo hizo un ruidito
                            if speech_duration >= MIN_SPEECH_TIME:
                                print(f"[WS VAD] Fin de intervención ({speech_duration:.1f}s). Transcribiendo con Groq...")
                                async def process_and_send(buf):
                                    start_time = time.time()
                                    text = await transcribe_buffer_to_groq(buf, SAMPLE_RATE)
                                    elapsed = time.time() - start_time
                                    print(f"[WS VAD] Groq tardó {elapsed:.2f}s")
                                    
                                    if text:
                                        print(f"[WS VAD] Transcrito exitoso: {text}")
                                        try:
                                            await websocket.send_json({"type": "transcription", "text": text})
                                        except Exception as e:
                                            print(f"[WS VAD] Error enviando evento a WS: {e}")
                                    else:
                                        print("[WS VAD] La transcripción quedó vacía o falló.")
                                    
                                asyncio.create_task(process_and_send(bytearray(speech_buffer)))
                            
                            # Reset de tiempos para la siguiente frase
                            is_speaking = False
                            silence_duration = 0.0
                            speech_duration = 0.0
                            speech_buffer.clear()
                            
    except WebSocketDisconnect:
        print("[WS VAD] Conexión de streaming cerrada por el cliente.")
    except Exception as e:
        print(f"[WS VAD] Error crítico en stream: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)