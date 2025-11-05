#!/usr/bin/env python3
"""
Test du système d'auto-switch des voix
"""
import requests
import json
import time

def test_autoswitch():
    """Teste l'auto-switch avec différents scénarios."""
    
    base_url = "http://localhost:8000"
    
    # Test 1: Voix existante (devrait marcher directement)
    print("🔸 Test 1: Voix existante")
    test_data = {
        'text': 'Bonjour, ceci est un test avec une voix valide.',
        'voice': 'fr-FR-DeniseNeural'
    }
    
    try:
        response = requests.post(f'{base_url}/api/tts', json=test_data, timeout=15)
        if response.status_code == 200:
            used_voice = response.headers.get('X-Used-Voice', 'Unknown')
            print(f"✅ Réussi avec voix: {used_voice}")
        else:
            print(f"❌ Échec: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Voix inexistante (devrait déclencher auto-switch)
    print("🔸 Test 2: Voix inexistante (auto-switch attendu)")
    test_data = {
        'text': 'Ceci est un test d auto-switch vers une voix française féminine.',
        'voice': 'fr-FR-VoixInexistante'  # Cette voix n'existe pas
    }
    
    try:
        response = requests.post(f'{base_url}/api/tts', json=test_data, timeout=15)
        if response.status_code == 200:
            used_voice = response.headers.get('X-Used-Voice', 'Unknown')
            print(f"✅ Auto-switch réussi! Voix utilisée: {used_voice}")
            
            # Sauvegarder pour vérification
            with open('test_autoswitch.mp3', 'wb') as f:
                f.write(response.content)
            print("📁 Audio sauvegardé dans test_autoswitch.mp3")
        else:
            print(f"❌ Échec: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erreur: {e}")

    print("\n" + "="*50 + "\n")

    # Test 3: Vérifier les voix disponibles pour comparaison
    print("🔸 Test 3: Liste des voix françaises disponibles")
    try:
        response = requests.get(f'{base_url}/api/voices-by-language/fr')
        if response.status_code == 200:
            data = response.json()
            female_voices = data.get('female_voices', [])
            print(f"📋 Voix françaises féminines disponibles ({len(female_voices)}):")
            for i, voice in enumerate(female_voices[:5], 1):  # Afficher les 5 premières
                name = voice.get('ShortName', voice.get('Name', 'Unknown'))
                locale = voice.get('Locale', 'Unknown')
                print(f"  {i}. {name} ({locale})")
            if len(female_voices) > 5:
                print(f"  ... et {len(female_voices) - 5} autres")
        else:
            print(f"❌ Impossible de récupérer les voix: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🎙️  Test du système d'auto-switch des voix TTS")
    print("=" * 60)
    
    # Vérifier que le serveur répond
    try:
        response = requests.get("http://localhost:8000/api/status", timeout=5)
        if response.status_code == 200:
            print("✅ Serveur TTS accessible\n")
            test_autoswitch()
        else:
            print("❌ Serveur TTS ne répond pas correctement")
    except Exception as e:
        print(f"❌ Impossible de contacter le serveur TTS: {e}")
        print("💡 Assurez-vous que le serveur est démarré avec: python app.py")