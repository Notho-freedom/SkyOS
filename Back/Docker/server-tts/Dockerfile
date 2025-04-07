# Utilise une image de base légère
FROM python:3.9-slim

# Installe les dépendances
RUN apt-get update && apt-get install -y \
    wget \
    espeak \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Installe Piper
RUN pip install piper-tts

# Télécharge un modèle de voix (ex: voix française)
RUN wget -O /tmp/fr_voice.onnx "https://huggingface.co/rhasspy/piper-tts/resolve/main/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx"

# Expose le port HTTP (par défaut 5000)
EXPOSE 5000

# Lance Piper en mode serveur HTTP
CMD ["piper", "--model", "/tmp/fr_voice.onnx", "--host", "0.0.0.0", "--port", "5000"]