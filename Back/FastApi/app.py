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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permet tous les en-têtes
)

async def find_fallback_voice(original_voice: str, voices_list: list):
    """Trouve une voix de fallback du même genre et de la même langue."""
    try:
        # Extraire les informations de la voix originale
        original_voice_info = None
        for voice in voices_list:
            if voice.get('ShortName') == original_voice or voice.get('Name') == original_voice:
                original_voice_info = voice
                break
        
        if not original_voice_info:
            # Si on ne trouve pas la voix originale, utiliser une voix française féminine par défaut
            for voice in voices_list:
                if voice.get('Locale', '').startswith('fr') and voice.get('Gender') == 'Female':
                    logger.info(f"Fallback to default French female voice: {voice.get('ShortName')}")
                    return voice.get('ShortName')
            return "fr-FR-DeniseNeural"  # Fallback ultime
        
        # Chercher des voix du même genre et de la même langue
        target_locale = original_voice_info.get('Locale', '')
        target_gender = original_voice_info.get('Gender', '')
        target_language = target_locale.split('-')[0] if target_locale else 'fr'
        
        # Chercher des alternatives dans le même locale d'abord
        same_locale_voices = [
            voice for voice in voices_list 
            if (voice.get('Locale') == target_locale and 
                voice.get('Gender') == target_gender and 
                voice.get('ShortName') != original_voice)
        ]
        
        if same_locale_voices:
            fallback = same_locale_voices[0].get('ShortName')
            logger.info(f"Found same locale fallback: {fallback}")
            return fallback
        
        # Sinon, chercher dans la même langue
        same_language_voices = [
            voice for voice in voices_list 
            if (voice.get('Locale', '').startswith(target_language) and 
                voice.get('Gender') == target_gender and 
                voice.get('ShortName') != original_voice)
        ]
        
        if same_language_voices:
            fallback = same_language_voices[0].get('ShortName')
            logger.info(f"Found same language fallback: {fallback}")
            return fallback
        
        # Dernier recours : n'importe quelle voix du même genre
        same_gender_voices = [
            voice for voice in voices_list 
            if (voice.get('Gender') == target_gender and 
                voice.get('ShortName') != original_voice)
        ]
        
        if same_gender_voices:
            fallback = same_gender_voices[0].get('ShortName')
            logger.info(f"Found same gender fallback: {fallback}")
            return fallback
        
        return "fr-FR-DeniseNeural"  # Fallback ultime
        
    except Exception as e:
        logger.error(f"Error finding fallback voice: {e}")
        return "fr-FR-DeniseNeural"


@app.post("/api/tts")
async def generate_tts(request: Request):
    try:
        data = await request.json()
        text = data.get("text", "")
        voice = data.get("voice", "fr-FR-DeniseNeural")  # Voix par défaut
        max_retries = 3  # Nombre maximum de tentatives
        
        logger.info(f"TTS Request: '{text[:30]}...' with voice '{voice}'")
        
        # Récupérer la liste des voix disponibles
        voices_list = await edge_tts.list_voices()
        
        current_voice = voice  # Initialiser current_voice
        
        for attempt in range(max_retries):
            try:
                current_voice = voice if attempt == 0 else await find_fallback_voice(voice, voices_list)
                logger.info(f"Attempt {attempt + 1}: Using voice '{current_voice}'")
                
                # Setup edge-tts
                communicate = edge_tts.Communicate(text, current_voice)
                audio_buffer = BytesIO()

                async for chunk in communicate.stream():
                    if chunk.get("type") == "audio" and "data" in chunk:
                        audio_buffer.write(chunk["data"])

                audio_buffer.seek(0)
                
                # Si on arrive ici, c'est que ça a marché
                if attempt > 0:
                    logger.info(f"TTS succeeded with fallback voice '{current_voice}' after {attempt + 1} attempts")
                
                return StreamingResponse(
                    content=audio_buffer,
                    media_type="audio/mpeg",
                    headers={"X-Used-Voice": current_voice}  # Indiquer quelle voix a été utilisée
                )

            except Exception as voice_error:
                logger.warning(f"Attempt {attempt + 1} failed with voice '{current_voice}': {voice_error}")
                if attempt == max_retries - 1:
                    # Dernière tentative échouée
                    raise voice_error
                # Continuer avec la prochaine tentative

    except Exception as e:
        logger.error(f"TTS Error after all attempts: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Erreur lors de la génération TTS après toutes les tentatives"}
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
        # Vérifier avec ShortName ET Name pour plus de compatibilité
        voice_available = any(
            voice.get('ShortName') == voice_name or 
            voice.get('Name') == voice_name or
            voice_name in voice.get('Name', '') 
            for voice in voices
        )
        if voice_available:
            return JSONResponse(content={"voice": voice_name, "available": True})
        else:
            # Debug: loggons les premières voix disponibles
            logger.info(f"Voice {voice_name} not found. First 3 available voices:")
            for i, voice in enumerate(voices[:3]):
                logger.info(f"  {i+1}. Name: {voice.get('Name')}, ShortName: {voice.get('ShortName')}")
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
