"use client"

import { useState, useEffect, useRef } from "react"
import {
  Send,
  Mic,
  MicOff,
  Settings,
  Trash2,
  Volume2,
  VolumeX,
  MessageSquare,
  Bot,
  User,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  X,
  Check,
  Moon,
  Sun,
  Loader2,
  MessageCircle,
  Copy,
  Share2,
  Bookmark,
  Zap,
  Cpu,
} from "lucide-react"
import "./ai.css"

import Groq from "groq-sdk";


const loadGroqSdk = async () => {
  try {
    window.Groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});
    
    return window.Groq
  } catch (err) {
    console.error("Erreur de chargement de Groq:", err)
    throw err
  }
}

const initDb = async () => {
  try {
    // Chargement alternatif pour Dexie
    const { default: Dexie } = await import('dexie')
    return new Dexie("SkyOS_IA_DB")
  } catch (err) {
    console.error("Erreur de chargement de Dexie:", err)
    throw err
  }
}

export default function ChatInterface() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState("")
  const [conversationHistory, setConversationHistory] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageIndex: -1 })
  const [groq, setGroq] = useState(null)
  const [db, setDb] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState("")

  const recognitionRef = useRef(null)
  const silenceTimeoutRef = useRef(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Initialize libraries
  useEffect(() => {
    const initialize = async () => {
      try {
        // Charger Groq et Dexie en parallèle
        const [groq, dbInstance] = await Promise.all([
          loadGroqSdk(),
          initDb()
        ])

        
        dbInstance.version(1).stores({
          history: "++id,role,content,timestamp"
        })

        setGroq(groq)
        setDb(dbInstance)
        setInitialized(true)
        
      } catch (err) {
        console.error("Erreur d'initialisation:", err)
        setError("Erreur de chargement des bibliothèques. Veuillez réessayer.")
      }
    }

    initialize()
  }, [])

  // Initialize chat after libraries are loaded
  useEffect(() => {
    if (groq && db && !initialized) {
      initializeChat()
    }
  }, [groq, db, initialized])

  const initializeChat = async () => {
    try {
      setLoading(true)

      if (!groq || !db) {
        setError("Libraries not initialized. Please refresh the page.")
        return
      }

      // Get available models
      const result = await groq.models.list()
      const availableModels = result.data.map((model) => model.id)
      setModels(availableModels)

      // Select LLaMA 3 by default if available
      const defaultModel = availableModels.find((m) => m.includes("llama3")) || availableModels[0]
      setSelectedModel(defaultModel)

      // Load conversation history
      const history = await db.history.toArray()
      setConversationHistory(history)

      if (defaultModel) {
        await sendSystemConnectionPrompt(defaultModel, history)
      }

      setInitialized(true)
    } catch (err) {
      console.error("Initialization error:", err)
      setError("Failed to initialize chat. Please check your connection and refresh.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationHistory])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false })
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [contextMenu])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      showToast("Votre navigateur ne supporte pas la reconnaissance vocale.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "fr-FR"
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setMessage(transcript)

      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = setTimeout(() => {
        stopVoiceRecognition()
      }, 2000)
    }

    recognition.onerror = (e) => {
      console.error("Voice error:", e)
      stopVoiceRecognition()
    }

    recognition.onend = () => setIsListening(false)

    recognition.start()
    recognitionRef.current = recognition
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setIsListening(false)
      clearTimeout(silenceTimeoutRef.current)
    }
  }

  const sendSystemConnectionPrompt = async (model, history) => {
    try {
      const systemPrompt = "L'utilisateur vient de se connecter. Présente-toi brièvement en tant qu'assistant IA de SkyOS. Sois accueillant et professionnel."
      const messages = [
        { role: "system", content: "Historique de conversation:\n" + summarizeConversation(history) },
        { role: "user", content: systemPrompt },
      ]

      const loadingMessage = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      }
      setConversationHistory((prev) => [...prev, loadingMessage])

      const chatResponse = await groq.chat.completions.create({
        model,
        messages,
      })

      const content = removeThinkTags(chatResponse.choices?.[0]?.message?.content || "Bienvenue !")

      setConversationHistory((prev) => {
        const newHistory = [...prev]
        const loadingIndex = newHistory.findIndex((msg) => msg.isLoading)
        if (loadingIndex !== -1) {
          newHistory[loadingIndex] = {
            role: "assistant",
            content,
            timestamp: new Date(),
          }
        }
        return newHistory
      })

      await db.history.bulkAdd([{ role: "assistant", content, timestamp: new Date() }])

      if (audioEnabled) {
        await generateAndPlayAudio(content)
      }
    } catch (err) {
      console.error("System request error:", err)

      setConversationHistory((prev) => {
        const newHistory = [...prev]
        const loadingIndex = newHistory.findIndex((msg) => msg.isLoading)
        if (loadingIndex !== -1) {
          newHistory[loadingIndex] = {
            role: "assistant",
            content: "Désolé, je n'ai pas pu me connecter correctement. Veuillez réessayer.",
            timestamp: new Date(),
          }
        }
        return newHistory
      })
    }
  }

  const removeThinkTags = (text) => text.replace(/<think>.*?<\/think>/gs, "")

  const summarizeConversation = (history = conversationHistory) => {
    const maxMessages = 10
    const recentHistory = history.slice(-maxMessages)
    if (recentHistory.length === 0) return "Conversation initiale."
    return recentHistory.map((msg) => `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`).join("\n")
  }

  const showToast = (message) => {
    const toast = document.createElement("div")
    toast.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg opacity-0 transition-opacity duration-300"
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("opacity-100")
      setTimeout(() => {
        toast.classList.remove("opacity-100")
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 3000)
    }, 100)
  }

  const playAudio = async (audioBlob) => {
    try {
      if (!audioBlob) throw new Error("Aucun fichier audio trouvé.")
      const audioUrl = URL.createObjectURL(audioBlob)
      const contentType = audioBlob.type
      if (!contentType.includes("audio")) throw new Error("Type MIME non supporté.")

      const audioElement = new Audio(audioUrl)
      audioElement.play()
      audioElement.onended = () => URL.revokeObjectURL(audioUrl)
    } catch (err) {
      console.error("Audio playback error:", err)
    }
  }

  const sanitizeTextForTTS = (text) => {
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/[^\w\sÀ-ÿ.,!?'-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  const generateAndPlayAudio = async (text) => {
    try {
      const responseVoices = await fetch("https://low-tts.onrender.com/api/voices-by-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sanitizeTextForTTS(text) }),
      })

      if (!responseVoices.ok) {
        throw new Error("Error retrieving voices")
      }

      const voices = await responseVoices.json()
      if (!voices || voices.length === 0) {
        throw new Error("No voices available for this text")
      }

      let audioBlob = null

      for (let i = 0; i < voices.female_voices.length; i++) {
        const voice = voices.female_voices[i]

        const responseAudio = await fetch("https://low-tts.onrender.com/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: sanitizeTextForTTS(text),
            voice: voice.ShortName,
          }),
        })

        if (responseAudio.ok) {
          audioBlob = await responseAudio.blob()
          break
        }
      }

      if (audioBlob) {
        await playAudio(audioBlob)
      } else {
        console.error("All audio generation attempts failed.")
      }
    } catch (err) {
      console.error("Audio generation error:", err)
    }
  }

  const sendPrompt = async () => {
    if (!message.trim() || !selectedModel) return

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    const loadingMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    }

    setConversationHistory((prev) => [...prev, userMessage, loadingMessage])
    setLoading(true)
    setMessage("")

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)

    const summary = summarizeConversation()
    const messages = [
      { role: "system", content: `Historique de conversation:\n${summary}` },
      { role: "user", content: message },
    ]

    try {
      const chatResponse = await groq.chat.completions.create({
        model: selectedModel,
        messages,
      })

      const content = removeThinkTags(chatResponse.choices?.[0]?.message?.content || "Pas de réponse.")

      setConversationHistory((prev) => {
        const newHistory = [...prev]
        const loadingIndex = newHistory.findIndex((msg) => msg.isLoading)
        if (loadingIndex !== -1) {
          newHistory[loadingIndex] = {
            role: "assistant",
            content,
            timestamp: new Date(),
          }
        }
        return newHistory
      })

      await db.history.bulkAdd([
        { role: "user", content: message, timestamp: new Date() },
        { role: "assistant", content, timestamp: new Date() },
      ])

      if (audioEnabled) {
        await generateAndPlayAudio(content)
      }
    } catch (err) {
      console.error("AI error:", err)

      setConversationHistory((prev) => {
        const newHistory = [...prev]
        const loadingIndex = newHistory.findIndex((msg) => msg.isLoading)
        if (loadingIndex !== -1) {
          newHistory[loadingIndex] = {
            role: "assistant",
            content: "Désolé, une erreur s'est produite lors de la génération de la réponse. Veuillez réessayer.",
            timestamp: new Date(),
          }
        }
        return newHistory
      })
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = async () => {
    try {
      await db.history.clear()
      setConversationHistory([])
      setClearDialogOpen(false)

      if (selectedModel) {
        await sendSystemConnectionPrompt(selectedModel, [])
      }
    } catch (err) {
      console.error("Error clearing history:", err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendPrompt()
    }
  }

  const formatTimestamp = (date) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleContextMenu = (e, messageIndex) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      messageIndex,
    })
  }

  const copyMessageContent = (index) => {
    const message = conversationHistory[index]
    if (message) {
      navigator.clipboard
        .writeText(message.content)
        .then(() => showToast("Message copié !"))
        .catch((err) => console.error("Erreur lors de la copie :", err))
    }
    setContextMenu({ ...contextMenu, visible: false })
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-6 max-w-md">
          <X className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Erreur</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    )
  }

  if (!initialized && !error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-900 dark:text-white">Initialisation de l'assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold">SkyOS Assistant</h1>
            <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 inline-block">
              {selectedModel.includes("llama") ? "LLaMA" : selectedModel.includes("mixtral") ? "Mixtral" : "Groq AI"}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={darkMode ? "Mode clair" : "Mode sombre"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={audioEnabled ? "Désactiver la voix" : "Activer la voix"}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setClearDialogOpen(true)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Effacer la conversation"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <button
            onClick={() => setInfoDialogOpen(true)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="À propos"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Paramètres"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Description */}
      <div className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 text-sm">
        <Cpu className="h-4 w-4 mr-2" />
        <span>Votre assistant personnel intelligent propulsé par Groq AI</span>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Aucun message pour le moment. Commencez la conversation!</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setMessage("Présente-toi")}
                className="px-3 py-1.5 text-sm flex items-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>Présente-toi</span>
              </button>
              <button
                onClick={() => setMessage("Quelles sont tes capacités ?")}
                className="px-3 py-1.5 text-sm flex items-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Zap className="h-4 w-4 mr-1" />
                <span>Quelles sont tes capacités ?</span>
              </button>
              <button
                onClick={() => setMessage("Raconte-moi une histoire")}
                className="px-3 py-1.5 text-sm flex items-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                <span>Raconte-moi une histoire</span>
              </button>
            </div>
          </div>
        ) : (
          conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              onContextMenu={(e) => handleContextMenu(e, index)}
            >
              <div
                className={`max-w-3xl rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {msg.isLoading ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-xs mt-1 opacity-70 flex justify-between items-center">
                      <span>{formatTimestamp(msg.timestamp)}</span>
                      <button
                        onClick={() => copyMessageContent(index)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copier"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <textarea
            ref={textareaRef}
            placeholder="Tapez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 pr-16 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            style={{ minHeight: "44px", maxHeight: "150px" }}
            onInput={(e) => {
              e.target.style.height = "auto"
              e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`
            }}
          />

          <div className="absolute right-2 bottom-2 flex space-x-1">
            <button
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              className={`p-2 rounded-full ${isListening ? "bg-red-500 text-white" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              aria-label={isListening ? "Arrêter la dictée" : "Dicter un message"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={sendPrompt}
              disabled={loading || !message.trim()}
              className={`p-2 rounded-full ${loading || !message.trim() ? "text-gray-400" : "text-white bg-blue-500 hover:bg-blue-600"}`}
              aria-label="Envoyer"
            >
              {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showModelSelector ? "Masquer le modèle" : "Changer de modèle"}
            {showModelSelector ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>

          {loading && (
            <div className="flex items-center">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              <span>Génération en cours...</span>
            </div>
          )}
        </div>

        {showModelSelector && (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model)
                  setShowModelSelector(false)
                }}
                className={`p-2 text-left rounded text-sm ${
                  selectedModel === model
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear conversation dialog */}
      {clearDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Effacer la conversation</h3>
              <button onClick={() => setClearDialogOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6">Êtes-vous sûr de vouloir effacer tout l'historique de conversation ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setClearDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={clearConversation}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info dialog */}
      {infoDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">À propos de SkyOS Assistant</h3>
              <button onClick={() => setInfoDialogOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p>
                SkyOS Assistant est une interface de chat IA professionnelle qui utilise les modèles de Groq pour générer
                des réponses intelligentes.
              </p>

              <div>
                <h4 className="font-bold mb-2">Fonctionnalités :</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Conversation avec des modèles d'IA avancés</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Reconnaissance vocale pour dicter vos messages</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Synthèse vocale pour écouter les réponses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Historique de conversation sauvegardé localement</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Interface intuitive et professionnelle</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-center pt-4">
                <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                <span>Propulsé par Groq AI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings dialog */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Paramètres</h3>
              <button onClick={() => setSettingsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Synthèse vocale</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Activer la lecture audio des réponses</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioEnabled}
                    onChange={() => setAudioEnabled(!audioEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mode sombre</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Changer l'apparence de l'interface</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <div>
                <h4 className="font-medium mb-2">Modèle d'IA</h4>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                >
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Les modèles LLaMA et Mixtral offrent les meilleures performances.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-50"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => copyMessageContent(contextMenu.messageIndex)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Copy className="h-4 w-4 mr-2" />
            <span>Copier</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Partager</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <Bookmark className="h-4 w-4 mr-2" />
            <span>Sauvegarder</span>
          </button>
        </div>
      )}
    </div>
  )
}