import React, { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import Dexie from "dexie";

// Initialisation de Groq
const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

// Initialisation de Dexie pour l'historique
const db = new Dexie("SkyOS_IA_DB");
db.version(1).stores({
  history: '++id,role,content'
});

const GroqAIWithModelSelection = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  
  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = true;
    recognition.continuous = true;
  
    recognition.onstart = () => setIsListening(true);
  
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(transcript);
  
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        stopVoiceRecognition();
        sendPrompt();
      }, 2000); // 2s de silence = go !
    };
  
    recognition.onerror = (e) => {
      console.error("Erreur vocale :", e);
      stopVoiceRecognition();
    };
  
    recognition.onend = () => setIsListening(false);
  
    recognition.start();
    recognitionRef.current = recognition;
  };
  

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      clearTimeout(silenceTimeoutRef.current);
    }
  };
  

  // Ref pour éviter le double appel
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return; // évite double exécution
    hasInitialized.current = true;

    const init = async () => {
      try {
        const result = await groq.models.list();
        const availableModels = result.data.map(model => model.id);
        setModels(availableModels);
        if (availableModels.length > 0) setSelectedModel(availableModels[0]);

        const history = await db.history.toArray();
        setConversationHistory(history);

        if (availableModels.length > 0) {
          await sendSystemConnectionPrompt(availableModels[0], history);
        }
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
      }
    };

    init();
  }, []);

  const sendSystemConnectionPrompt = async (model, history) => {
    try {
      const systemPrompt = "utilisateur conneter";
      const messages = [
        { role: "system", content: "Historique de conversation:\n" + summarizeConversation(history) },
        { role: "user", content: systemPrompt }
      ];

      const chatResponse = await groq.chat.completions.create({
        model,
        messages
      });

      const content = removeThinkTags(chatResponse.choices?.[0]?.message?.content || "Bienvenue !");
      setResponse(content);

      // Ajout à l'historique
      await db.history.bulkAdd([
        { role: "user", content: systemPrompt },
        { role: "assistant", content }
      ]);
      setConversationHistory(await db.history.toArray());
      await generateAndPlayAudio(content);
    } catch (err) {
      console.error("Erreur dans la requête système:", err);
    }
  };

  const removeThinkTags = (text) => text.replace(/<think>.*?<\/think>/gs, '');

  const summarizeConversation = (history = conversationHistory) => {
    const maxMessages = 5;
    const recentHistory = history.slice(-maxMessages);
    if (recentHistory.length === 0) return "Conversation initiale.";
    return recentHistory
      .map((msg) => `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`)
      .join("\n");
  };

  const playAudio = async (audioBlob) => {
    try {
      if (!audioBlob) throw new Error("Aucun fichier audio trouvé.");
      const audioUrl = URL.createObjectURL(audioBlob);
      const contentType = audioBlob.type;
      if (!contentType.includes("audio")) throw new Error("Type MIME non supporté.");

      const audioElement = new Audio(audioUrl);
      audioElement.play();
      audioElement.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (err) {
      console.error("Erreur lecture audio:", err);
    }
  };

  const sanitizeTextForTTS = (text) => {
    return text
      .replace(/<[^>]*>/g, '')                  // Supprime toutes les balises HTML
      .replace(/[^\w\sÀ-ÿ.,!?'-]/g, '')         // Supprime tous les caractères spéciaux sauf ponctuation basique
      .replace(/\s+/g, ' ')                     // Nettoie les espaces multiples
      .trim();                                  // Supprime les espaces de début et fin
  };


  const generateAndPlayAudio = async (text) => {
    try {
      // 1. Appel à l'API pour détecter la langue du texte et récupérer les voix
      const responseVoices = await fetch('http://localhost:8000/api/voices-by-text', {
        method: 'POST',  // Change de GET à POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sanitizeTextForTTS(text) }), // Envoie les données dans le corps de la requête
      });
  
      if (!responseVoices.ok) {
        throw new Error('Erreur lors de la récupération des voix');
      }
  
      const voices = await responseVoices.json();
      if (!voices || voices.length === 0) {
        throw new Error('Aucune voix disponible pour ce texte');
      }
  
      // 2. Essayer chaque voix disponible jusqu'à ce qu'une fonctionne
      let selectedVoice = null;
      let audioBlob = null;
      console.log(voices);
  

  
        for (let name = 0; name < voices.female_voices.length; name++) {
          const element = voices.female_voices[name];
          
          // Appel à l'API de synthèse vocale avec la voix dynamique
          const responseAudio = await fetch('http://localhost:8000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: sanitizeTextForTTS(text),
              voice: element.ShortName, // Utilisation de la voix dynamique sélectionnée
            }),
          });

          if (responseAudio.ok) {
            audioBlob = await responseAudio.blob();
            break; // Si l'audio est généré avec succès, on sort de la boucle
          }

        }


      if (audioBlob) {
        await playAudio(audioBlob);
      } else {
        console.error('Toutes les tentatives de génération audio ont échoué.');
        setResponse('Erreur lors de la génération de l\'audio.');
      }
    } catch (err) {
      console.error('Erreur lors de la génération de l\'audio:', err);
      setResponse('Erreur lors de la génération de l\'audio.');
    }
  };
  

  

  const sendPrompt = async () => {
    if (!message || !selectedModel) return;
    setLoading(true);

    const summary = summarizeConversation();
    const messages = [
      { role: "system", content: `Historique de conversation:\n${summary}` },
      { role: "user", content: message },
    ];

    try {
      const chatResponse = await groq.chat.completions.create({
        model: selectedModel,
        messages,
      });

      const text = removeThinkTags(chatResponse.choices?.[0]?.message?.content || "Pas de réponse.");
      setResponse(text);

      const newHistory = [
        { role: "user", content: message },
        { role: "assistant", content: text }
      ];

      // Enregistrer dans Dexie
      await db.history.bulkAdd(newHistory);
      setConversationHistory(await db.history.toArray());

      await generateAndPlayAudio(text);
      setMessage('');
    } catch (err) {
      console.error("Erreur IA:", err);
      setResponse("Erreur lors de la communication avec l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-white bg-gray-900 rounded">
      <h3 className="mb-2 font-bold">🧠 IA Groq (avec mémoire locale)</h3>

      {/* Sélection du modèle */}
      <div className="mb-4">
        <label htmlFor="modelSelect" className="block text-sm">Choisir un modèle:</label>
        <select
          id="modelSelect"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 mb-2 text-white bg-gray-800 rounded"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Saisie */}
      <textarea
        placeholder="Entrez votre message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 mb-2 text-white bg-gray-800 rounded"
      />

      <button 
        onClick={sendPrompt} 
        disabled={loading} 
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {loading ? "Chargement..." : "Envoyer"}
      </button>

  <button onClick={isListening ? stopVoiceRecognition : startVoiceRecognition} className={`ml-2 px-4 py-2 rounded ${isListening ? 'bg-red-600' : 'bg-green-600'} hover:opacity-80`}>{isListening ? "🎙️ Stop" : "🎤 Démarrer voix"}</button>


      {/* Réponse IA */}
      {response && (
        <div className="mt-4">
          <h4 className="font-semibold">Réponse :</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GroqAIWithModelSelection;
