from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from gtts import gTTS
from datetime import datetime
import io
import logging
from langdetect import detect, LangDetectException
from pydub import AudioSegment

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TTSService:
    @staticmethod
    def detect_language(text: str) -> str:
        try:
            lang = detect(text)
            logger.info(f"Detected language: {lang}")
            return lang
        except LangDetectException as e:
            logger.warning(f"Language detection failed, defaulting to 'en': {str(e)}")
            return "en"  # Fallback à l'anglais

    async def generate_tts(self, text: str, lang: str = None):
        try:
            # Détection automatique si langue non spécifiée
            target_lang = lang if lang else self.detect_language(text)
            
            # Validation de la langue (gTTS supporte environ 40 langues)
            if len(target_lang) != 2:
                raise ValueError("Langue non supportée (code à 2 lettres requis)")

            # Génération TTS en mémoire
            tts = gTTS(text=text, lang=target_lang)
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)

            # Conversion en format universel
            audio = AudioSegment.from_mp3(audio_buffer)
            web_audio = io.BytesIO()
            audio.export(web_audio, format="mp3")
            web_audio.seek(0)

            return web_audio, target_lang

        except Exception as e:
            logger.error(f"TTS Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tts")
async def text_to_speech(text: str, lang: str = None):
    if not text or len(text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Le texte ne peut pas être vide")
    
    tts = TTSService()
    audio_stream, detected_lang = await tts.generate_tts(text, lang)
    
    return StreamingResponse(
        audio_stream,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f"inline; filename=tts_{datetime.now().strftime('%Y%m%d%H%M%S')}.mp3",
            "X-Detected-Language": detected_lang,
            "Cache-Control": "no-store"
        }
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}