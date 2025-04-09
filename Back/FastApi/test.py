import requests
import pygame
import io
import json

# URL de ton serveur FastAPI (change en fonction de ton adresse)
base_url = "https://low-tts.onrender.com"  # Changez cette ligne si nécessaire

# 1. Test de la route /api/status
def test_status():
    response = requests.get(f"{base_url}/api/status")
    if response.status_code == 200:
        print("Status OK: ", response.json())
    else:
        print(f"Erreur lors de la récupération du statut: {response.status_code}, {response.text}")

# 2. Test de la route /api/tts
def test_tts():
    text = "Bonjour, ceci est un test de synthèse vocale avec le serveur FastAPI."
    payload = {"text": text, "voice": "fr-FR-DeniseNeural"}  # Voix par défaut ou à modifier selon ton test

    response = requests.post(f"{base_url}/api/tts", json=payload)

    if response.status_code == 200:
        print("TTS généré avec succès!")
        audio_stream = io.BytesIO(response.content)

        # Initialiser Pygame pour jouer l'audio
        pygame.mixer.init()
        pygame.mixer.music.load(audio_stream)
        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

    else:
        print(f"Erreur lors de la génération TTS: {response.status_code}, {response.text}")

# 3. Test de la route /api/voices
def test_voices():
    response = requests.get(f"{base_url}/api/voices")
    if response.status_code == 200:
        print("Voices disponibles: ", response.json())
    else:
        print(f"Erreur lors de la récupération des voix: {response.status_code}, {response.text}")

# 4. Test de la route /api/check-voice/{voice_name}
def test_check_voice():
    voice_name = "fr-FR-DeniseNeural"
    response = requests.get(f"{base_url}/api/check-voice/{voice_name}")
    if response.status_code == 200:
        print(f"Disponibilité de la voix {voice_name}: ", response.json())
    else:
        print(f"Erreur lors de la vérification de la voix {voice_name}: {response.status_code}, {response.text}")

# 5. Test de la route /api/voices-by-text
def test_voices_by_text():
    text = "Je voudrais savoir quelles voix sont disponibles."
    payload = {"text": text}
    response = requests.get(f"{base_url}/api/voices-by-text", json=payload)

    if response.status_code == 200:
        print(f"Voix disponibles pour le texte '{text[:30]}...': ", response.json())
    else:
        print(f"Erreur lors de la récupération des voix pour le texte: {response.status_code}, {response.text}")

# 6. Test de la route /api/voices-by-language/{language_code}
def test_voices_by_language():
    language_code = "fr"  # Tester pour le français
    response = requests.get(f"{base_url}/api/voices-by-language/{language_code}")

    if response.status_code == 200:
        print(f"Voix disponibles pour la langue {language_code}: ", response.json())
    else:
        print(f"Erreur lors de la récupération des voix pour {language_code}: {response.status_code}, {response.text}")

# Exécution de tous les tests
def run_tests():
    #test_status()
    #test_tts()
    #test_voices()
    #test_check_voice()
    test_voices_by_text()
    #test_voices_by_language()

if __name__ == "__main__":
    run_tests()
