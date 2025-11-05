# --- Importaciones necesarias ---
import os
import uuid  # Para nombres de archivo únicos
import shutil  # Para copiar archivos
import uvicorn  # El servidor que corre la app
from fastapi import FastAPI, UploadFile, File, HTTPException

# --- Importaciones de IA (Las que ya usaste) ---
import librosa
import torch
import numpy as np
from transformers import AutoModelForAudioClassification, AutoFeatureExtractor

print("Iniciando el servidor...")

# --- 1. Carga del Modelo (Se hace 1 sola vez al iniciar) ---
# Esta sección es idéntica a tu notebook
try:
    print("Cargando modelo (esto puede tardar)...")
    MODEL_ID = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"
    model = AutoModelForAudioClassification.from_pretrained(MODEL_ID)
    feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_ID, do_normalize=True)
    id2label = model.config.id2label
    
    # Decide si usar CPU o GPU
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    
    print(f"Modelo cargado exitosamente en: {device}")
except Exception as e:
    print(f"Error fatal al cargar el modelo: {e}")
    # Si el modelo no carga, no tiene sentido seguir
    exit()


# --- 2. Funciones de Predicción (Idénticas a tu notebook) ---
# He añadido la corrección de la tasa de muestreo que es importante

def preprocess_audio(audio_path, feature_extractor, max_duration=30.0):
    audio_array, sampling_rate = librosa.load(audio_path, sr=None)
    
    max_length = int(feature_extractor.sampling_rate * max_duration)
    if len(audio_array) > max_length:
        audio_array = audio_array[:max_length]
    else:
        audio_array = np.pad(audio_array, (0, max_length - len(audio_array)))

    inputs = feature_extractor(
        audio_array,
        sampling_rate=feature_extractor.sampling_rate,
        max_length=max_length,
        truncation=True,
        return_tensors="pt",
    )
    return inputs


def predict_emotion(audio_path):
    # Preprocesa el audio desde el archivo
    inputs = preprocess_audio(audio_path, feature_extractor)
    # Mueve los datos al mismo dispositivo que el modelo (CPU o GPU)
    inputs = {key: value.to(device) for key, value in inputs.items()}

    # Ejecuta la predicción
    with torch.no_grad():
        outputs = model(**inputs)

    # Procesa la respuesta
    logits = outputs.logits
    predicted_id = torch.argmax(logits, dim=-1).item()
    predicted_label = id2label[predicted_id]
    
    return predicted_label

# --- 3. Creación de la API (La parte nueva) ---
app = FastAPI()

@app.post("/predict")
async def create_prediction_endpoint(file: UploadFile = File(...)):
    """
    Este es el endpoint. Recibe un archivo de audio, lo guarda
    temporalmente, lo procesa y devuelve la emoción.
    """
    
    # Crea una carpeta temporal si no existe
    temp_dir = "temp_audio_files"
    os.makedirs(temp_dir, exist_ok=True)
    
    # Crea un nombre de archivo único para evitar colisiones
    # Ej: "temp_audio_files/123e4567-e89b-12d3-a456-426614174000.wav"
    file_extension = os.path.splitext(file.filename)[1]
    temp_path = os.path.join(temp_dir, f"{uuid.uuid4()}{file_extension}")
    
    try:
        # --- Guardado temporal del archivo ---
        # Guarda el audio que se subió en el 'temp_path'
        # Esto es necesario porque librosa.load() lee desde una ruta,
        # no desde un archivo en memoria.
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # --- Ejecución del Modelo ---
        # Ahora que el archivo existe en el disco, podemos procesarlo
        print(f"Procesando archivo: {temp_path}")
        emotion = predict_emotion(temp_path)
        
        # Devuelve el resultado en formato JSON
        return {"emotion": emotion, "filename": file.filename}

    except Exception as e:
        # Si algo sale mal, devuelve un error
        print(f"Error procesando el archivo: {e}")
        raise HTTPException(status_code=500, detail=f"Error procesando el audio: {e}")
    
    finally:
        # --- Limpieza ---
        # Pase lo que pase (éxito o error), borra el archivo temporal
        # para no llenar el disco duro.
        if os.path.exists(temp_path):
            os.remove(temp_path)

# --- 4. Correr el Servidor ---
if __name__ == "__main__":
    print("Iniciando servidor Uvicorn en http://127.0.0.1:8000")
    # Corre el servidor en el puerto 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)