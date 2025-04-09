import os
import asyncio
from io import BytesIO
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import edge_tts
import logging
import uvicorn
from langdetect import detect  # Ajoute cette importation pour détecter la langue

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permet tous les en-têtes
)

@app.post("/api/tts")
async def generate_tts(request: Request):
    try:
        data = await request.json()
        text = data.get("text", "")
        voice = data.get("voice", "fr-FR-DeniseNeural")  # Voix par défaut

        logger.info(f"TTS Request: '{text[:30]}...' with voice '{voice}'")

        # Setup edge-tts
        communicate = edge_tts.Communicate(text, voice)
        audio_buffer = BytesIO()

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_buffer.write(chunk["data"])

        audio_buffer.seek(0)

        return StreamingResponse(
            content=audio_buffer,
            media_type="audio/mpeg"
        )

    except Exception as e:
        logger.error(f"TTS Error: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Erreur lors de la génération TTS"}
        )


@app.get("/api/voices")
async def list_voices():
    """Retourne toutes les voix disponibles."""
    try:
        voices = await edge_tts.list_voices()
        return JSONResponse(content=voices)
    except Exception as e:
        logger.error(f"Error fetching voices: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Erreur lors de la récupération des voix"}
        )


@app.get("/api/status")
async def status():
    """Retourne le statut du serveur."""
    return JSONResponse(content={"status": "OK", "message": "Service TTS opérationnel"})


@app.get("/api/check-voice/{voice_name}")
async def check_voice(voice_name: str):
    """Vérifie si une voix spécifique est disponible."""
    try:
        voices = await edge_tts.list_voices()
        voice_available = any(voice['Name'] == voice_name for voice in voices)
        if voice_available:
            return JSONResponse(content={"voice": voice_name, "available": True})
        else:
            return JSONResponse(content={"voice": voice_name, "available": False})
    except Exception as e:
        logger.error(f"Error checking voice {voice_name}: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Erreur lors de la vérification de la voix {voice_name}"}
        )



@app.post("/api/voices-by-text")
async def voices_by_text(request: Request):
    """Retourne les voix associées à la langue détectée du texte."""
    try:
        data = await request.json()
        text = data.get("text", "")
        if not text:
            return JSONResponse(
                status_code=400,
                content={"error": "Le texte est requis"}
            )

        # Détecter la langue du texte
        language_code = detect(text)
        logger.info(f"Detected language: {language_code}")

        # Retourne les voix pour la langue détectée
        return await voices_by_language(language_code)

    except Exception as e:
        logger.error(f"Error fetching voices for text: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Erreur lors de la détection de la langue et récupération des voix"}
        )


@app.get("/api/voices-by-language/{language_code}")
async def voices_by_language(language_code: str):
    """Retourne les voix masculines et féminines disponibles pour une langue donnée."""
    try:
        voices = await edge_tts.list_voices()

        # Convertir le paramètre 'lang-' en format minuscule (par exemple 'fr' pour 'fr-FR', 'fr-CA', etc.)
        language_prefix = language_code.lower()

        # Filtrage des voix selon le préfixe de langue et le genre
        male_voices = [
            voice for voice in voices if voice['Locale'].lower().startswith(language_prefix) and voice['Gender'] == 'Male'
        ]
        female_voices = [
            voice for voice in voices if voice['Locale'].lower().startswith(language_prefix) and voice['Gender'] == 'Female'
        ]

        return JSONResponse(content={
            "male_voices": male_voices,
            "female_voices": female_voices
        })

    except Exception as e:
        logger.error(f"Error fetching voices for language {language_code}: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Erreur lors de la récupération des voix pour la langue {language_code}"}
        )


def aurun(host="0.0.0.0", port=8000):
    logger.info(f"Starting on http://{host}:{port}")
    uvicorn.run("app:app", host=host, port=port, reload=True)

if __name__ == "__main__":
    aurun()
