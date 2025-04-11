"use client"

import React from "react"
import { motion } from "framer-motion"
import { Monitor, LayoutGrid, Maximize, Minimize, SunMoon } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"

// Textes pour l'internationalisation
const texts = {
  displays: "Moniteurs",
  arrangement: "Disposition",
  dragDisplays: "Faites glisser les moniteurs pour réorganiser leur disposition",
  nightShift: "Night Shift",
  nightShiftDescription: "Réduit la lumière bleue pour un meilleur sommeil",
  schedule: "Programmation",
  sunset: "Du coucher au lever du soleil",
  custom: "Personnalisée",
  colorTemperature: "Température de couleur",
  less: "Moins chaude",
  more: "Plus chaude",
  resolution: "Résolution",
  scaled: "À l'échelle",
  default: "Par défaut pour l'écran",
  brightness: "Luminosité",
  automaticBrightness: "Ajuster automatiquement la luminosité",
  trueTone: "True Tone",
  trueToneDescription: "Ajuste automatiquement la balance des couleurs selon l'éclairage ambiant",
}

// Icônes utilisées dans ce composant
const icons = {
  monitor: <Monitor />,
  layoutGrid: <LayoutGrid />,
  maximize: <Maximize />,
  minimize: <Minimize />,
  sunMoon: <SunMoon />,
}

const DisplaySettings = ({ settingsState, updateSettings, contentVariants }) => {
  // État local pour les paramètres d'affichage
  const [displaySettings, setDisplaySettings] = React.useState({
    nightShift: true,
    schedule: "sunset",
    colorTemperature: 50,
    resolution: "default",
    brightness: 75,
    autoBrightness: true,
    trueTone: true,
  })

  // Fonction pour mettre à jour les paramètres d'affichage
  const updateDisplaySetting = (key, value) => {
    setDisplaySettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Fonction pour gérer le changement de programmation Night Shift
  const handleScheduleChange = (e) => {
    updateDisplaySetting("schedule", e.target.value)
  }

  // Fonction pour gérer le changement de température de couleur
  const handleColorTemperatureChange = (e) => {
    updateDisplaySetting("colorTemperature", Number.parseInt(e.target.value))
  }

  // Fonction pour gérer le changement de résolution
  const handleResolutionChange = (e) => {
    updateDisplaySetting("resolution", e.target.value)
  }

  // Fonction pour gérer le changement de luminosité
  const handleBrightnessChange = (e) => {
    updateDisplaySetting("brightness", Number.parseInt(e.target.value))
  }

  return (
    <motion.div
      key="displays"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.displays} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.arrangement}</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-4">{texts.dragDisplays}</p>
            <div className="bg-gray-100 rounded-lg p-6 flex justify-center items-center h-40">
              <div className="w-32 h-20 bg-blue-500 rounded-md shadow-md flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{texts.nightShift}</h3>
              <ToggleSwitch
                isEnabled={displaySettings.nightShift}
                onChange={(value) => updateDisplaySetting("nightShift", value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{texts.nightShiftDescription}</p>
          </div>
          {displaySettings.nightShift && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">{texts.schedule}</span>
                <select
                  className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1"
                  value={displaySettings.schedule}
                  onChange={handleScheduleChange}
                >
                  <option value="sunset">{texts.sunset}</option>
                  <option value="custom">{texts.custom}</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{texts.colorTemperature}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs">{texts.less}</span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={displaySettings.colorTemperature}
                      onChange={handleColorTemperatureChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <span className="text-xs">{texts.more}</span>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.resolution}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.scaled}</span>
              <select
                className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1"
                value={displaySettings.resolution}
                onChange={handleResolutionChange}
              >
                <option value="default">{texts.default}</option>
                <option value="1920x1080">1920 x 1080</option>
                <option value="1680x1050">1680 x 1050</option>
                <option value="1440x900">1440 x 900</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.brightness}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Minimize className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={displaySettings.brightness}
                  onChange={handleBrightnessChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <Maximize className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{texts.automaticBrightness}</span>
              <ToggleSwitch
                isEnabled={displaySettings.autoBrightness}
                onChange={(value) => updateDisplaySetting("autoBrightness", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium block">{texts.trueTone}</span>
                <span className="text-xs text-gray-500">{texts.trueToneDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={displaySettings.trueTone}
                onChange={(value) => updateDisplaySetting("trueTone", value)}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default DisplaySettings
