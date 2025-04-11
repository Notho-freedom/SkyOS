"use client"

import React from "react"
import { motion } from "framer-motion"
import { Eye, Ear, MousePointer, Keyboard, Mic, Speaker, Monitor } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"

// Textes pour l'internationalisation
const texts = {
  accessibility: "Accessibilité",
  vision: "Vision",
  voiceOver: "VoiceOver",
  voiceOverDescription: "Lecteur d'écran pour les personnes malvoyantes",
  zoom: "Zoom",
  zoomDescription: "Agrandir l'écran",
  displaySettings: "Paramètres d'affichage",
  increaseContrast: "Augmenter le contraste",
  reduceTransparency: "Réduire la transparence",
  reduceMotion: "Réduire les animations",
  hearing: "Audition",
  closedCaptions: "Sous-titres",
  closedCaptionsDescription: "Afficher les sous-titres pour le contenu audio",
  audioDescription: "Description audio",
  audioDescriptionDescription: "Narration des éléments visuels",
  motor: "Motricité",
  voiceControl: "Contrôle vocal",
  voiceControlDescription: "Contrôler l'ordinateur avec la voix",
  switchControl: "Contrôle par commutateur",
  switchControlDescription: "Utiliser des commutateurs pour naviguer",
  keyboard: "Clavier",
  stickyKeys: "Touches rémanentes",
  stickyKeysDescription: "Appuyer sur les touches de modification une à la fois",
  slowKeys: "Touches lentes",
  slowKeysDescription: "Ajuster le délai entre l'appui et l'acceptation d'une touche",
  general: "Général",
  shortcutsEnabled: "Raccourcis d'accessibilité activés",
}

// Icônes utilisées dans ce composant
const icons = {
  eye: <Eye />,
  ear: <Ear />,
  mousePointer: <MousePointer />,
  keyboard: <Keyboard />,
  mic: <Mic />,
  speaker: <Speaker />,
  monitor: <Monitor />,
}

const AccessibilitySettings = ({ settingsState, updateSettings, contentVariants }) => {
  // État local pour les paramètres d'accessibilité
  const [accessibilitySettings, setAccessibilitySettings] = React.useState({
    voiceOver: false,
    zoom: true,
    increaseContrast: false,
    reduceTransparency: true,
    reduceMotion: false,
    closedCaptions: true,
    audioDescription: false,
    voiceControl: false,
    switchControl: false,
    stickyKeys: false,
    slowKeys: false,
    shortcutsEnabled: true,
  })

  // Fonction pour mettre à jour les paramètres d'accessibilité
  const updateAccessibilitySetting = (key, value) => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <motion.div
      key="accessibility"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.accessibility} />

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.vision}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block">{texts.voiceOver}</span>
                <span className="text-xs text-gray-500">{texts.voiceOverDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.voiceOver}
                onChange={(value) => updateAccessibilitySetting("voiceOver", value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block">{texts.zoom}</span>
                <span className="text-xs text-gray-500">{texts.zoomDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.zoom}
                onChange={(value) => updateAccessibilitySetting("zoom", value)}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-3">{texts.displaySettings}</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">{texts.increaseContrast}</span>
                <ToggleSwitch
                  isEnabled={accessibilitySettings.increaseContrast}
                  onChange={(value) => updateAccessibilitySetting("increaseContrast", value)}
                />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">{texts.reduceTransparency}</span>
                <ToggleSwitch
                  isEnabled={accessibilitySettings.reduceTransparency}
                  onChange={(value) => updateAccessibilitySetting("reduceTransparency", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{texts.reduceMotion}</span>
                <ToggleSwitch
                  isEnabled={accessibilitySettings.reduceMotion}
                  onChange={(value) => updateAccessibilitySetting("reduceMotion", value)}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.hearing}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block">{texts.closedCaptions}</span>
                <span className="text-xs text-gray-500">{texts.closedCaptionsDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.closedCaptions}
                onChange={(value) => updateAccessibilitySetting("closedCaptions", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium block">{texts.audioDescription}</span>
                <span className="text-xs text-gray-500">{texts.audioDescriptionDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.audioDescription}
                onChange={(value) => updateAccessibilitySetting("audioDescription", value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.motor}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block">{texts.voiceControl}</span>
                <span className="text-xs text-gray-500">{texts.voiceControlDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.voiceControl}
                onChange={(value) => updateAccessibilitySetting("voiceControl", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium block">{texts.switchControl}</span>
                <span className="text-xs text-gray-500">{texts.switchControlDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.switchControl}
                onChange={(value) => updateAccessibilitySetting("switchControl", value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.keyboard}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium block">{texts.stickyKeys}</span>
                <span className="text-xs text-gray-500">{texts.stickyKeysDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.stickyKeys}
                onChange={(value) => updateAccessibilitySetting("stickyKeys", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium block">{texts.slowKeys}</span>
                <span className="text-xs text-gray-500">{texts.slowKeysDescription}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.slowKeys}
                onChange={(value) => updateAccessibilitySetting("slowKeys", value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">{texts.general}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{texts.shortcutsEnabled}</span>
              <ToggleSwitch
                isEnabled={accessibilitySettings.shortcutsEnabled}
                onChange={(value) => updateAccessibilitySetting("shortcutsEnabled", value)}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  )
}

export default AccessibilitySettings
