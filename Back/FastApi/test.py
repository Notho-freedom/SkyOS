import requests
import io
import pygame
import edge_tts
import asyncio

# Fonction pour lister les voix et filtrer celles qui sont féminines et en français
async def list_french_female_voices():
    voices = await edge_tts.list_voices()
    # Filtrer les voix féminines en français
    female_french_voices = [voice for voice in voices if 'fr-' in voice['Locale'] and voice['Gender'] == 'Female']
    return female_french_voices

# Fonction pour tester chaque voix féminine française
async def test_french_female_voices():
    female_french_voices = await list_french_female_voices()
    
    for voice in female_french_voices:
        print(f"Testing voice: {voice['Name']}")
        # URL de ton serveur FastAPI
        url = "http://127.0.0.1:8000/api/tts"

        # Le texte à convertir en audio
        text = "Bonjour, voici un test de la synthèse vocale avec Edge TTS sur SkyOS."

        # Paramètres de la requête
        payload = {"text": text, "voice": voice['Name']}  # Utiliser le nom de la voix

        # Envoyer la requête POST pour récupérer l'audio
        response = requests.post(url, json=payload)

        # Vérifier si la requête a réussi
        if response.status_code == 200:
            print(f"TTS généré avec succès pour {voice['Name']}!")
            audio_stream = io.BytesIO(response.content)
            
            # Initialiser Pygame pour jouer l'audio
            pygame.mixer.init()
            pygame.mixer.music.load(audio_stream)
            pygame.mixer.music.play()
            
            # Attendre que l'audio soit fini
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
        else:
            print(f"Erreur lors de la génération TTS pour {voice['Name']}: {response.status_code}")

# Exécuter la fonction pour tester toutes les voix féminines françaises
asyncio.run(test_french_female_voices())
