import traceback
import os
from transformers import AutoModelForAudioClassification, AutoProcessor, AutoFeatureExtractor

model_id = "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"

print(f"Attempting to load model: {model_id}")

try:
    print("Loading AutoProcessor...")
    try:
        processor = AutoProcessor.from_pretrained(model_id)
        print("✅ AutoProcessor loaded.")
    except Exception:
        print("⚠️ AutoProcessor failed, trying AutoFeatureExtractor...")
        traceback.print_exc()
        processor = AutoFeatureExtractor.from_pretrained(model_id)
        print("✅ AutoFeatureExtractor loaded.")

    print("Loading AutoModelForAudioClassification...")
    model = AutoModelForAudioClassification.from_pretrained(model_id)
    print("✅ Model loaded.")
    
    print("Checking id2label...")
    print(f"id2label: {model.config.id2label}")

except Exception:
    print("❌ FATAL ERROR:")
    traceback.print_exc()
