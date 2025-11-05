import requests
import pygame
import io
import json

# URL de ton serveur FastAPI (change en fonction de ton adresse)  
base_url = "http://localhost:8000"  # Serveur distant (fonctionnel)

# 1. Test de la route /api/status
def test_status():
    response = requests.get(f"{base_url}/api/status")
    if response.status_code == 200:
        print("Status OK: ", response.json())
    else:
        print(f"Erreur lors de la récupération du statut: {response.status_code}, {response.text}")

# 2. Test de la route /api/tts
def test_tts():
    # Test d'abord avec une voix anglaise pour vérifier que le système fonctionne
    print("🔍 Test avec une voix anglaise d'abord...")
    text_en = "Hello, this is a test of text to speech."
    payload_en = {"text": text_en, "voice": "en-US-AriaNeural"}
    
    response = requests.post(f"{base_url}/api/tts", json=payload_en)
    if response.status_code == 200:
        print("✅ Voix anglaise fonctionne!")
    else:
        print(f"❌ Erreur avec voix anglaise: {response.status_code}, {response.text}")
        return
    
    # Maintenant test avec le français
    text = "Bonjour, ceci est un test de synthèse vocale."
    
    # Essayons plusieurs voix françaises disponibles
    voices_to_try = [
        "fr-FR-HenriNeural",  # Voix masculine française
        "fr-FR-DeniseNeural", # Voix féminine française  
        "fr-CA-SylvieNeural", # Voix canadienne française
        "fr-FR-BrigitteNeural" # Autre voix française
    ]
    
    for voice in voices_to_try:
        print(f"\n🎤 Test avec la voix: {voice}")
        payload = {"text": text, "voice": voice}
        
        response = requests.post(f"{base_url}/api/tts", json=payload)

        if response.status_code == 200:
            print("✅ TTS généré avec succès!")
            audio_stream = io.BytesIO(response.content)

            # Initialiser Pygame pour jouer l'audio
            pygame.mixer.init()
            pygame.mixer.music.load(audio_stream)
            pygame.mixer.music.play()
            print("🔊 Lecture de l'audio en cours...")

            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
                
            print("✅ Audio terminé")
            break  # Sortir après le premier succès
        else:
            print(f"❌ Erreur avec {voice}: {response.status_code}, {response.text}")
    else:
        print("❌ Aucune voix n'a fonctionné")

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
    response = requests.post(f"{base_url}/api/voices-by-text", json=payload)

    if response.status_code == 200:
        print(f"Voix disponibles pour le texte '{text[:30]}...': ", response.json())
    else:
        print(f"Erreur lors de la récupération des voix pour le texte: {response.status_code}, {response.text}")

# 6. Test de la route /api/voices-by-language/{language_code}
def test_voices_by_language():
    language_code = "fr"  # Tester pour le français
    response = requests.get(f"{base_url}/api/voices-by-language/{language_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"\n=== VOIX FÉMININES FRANÇAISES ===")
        female_voices = data.get('female_voices', [])
        
        for i, voice in enumerate(female_voices, 1):
            print(f"\n{i}. {voice['DisplayName']} ({voice['ShortName']})")
            print(f"   Région: {voice['LocaleName']}")
            print(f"   Locale: {voice['Locale']}")
            if 'VoiceTag' in voice and 'VoicePersonalities' in voice['VoiceTag']:
                personalities = voice['VoiceTag']['VoicePersonalities']
                if personalities:
                    print(f"   Personnalités: {', '.join(personalities)}")
            if 'VoiceTag' in voice and 'TailoredScenarios' in voice['VoiceTag']:
                scenarios = voice['VoiceTag']['TailoredScenarios']
                if scenarios:
                    print(f"   Scénarios: {', '.join(scenarios)}")
        
        print(f"\nTotal: {len(female_voices)} voix féminines françaises disponibles")
    else:
        print(f"Erreur lors de la récupération des voix pour {language_code}: {response.status_code}, {response.text}")

# Test simple de TTS
def simple_tts_test():
    print("=== TEST SIMPLE TTS ===")
    
    text = "Bonjour"
    
    # Testons plusieurs voix pour trouver une qui fonctionne
    voices_to_test = [
        "fr-FR-HenriNeural",
        "fr-CA-SylvieNeural", 
        "fr-BE-CharlineNeural",
        "en-US-AriaNeural",  # Fallback anglais
        "fr-FR-DeniseNeural"
    ]
    
    for voice in voices_to_test:
        print(f"\n🎤 Test avec: '{text}' | Voix: {voice}")
        
        # Vérifier que la voix existe
        check_response = requests.get(f"{base_url}/api/check-voice/{voice}")
        is_available = check_response.json().get('available', False)
        print(f"Disponibilité: {'✅' if is_available else '❌'} {is_available}")
        
        if not is_available:
            continue
            
        # Essayer la génération si disponible
        payload = {"text": text, "voice": voice}
        response = requests.post(f"{base_url}/api/tts", json=payload)
        
        print(f"Réponse TTS: Status {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Succès! Taille audio: {len(response.content)} bytes")
            # Sauvegarder l'audio
            filename = f"test_audio_{voice.replace(':', '_')}.mp3"
            with open(filename, "wb") as f:
                f.write(response.content)
            print(f"📁 Audio sauvegardé: '{filename}'")
            
            # Jouer l'audio
            try:
                pygame.mixer.init()
                pygame.mixer.music.load(io.BytesIO(response.content))
                pygame.mixer.music.play()
                print("🔊 Lecture en cours...")
                while pygame.mixer.music.get_busy():
                    pygame.time.Clock().tick(10)
                print("✅ Lecture terminée")
            except Exception as e:
                print(f"⚠️ Erreur lecture: {e}")
                
            return  # Succès, on s'arrête ici
        else:
            print(f"❌ Erreur: {response.text}")
    
    print("❌ Aucune voix fonctionnelle trouvée")

# Exécution de tous les tests
def run_tests():
    print("=== TEST DE LA SYNTHÈSE VOCALE ===")
    test_status()
    simple_tts_test()  # Test simple d'abord
    #test_tts()  # Test avec la voix française sélectionnée
    #test_voices()
    #test_check_voice()
    #test_voices_by_text()
    #test_voices_by_language()  # Focus sur les voix féminines françaises

if __name__ == "__main__":
    run_tests()
