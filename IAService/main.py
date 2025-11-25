import uvicorn
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from faster_whisper import WhisperModel
from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
import torch
import librosa
import numpy as np
import tempfile
import shutil
import os
import time
import uuid

# ==========================================
# CONFIGURACIÓN E INICIALIZACIÓN DE MODELOS
# ==========================================

print("--- INICIANDO SERVIDOR DE IA ---")

# 1. Configuración de Dispositivo (CPU/GPU)
device_str = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Dispositivo detectado: {device_str}")

# --- CARGA DEL MODELO 1: WHISPER (Transcripción) ---
print("\n[1/2] Cargando modelo Whisper (large-v3)...")
#WHISPER_MODEL_SIZE = "small"
WHISPER_MODEL_SIZE = "base"
#WHISPER_COMPUTE_TYPE = "float16" if device_str == "cuda" else "int8"
WHISPER_COMPUTE_TYPE = "int8" # Siempre int8 en CPU para velocidad

try:
    whisper_model = WhisperModel(WHISPER_MODEL_SIZE, device=device_str, compute_type=WHISPER_COMPUTE_TYPE)
    print(f"✅ Whisper cargado exitosamente en {device_str} ({WHISPER_COMPUTE_TYPE}).")
except Exception as e:
    print(f"❌ Error fatal al cargar Whisper: {e}")
    exit(1)

# --- CARGA DEL MODELO 2: EMOCIONES (HuggingFace) ---
print("\n[2/2] Cargando modelo de Emociones...")
EMOTION_MODEL_ID = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"

try:
    emotion_model = AutoModelForAudioClassification.from_pretrained(EMOTION_MODEL_ID)
    feature_extractor = AutoFeatureExtractor.from_pretrained(EMOTION_MODEL_ID, do_normalize=True)
    
    # Mapeo de IDs a etiquetas (ej: 0 -> enojo)
    id2label = emotion_model.config.id2label
    
    # Mover a GPU si es posible
    emotion_device = torch.device(device_str)
    emotion_model = emotion_model.to(emotion_device)
    
    print(f"✅ Modelo de Emociones cargado exitosamente en {emotion_device}.")
except Exception as e:
    print(f"❌ Error fatal al cargar modelo de emociones: {e}")
    exit(1)


# ==========================================
# FUNCIONES AUXILIARES (Lógica de Negocio)
# ==========================================

def preprocess_emotion_audio(audio_path, extractor, max_duration=30.0):
    """Preprocesa el audio para el modelo de emociones usando librosa."""
    audio_array, sampling_rate = librosa.load(audio_path, sr=None)
    
    max_length = int(extractor.sampling_rate * max_duration)
    if len(audio_array) > max_length:
        audio_array = audio_array[:max_length]
    else:
        audio_array = np.pad(audio_array, (0, max_length - len(audio_array)))

    inputs = extractor(
        audio_array,
        sampling_rate=extractor.sampling_rate,
        max_length=max_length,
        truncation=True,
        return_tensors="pt",
    )
    return inputs

def get_emotion_prediction(audio_path):
    """Ejecuta la inferencia del modelo de emociones."""
    inputs = preprocess_emotion_audio(audio_path, feature_extractor)
    # Mover inputs al dispositivo correcto
    inputs = {key: value.to(emotion_device) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = emotion_model(**inputs)

    logits = outputs.logits
    predicted_id = torch.argmax(logits, dim=-1).item()
    return id2label[predicted_id]


# ==========================================
# APLICACIÓN FASTAPI
# ==========================================

app = FastAPI(title="API Unificada de Audio (Transcripción + Emociones)")

@app.get("/")
def read_root():
    return {
        "estado": "Activo",
        "modelos": {
            "transcripcion": "Whisper large-v3",
            "emociones": "Speech Emotion Recognition"
        },
        "dispositivo": device_str
    }

# --- ENDPOINT 1: TRANSCRIPCIÓN ---
@app.post("/trans")
def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Query(None, description="Código de idioma (ej. 'es') o None para autodetectar."),
    prompt: str = Form(None, description="Contexto previo del chat"),
    task: str = Query("transcribe", enum=["transcribe", "translate"])
):
    start_time = time.time()
    temp_file_path = None

    try:
        # Crear archivo temporal seguro
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        # Transcribir
        segments, info = whisper_model.transcribe(
            temp_file_path,
            beam_size=1,
            language=language,
            task=task,
            initial_prompt=prompt
        )

        full_text = " ".join([seg.text for seg in segments]).strip()
        end_time = time.time()

        return {
            "servicio": "transcripcion",
            "idioma_detectado": info.language,
            "confianza": info.language_probability,
            "texto": full_text,
            "tiempo_procesamiento": round(end_time - start_time, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en transcripción: {str(e)}")

    finally:
        # Limpieza
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


# --- ENDPOINT 2: EMOCIONES ---
@app.post("/emotion")
def predict_emotion_endpoint(file: UploadFile = File(...)):
    temp_file_path = None
    
    try:
        # Usar UUID para evitar colisiones y guardar en carpeta temporal del sistema
        file_extension = os.path.splitext(file.filename)[1]
        temp_filename = f"{uuid.uuid4()}{file_extension}"
        temp_file_path = os.path.join(tempfile.gettempdir(), temp_filename)

        # Guardar archivo
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Predecir
        print(f"Analizando emoción en: {temp_file_path}")
        emotion = get_emotion_prediction(temp_file_path)
        
        return {
            "servicio": "emociones",
            "archivo": file.filename,
            "emocion_detectada": emotion
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error en detección de emociones: {str(e)}")
    
    finally:
        # Limpieza
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except PermissionError:
                pass # A veces Windows bloquea el archivo brevemente


# ==========================================
# EJECUCIÓN
# ==========================================
if __name__ == "__main__":
    print("🚀 Iniciando servidor unificado en http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
    finally:
        # Limpieza
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except PermissionError:
                pass # A veces Windows bloquea el archivo brevemente


# ==========================================
# EJECUCIÓN
# ==========================================
if __name__ == "__main__":
    print("🚀 Iniciando servidor unificado en http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)