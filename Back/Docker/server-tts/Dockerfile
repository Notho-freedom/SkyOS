# Utilise une image de base légère
FROM python:3.9-slim

# Installe les dépendances système
RUN apt-get update && apt-get install -y \
    wget \
    espeak \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Crée un utilisateur non-root
RUN useradd -m piperuser && \
    mkdir -p /app/models && \
    chown piperuser:piperuser /app

# Passe à l'utilisateur non-root
USER piperuser
WORKDIR /app

# Installe Piper
RUN python -m venv /app/venv && \
    . /app/venv/bin/activate && \
    pip install --upgrade pip && \
    pip install piper-tts

# Télécharge le modèle français LOW (public)
RUN wget -O /app/models/fr_voice.onnx \
    "https://github.com/rhasspy/piper/releases/download/2023.12.06-1/fr_FR-siwis-low.onnx"

# Port d'écoute
EXPOSE 5000

# Commande de démarrage
CMD ["/app/venv/bin/piper", "--model", "/app/models/fr_voice.onnx", "--host", "0.0.0.0", "--port", "5000"]