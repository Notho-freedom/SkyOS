"use client"
import { motion } from "framer-motion"
import { Keyboard } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"

// Textes pour l'internationalisation
const texts = {
  keyboard: "Clavier",
  keyRepeatRate: "Vitesse de répétition des touches",
  delayUntilRepeat: "Délai avant répétition",
  slow: "Lente",
  fast: "Rapide",
  long: "Long",
  short: "Court",
  useFunctionKeys: "Utiliser les touches F1, F2, etc. comme touches de fonction standard",
  fnKeyNote: "Appuyez sur la touche Fn pour utiliser les fonctionnalités spéciales imprimées sur chaque touche.",
  keyboardShortcuts: "Raccourcis clavier",
  modify: "Modifier",
  missionControlShortcut: "Mission Control",
  screenCapture: "Capture d'écran",
  spotlightShortcut: "Spotlight",
  input: "Saisie",
  autoCorrect: "Correction automatique",
  autoCapitalize: "Majuscules automatiques",
  doubleSpacePeriod: "Point par double espace",
}

// Icônes utilisées dans ce composant
const icons = {
  keyboard: <Keyboard />,
}

const KeyboardSettings = ({ settingsState, updateSettings, contentVariants }) => {
  // Fonction pour gérer le changement de vitesse de répétition des touches
  const handleKeyRepeatRateChange = (e) => {
    updateSettings("keyRepeatRate", Number.parseInt(e.target.value))
  }

  // Fonction pour gérer le changement de délai avant répétition
  const handleDelayUntilRepeatChange = (e) => {
    updateSettings("delayUntilRepeat", Number.parseInt(e.target.value))
  }

  // Fonction pour gérer l'utilisation des touches de fonction
  const handleUseFunctionKeysToggle = (value) => {
    updateSettings("useFunctionKeys", value)
  }

  // Fonction pour gérer la correction automatique
  const handleAutoCorrectToggle = (value) => {
    updateSettings("autoCorrect", value)
  }

  // Fonction pour gérer les majuscules automatiques
  const handleAutoCapitalizeToggle = (value) => {
    updateSettings("autoCapitalize", value)
  }

  // Fonction pour gérer le point par double espace
  const handleDoubleSpacePeriodToggle = (value) => {
    updateSettings("doubleSpacePeriod", value)
  }

  // Fonction pour ouvrir l'éditeur de raccourcis clavier
  const handleOpenShortcutEditor = () => {
    console.log("Opening keyboard shortcut editor...")
    // Logique pour ouvrir l'éditeur de raccourcis clavier
  }

  return (
    <motion.div
      key="keyboard"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.keyboard} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-4">{texts.keyRepeatRate}</h3>
            <div className="flex items-center space-x-3">
              <span className="text-xs">{texts.slow}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settingsState.keyRepeatRate}
                  onChange={handleKeyRepeatRateChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="text-xs">{texts.fast}</span>
            </div>
          </div>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-4">{texts.delayUntilRepeat}</h3>
            <div className="flex items-center space-x-3">
              <span className="text-xs">{texts.long}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settingsState.delayUntilRepeat}
                  onChange={handleDelayUntilRepeatChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="text-xs">{texts.short}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.useFunctionKeys}</span>
              <ToggleSwitch isEnabled={settingsState.useFunctionKeys} onChange={handleUseFunctionKeysToggle} />
            </div>
            <p className="text-xs text-gray-500">{texts.fnKeyNote}</p>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{texts.keyboardShortcuts}</h3>
              <motion.button
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenShortcutEditor}
              >
                {texts.modify}
              </motion.button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{texts.missionControlShortcut}</span>
                <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">^↑</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{texts.screenCapture}</span>
                <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">⇧⌘3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{texts.spotlightShortcut}</span>
                <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">⌘Space</span>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.input}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.autoCorrect}</span>
              <ToggleSwitch isEnabled={settingsState.autoCorrect} onChange={handleAutoCorrectToggle} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.autoCapitalize}</span>
              <ToggleSwitch isEnabled={settingsState.autoCapitalize} onChange={handleAutoCapitalizeToggle} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{texts.doubleSpacePeriod}</span>
              <ToggleSwitch isEnabled={settingsState.doubleSpacePeriod} onChange={handleDoubleSpacePeriodToggle} />
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default KeyboardSettings
