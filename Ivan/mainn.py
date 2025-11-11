import uvicorn  # Servidor para ejecutar la API
from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Request
from faster_whisper import WhisperModel
import tempfile  # Para crear archivos temporales
import shutil    # Para copiar el contenido de los archivos
import os        # Para eliminar el archivo temporal
import time      # Para medir el tiempo de la solicitud

# --- 1. Cargar el Modelo al Iniciar ---
# Este código se ejecuta UNA VEZ cuando inicias el servidor, no por cada solicitud.

# --- 1. Cargar el Modelo al Iniciar (Modo Dinámico) ---
import torch

print("Cargando modelo Whisper (large-v3)...")
MODEL_SIZE = "large-v3"

# --- Lógica Dinámica ---
# Comprobar si CUDA (GPU de NVIDIA) está disponible
if torch.cuda.is_available():
    print("GPU (CUDA) detectada. Cargando modelo en la GPU.")
    DEVICE = "cuda"
    COMPUTE_TYPE = "float16" # Óptimo para GPUs modernas
else:
    print("Advertencia: No se detectó GPU compatible con CUDA.")
    print("Cargando modelo en la CPU (esto será más lento).")
    DEVICE = "cpu"
    COMPUTE_TYPE = "int8" # 'int8' es mucho más rápido que 'default' en CPU
# ---------------------

try:
    # Cargar el modelo con la configuración dinámica
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
    print(f"Modelo cargado exitosamente en {DEVICE} con {COMPUTE_TYPE}.")
    
except Exception as e:
    print(f"Error fatal al cargar el modelo: {e}")
    # Si falla aquí, es probable que sea un problema con los archivos del modelo
    # o una configuración de CTranslate2 incorrecta.
    # En este punto, la aplicación probablemente no pueda continuar.
    exit(1) # Salir si el modelo no se puede cargar


# --- 2. Crear la Aplicación FastAPI ---
app = FastAPI()

# --- 3. Crear el Endpoint de Transcripción ---
@app.post("/trans/")
def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Query(None, description="Código de idioma (ej. 'es', 'en') o None para autodetectar."),
    task: str = Query("transcribe", enum=["transcribe", "translate"])
):
    """
    Transcribe un archivo de audio subido.
     FastAPI ejecuta esto en un grupo de hilos separado, por lo que no bloquea
    el servidor principal, aunque model.transcribe() es una llamada bloqueante.
    """
    start_time = time.time()

     # Debemos guardar el archivo subido en el disco temporalmente porque
     # el método .transcribe() de faster-whisper funciona mejor con una ruta de archivo.
    temp_file_path = None
    try:
        # Crear un archivo temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as temp_file:
            # Copiar el contenido del archivo subido al archivo temporal
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        # --- 4. Ejecutar la Transcripción ---
        # Esta es la misma lógica que construimos antes, ahora ejecutándose en el archivo temporal
        segments, info = model.transcribe(
            temp_file_path,
            beam_size=1,       # Mantener en 1 por velocidad y para evitar bugs de traducción
            language=language, # El usuario puede especificarlo, o es None (autodetectar)
            task=task          # "transcribe" (por defecto) o "translate"
        )

        # Recolectar el texto
        full_text = " ".join([seg.text for seg in segments]).strip()

        end_time = time.time()

        # --- 5. Devolver el Resultado ---
        return {
            "idioma_detectado": info.language,
            "confianza": info.language_probability,
            "tarea": task,
            "transcripcion": full_text,
            "tiempo_procesamiento_segundos": round(end_time - start_time, 2)
        }
     
    except Exception as e:
        # Capturar cualquier error
        raise HTTPException(status_code=500, detail=str(e))
 
    finally:
        # Asegurarse de que el archivo temporal siempre se elimine
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
# --- 6. Añadir un Endpoint "Raíz" para Pruebas ---
@app.get("/")
def read_root():
    return {"mensaje": f"La API de Transcripción Whisper está funcionando con {MODEL_SIZE} en {DEVICE}"}
# --- 7. (Opcional) Ejecutar el Servidor si el Script se Ejecuta Directamente ---
if __name__ == "__main__":
    print(f"Iniciando servidor FastAPI en http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
