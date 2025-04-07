import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// Initialisation Groq
const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

// Sauvegarde mémoire locale
const saveMemory = (prompt, response) => {
  let memory = JSON.parse(localStorage.getItem('ia-memory')) || [];
  memory.push({ prompt, response, timestamp: Date.now() });
  memory = memory.slice(-20); // Limite à 20 interactions
  localStorage.setItem('ia-memory', JSON.stringify(memory));
};

const GroqMegaAI = ({ userPreferredModel }) => {
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [shouldShowResponse, setShouldShowResponse] = useState(false);

  // Gestion de la reconnaissance vocale
  const { transcript, resetTranscript } = useSpeechRecognition();

  // Charger les modèles Groq au démarrage
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const result = await groq.models.list();
        const availableModels = result.data.map(model => model.id);
        setModels(availableModels);

        if (userPreferredModel && availableModels.includes(userPreferredModel)) {
          setCurrentModel(userPreferredModel);
        } else {
          setCurrentModel(availableModels[0]); // fallback par défaut
        }
      } catch (err) {
        console.error("Erreur de récupération des modèles:", err);
      }
    };

    fetchModels();
  }, [userPreferredModel]);

  // Fonction pour analyser le message et choisir le modèle
  const chooseModelBasedOnMessage = (inputMessage) => {
    if (inputMessage.includes("analyse")) {
      return models.find(m => m.includes("analyser")); // Par exemple, un modèle spécifique pour l'analyse
    } else if (inputMessage.includes("création") || inputMessage.includes("développement")) {
      return models.find(m => m.includes("créatif")); // Modèle pour la création ou développement
    } else if (inputMessage.includes("résumé")) {
      return models.find(m => m.includes("résumé")); // Modèle pour le résumé de texte
    } else {
      return currentModel; // Utiliser le modèle actuel par défaut
    }
  };

// Fonction pour supprimer les balises <think>...</think> et leur contenu
const removeThinkTags = (text) => {
  return text.replace(/<think>.*?<\/think>/gs, '');
};


  // Fonction pour changer automatiquement de modèle selon les critères
  const autoSwitchModel = (chatResponse, inputMessage) => {
    const nextModel = chooseModelBasedOnMessage(inputMessage);
    if (nextModel && nextModel !== currentModel) {
      setCurrentModel(nextModel);
      setResponse(`🔄 Modèle basculé automatiquement vers: ${nextModel}`);
    }
  };

  // Envoi du prompt à l'IA
  const sendPrompt = async (inputMessage) => {
    if (!inputMessage || !currentModel) return;

    try {
      setLoading(true);

      const chatResponse = await groq.chat.completions.create({
        model: currentModel,
        messages: [{ role: "user", content: inputMessage }],
      });

      let text = chatResponse.choices?.[0]?.message?.content || "🤖 Pas de réponse.";
      text = removeThinkTags(text); // Enlever les balises <think>...</think>

      setResponse(text);
      saveMemory(inputMessage, text); // Sauvegarder dans la mémoire locale

      // Vérifier si on doit basculer le modèle en fonction de la requête
      autoSwitchModel(text, inputMessage);

      // Demander au serveur de générer l'audio
      const responseAudio = await fetch('https://low-tts.onrender.com/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (responseAudio.ok) {
        const data = await responseAudio.json();
        const audioUrl = data.audioUrl;

        // Créer un élément audio et le lire
        const audioElement = new Audio(audioUrl);
        audioElement.play();
      } else {
        console.error("Erreur lors de la génération audio : ", responseAudio.status);
        setResponse("🚨 Erreur lors de la génération de l'audio.");
      }

      // Décider si on affiche la réponse texte
      if (inputMessage.toLowerCase().includes("afficher la réponse")) {
        setShouldShowResponse(true);
      } else {
        setShouldShowResponse(false);
      }

    } catch (err) {
      console.error("Erreur IA:", err);
      // Si quota atteint ou erreur, on switch automatiquement
      const nextModel = models.find(m => m !== currentModel);
      if (nextModel) {
        setCurrentModel(nextModel);
        setResponse("🔄 Modèle basculé automatiquement vers: " + nextModel);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'écoute vocale
  const handleVoiceInput = () => {
    if (listening) {
      resetTranscript();
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setListening(true);
    }
  };

  // Fonction pour changer de modèle manuellement
  const switchModel = () => {
    const nextModel = models.find(m => m !== currentModel);
    if (nextModel) {
      setCurrentModel(nextModel);
      setResponse("🔄 Modèle basculé automatiquement vers: " + nextModel);
    }
  };

  return (
    <div className="p-4 text-white bg-gray-900 rounded">
      <h3 className="mb-2 font-bold">🧠 IA Groq – Modèle: <span className="text-green-400">{currentModel}</span></h3>

      <textarea
        placeholder="Parle avec SkyOS..."
        value={transcript || message} // Utilisation de transcript si disponible
        onChange={e => setMessage(e.target.value)}
        className="w-full p-2 mb-2 text-white bg-gray-800 rounded"
      />
      <button onClick={() => sendPrompt(message)} disabled={loading} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
        Envoyer
      </button>

      <div className="mt-2">
        <button onClick={handleVoiceInput} className={`bg-${listening ? 'red' : 'green'}-600 hover:bg-${listening ? 'red' : 'green'}-700 px-4 py-2 rounded`}>
          {listening ? "Arrêter" : "🎙️ Parler"}
        </button>
        <span className="ml-2 text-sm text-gray-400">{listening ? "En écoute..." : "Appuyez pour parler"}</span>
      </div>

      <div className="mt-2">
        <button onClick={switchModel} className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700">
          🔄 Changer de modèle
        </button>
      </div>

      {shouldShowResponse && (
        <pre className="p-3 mt-4 overflow-auto bg-gray-800 rounded max-h-64">{response}</pre>
      )}
    </div>
  );
};

export default GroqMegaAI;
