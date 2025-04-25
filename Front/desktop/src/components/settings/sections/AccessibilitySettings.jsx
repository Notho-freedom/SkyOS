"use client"

import React from "react"
import { motion } from "framer-motion"
import { Eye, Ear, MousePointer, Keyboard, Mic, Speaker, Monitor } from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"
import { useTranslation } from "react-i18next"
import i18n from "../../../i18n"

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
  const { t } = useTranslation()

  // Textes pour l'internationalisation
  const texts = {
    accessibility: t("parametre.accessibility"),
    vision: t("parametre.vision"),
    voiceOver: t("parametre.voiceOver"),
    voiceOverDescription: t("parametre.voiceOverDescription"),
    zoom: t("parametre.zoom"),
    zoomDescription: t("parametre.zoomDescription"),
    displaySettings: t("parametre.displaySettings"),
    increaseContrast: t("parametre.increaseContrast"),
    reduceTransparency: t("parametre.reduceTransparency"),
    reduceMotion: t("parametre.reduceMotion"),
    hearing: t("parametre.hearing"),
    closedCaptions: t("parametre.closedCaptions"),
    closedCaptionsDescription: t("parametre.closedCaptionsDescription"),
    audioDescription: t("parametre.audioDescription"),
    audioDescriptionDescription: t("parametre.audioDescriptionDescription"),
    motor: t("parametre.motor"),
    voiceControl: t("parametre.voiceControl"),
    voiceControlDescription: t("parametre.voiceControlDescription"),
    switchControl: t("parametre.switchControl"),
    switchControlDescription: t("parametre.switchControlDescription"),
    keyboard: t("parametre.keyboard"),
    stickyKeys: t("parametre.stickyKeys"),
    stickyKeysDescription: t("parametre.stickyKeysDescription"),
    slowKeys: t("parametre.slowKeys"),
    slowKeysDescription: t("parametre.slowKeysDescription"),
    general: t("parametre.general"),
    shortcutsEnabled: t("parametre.shortcutsEnabled"),
    language: t("parametre.language"),
    currentLanguage: t("parametre.currentLanguage"),
    autoDetectLanguage: t("parametre.autoDetectLanguage"),
    autoDetectLanguageDescription: t("parametre.autoDetectLanguageDescription"),
  }

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
    autoDetectLanguage: false,
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
            <h3 className="text-sm font-medium">{t("parametre.language")}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{t("parametre.currentLanguage")}</span>
              <select
                className="p-2 border rounded-md text-sm"
                value={settingsState?.system?.language || i18n.language}
                onChange={(e) => {
                  // Update settings
                  updateSettings({
                    type: "SET_LANGUAGE",
                    payload: e.target.value,
                  })
                  // Change i18n language
                  i18n.changeLanguage(e.target.value)
                }}
              >
                <option value="en-US">English</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium block">{t("parametre.autoDetectLanguage")}</span>
                <span className="text-xs text-gray-500">{t("parametre.autoDetectLanguageDescription")}</span>
              </div>
              <ToggleSwitch
                isEnabled={accessibilitySettings.autoDetectLanguage || false}
                onChange={(value) => {
                  updateAccessibilitySetting("autoDetectLanguage", value)
                  if (value) {
                    // Get browser language
                    const browserLang = navigator.language
                    // Update settings
                    updateSettings({
                      type: "SET_LANGUAGE",
                      payload: browserLang,
                    })
                    // Change i18n language
                    i18n.changeLanguage(browserLang)
                  }
                }}
              />
            </div>
          </div>
        </SectionCard>

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
