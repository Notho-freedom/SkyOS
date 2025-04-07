import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";

// Initialisation de Groq
const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

const GroqAIWithModelSelection = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  // Historique des messages sous forme de tableau d'objets { role, content }
  const [conversationHistory, setConversationHistory] = useState([]);

  // Charger les modèles disponibles au démarrage
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const result = await groq.models.list();
        const availableModels = result.data.map(model => model.id);
        setModels(availableModels);

        if (availableModels.length > 0) {
          setSelectedModel(availableModels[0]); // Sélectionner le premier modèle par défaut
        }
      } catch (err) {
        console.error("Erreur de récupération des modèles:", err);
      }
    };

    fetchModels();
  }, []);

  // Fonction pour supprimer les balises <think>...</think> et leur contenu
  const removeThinkTags = (text) => {
    return text.replace(/<think>.*?<\/think>/gs, '');
  };

  // Fonction pour générer un résumé de la conversation
  // Ici, on se contente d'une fenêtre glissante des 5 derniers messages
  // Tu pourras remplacer cette logique par un appel à un modèle de résumé
  const summarizeConversation = () => {
    const maxMessages = 5;
    const recentHistory = conversationHistory.slice(-maxMessages);
    if (recentHistory.length === 0) return "Conversation initiale.";
    return recentHistory
      .map((msg) => `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`)
      .join("\n");
  };

  // Envoi du message à l'IA en incluant le résumé historique
  const sendPrompt = async () => {
    if (!message || !selectedModel) return;

    setLoading(true);

    // Générer le résumé de la conversation
    const summary = summarizeConversation();

    // Structurer les messages pour le modèle : 
    // - Un message "system" avec le résumé historique
    // - Un message "user" avec la nouvelle requête
    const messages = [
      { role: "system", content: `Historique de conversation:\n${summary}` },
      { role: "user", content: message },
    ];

    try {
      const chatResponse = await groq.chat.completions.create({
        model: selectedModel,
        messages: messages,
      });

      const text = removeThinkTags(chatResponse.choices?.[0]?.message?.content || "Pas de réponse.");
      setResponse(text);

      // Mettre à jour l'historique de la conversation
      setConversationHistory(prevHistory => [
        ...prevHistory,
        { role: "user", content: message },
        { role: "assistant", content: text }
      ]);

      // Génération audio
      const responseAudio = await fetch('https://low-tts.onrender.com/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (responseAudio.ok) {
        const audioBlob = await responseAudio.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        audioElement.play();
      } else {
        console.error("Erreur lors de la génération audio");
        setResponse("Erreur lors de la génération de l'audio.");
      }
    } catch (err) {
      console.error("Erreur IA:", err);
      setResponse("Erreur lors de la communication avec l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-white bg-gray-900 rounded">
      <h3 className="mb-2 font-bold">🧠 IA Groq</h3>

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

      {/* Zone de saisie du message */}
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

      {/* Affichage de la réponse */}
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
