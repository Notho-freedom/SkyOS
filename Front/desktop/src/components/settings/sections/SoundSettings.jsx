"use client"
import { motion } from "framer-motion"
import { Volume, VolumeX } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"

// Textes pour l'internationalisation
const texts = {
  sound: "Son",
  outputVolume: "Volume de sortie",
  mute: "Couper le son",
  showVolumeInMenuBar: "Afficher le volume dans la barre de menus",
  outputDevice: "Périphérique de sortie",
  internalSpeakers: "Haut-parleurs intégrés",
  defaultDevice: "Périphérique par défaut",
  hdmi: "HDMI",
  notConnected: "Non connecté",
  soundEffects: "Effets sonores",
  playSoundEffects: "Jouer les effets sonores",
  playStartupSound: "Jouer un son au démarrage",
  alertVolume: "Volume des alertes",
}

// Icônes utilisées dans ce composant
const icons = {
  volume: <Volume />,
  volumeX: <VolumeX />,
}

const SoundSettings = ({ settingsState, updateSettings, contentVariants }) => {
  // Fonction pour gérer le changement d'état du mode muet
  const handleMuteToggle = (value) => {
    updateSettings("muteSound", value)
  }

  // Fonction pour gérer l'affichage du volume dans la barre de menus
  const handleShowVolumeInMenuBarToggle = (value) => {
    updateSettings("showVolumeInMenuBar", value)
  }

  // Fonction pour gérer le changement de volume
  const handleVolumeChange = (e) => {
    updateSettings("volume", Number.parseInt(e.target.value))
  }

  // Fonction pour gérer le changement de volume des alertes
  const handleAlertVolumeChange = (e) => {
    updateSettings("alertVolume", Number.parseInt(e.target.value))
  }

  // Fonction pour sélectionner un périphérique de sortie
  const handleSelectOutputDevice = (device) => {
    console.log(`Selected output device: ${device}`)
    // Logique pour sélectionner le périphérique de sortie
  }

  return (
    <motion.div
      key="sound"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.sound} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-4">{texts.outputVolume}</h3>
            <div className="flex items-center space-x-3">
              <VolumeX className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settingsState.volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <Volume className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">{texts.mute}</span>
              <ToggleSwitch isEnabled={settingsState.muteSound} onChange={handleMuteToggle} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{texts.showVolumeInMenuBar}</span>
              <ToggleSwitch isEnabled={settingsState.showVolumeInMenuBar} onChange={handleShowVolumeInMenuBarToggle} />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-4">{texts.outputDevice}</h3>
            <div className="flex flex-col space-y-3">
              <div
                className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer"
                onClick={() => handleSelectOutputDevice("internal-speakers")}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <Volume className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{texts.internalSpeakers}</h4>
                  <p className="text-xs text-gray-500">{texts.defaultDevice}</p>
                </div>
              </div>
              <div
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer"
                onClick={() => handleSelectOutputDevice("hdmi")}
              >
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                  <Volume className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{texts.hdmi}</h4>
                  <p className="text-xs text-gray-500">{texts.notConnected}</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-4">{texts.soundEffects}</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.playSoundEffects}</span>
              <ToggleSwitch isEnabled={true} onChange={(value) => console.log(`Play sound effects: ${value}`)} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.playStartupSound}</span>
              <ToggleSwitch isEnabled={true} onChange={(value) => console.log(`Play startup sound: ${value}`)} />
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm w-48">{texts.alertVolume}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settingsState.alertVolume}
                  onChange={handleAlertVolumeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default SoundSettings
