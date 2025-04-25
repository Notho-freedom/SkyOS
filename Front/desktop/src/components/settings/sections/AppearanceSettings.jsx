"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Palette,
  Type,
  Sun,
  Moon,
  SunMoon,
  Circle,
  Sliders,
  Maximize,
  Minimize,
  Check,
  LayoutGrid,
  Sparkles,
} from "lucide-react"
import { SectionTitle, SectionCard, ToggleSwitch } from "../components/UIComponents"
import { useTheme } from "../../../theme/ThemeContext.jsx"
import { useSettings } from "../../../config/settingsContext"
import { useTranslation } from "react-i18next"

// Icônes utilisées dans ce composant
const icons = {
  palette: <Palette />,
  type: <Type />,
  sun: <Sun />,
  moon: <Moon />,
  sunMoon: <SunMoon />,
  circle: <Circle />,
  sliders: <Sliders />,
  maximize: <Maximize />,
  minimize: <Minimize />,
  check: <Check />,
  layoutGrid: <LayoutGrid />,
  sparkles: <Sparkles />,
}

// Mocked defaultTheme and darkTheme for demonstration purposes.
// In a real application, these would likely be defined elsewhere and imported.
const defaultTheme = {
  name: "light",
  colors: {
    primary: "#2563eb", // Default blue color
  },
  fontFamily: "sans-serif",
  fontSize: 16,
  fontWeight: "regular",
  reduceMotion: false,
  reduceTransparency: false,
  highContrast: false,
  fontSmoothing: true,
  interfaceDensity: "comfortable",
}

const darkTheme = {
  name: "dark",
  colors: {
    primary: "#9333ea", // Default purple color
  },
  fontFamily: "sans-serif",
  fontSize: 16,
  fontWeight: "regular",
  reduceMotion: false,
  reduceTransparency: false,
  highContrast: false,
  fontSmoothing: true,
  interfaceDensity: "comfortable",
}

// Mocked showNotification function for demonstration purposes.
const showNotification = (title, message, type) => {
  console.log(`Notification: ${title} - ${message} (${type})`)
  // In a real application, this would display a user-visible notification.
}

const AppearanceSettings = ({ settingsState, updateSettings, contentVariants }) => {
  const { theme, setTheme, toggleDarkMode, updateThemeProperty, fontFamilies, accentColors } = useTheme()
  const { state, dispatch } = useSettings()
  const { t } = useTranslation()

  // Textes pour l'internationalisation
  const texts = {
    appearance: t("parametre.appearance", "Apparence"),
    theme: t("parametre.theme", "Thème"),
    light: t("parametre.light", "Clair"),
    dark: t("parametre.dark", "Sombre"),
    auto: t("parametre.auto", "Automatique"),
    autoThemeDescription: t(
      "parametre.autoThemeDescription",
      "Utilise le thème clair pendant la journée et le thème sombre la nuit",
    ),
    accentColor: t("parametre.accentColor", "Couleur d'accent"),
    fonts: t("parametre.fonts", "Polices"),
    systemFont: t("parametre.systemFont", "Police système"),
    fontFamily: t("parametre.fontFamily", "Famille de police"),
    fontSize: t("parametre.fontSize", "Taille de police"),
    smaller: t("parametre.smaller", "Plus petit"),
    larger: t("parametre.larger", "Plus grand"),
    fontWeight: t("parametre.fontWeight", "Épaisseur de police"),
    regular: t("parametre.regular", "Normal"),
    medium: t("parametre.medium", "Moyen"),
    bold: t("parametre.bold", "Gras"),
    visualEffects: t("parametre.visualEffects", "Effets visuels"),
    transparency: t("parametre.transparency", "Transparence"),
    animation: t("parametre.animation", "Animation"),
    reduceMotion: t("parametre.reduceMotion", "Réduire les animations"),
    reduceTransparency: t("parametre.reduceTransparency", "Réduire la transparence"),
    highContrast: t("parametre.highContrast", "Contraste élevé"),
    preview: t("parametre.preview", "Aperçu"),
    apply: t("parametre.apply", "Appliquer"),
    reset: t("parametre.reset", "Réinitialiser"),
    custom: t("parametre.custom", "Personnalisé"),
    fontSmoothing: t("parametre.fontSmoothing", "Lissage de police"),
    enableFontSmoothing: t("parametre.enableFontSmoothing", "Activer le lissage de police"),
    interfaceDensity: t("parametre.interfaceDensity", "Densité de l'interface"),
    compact: t("parametre.compact", "Compacte"),
    comfortable: t("parametre.comfortable", "Confortable"),
    spacious: t("parametre.spacious", "Spacieuse"),
    cancel: t("parametre.cancel", "Annuler"),
    customizeExperience: t("parametre.customizeExperience", "Personnalisez votre expérience"),
    adaptAppearance: t("parametre.adaptAppearance", "Adaptez l'apparence de SKYOS à votre style et à vos préférences."),
  }

  // État local pour les paramètres d'apparence
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme.name === "dark" ? "dark" : "light", // 'light', 'dark', 'auto'
    accentColor: accentColors.find((color) => color.color === theme.colors.primary) || accentColors[0],
    fontFamily: fontFamilies.find((font) => font.value === theme.fontFamily) || fontFamilies[0],
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight, // 'regular', 'medium', 'bold'
    reduceMotion: theme.reduceMotion,
    reduceTransparency: theme.reduceTransparency,
    highContrast: theme.highContrast,
    fontSmoothing: theme.fontSmoothing,
    interfaceDensity: theme.interfaceDensity, // 'compact', 'comfortable', 'spacious'
  })

  // Synchroniser les paramètres locaux avec le thème global
  useEffect(() => {
    setAppearanceSettings({
      theme: theme.name === "dark" ? "dark" : "light",
      accentColor: accentColors.find((color) => color.color === theme.colors.primary) || accentColors[0],
      fontFamily: fontFamilies.find((font) => font.value === theme.fontFamily) || fontFamilies[0],
      fontSize: theme.fontSize,
      fontWeight: theme.fontWeight,
      reduceMotion: theme.reduceMotion,
      reduceTransparency: theme.reduceTransparency,
      highContrast: theme.highContrast,
      fontSmoothing: theme.fontSmoothing,
      interfaceDensity: theme.interfaceDensity,
    })
  }, [theme, accentColors, fontFamilies])

  // Fonction pour mettre à jour les paramètres d'apparence
  const updateAppearanceSetting = (key, value) => {
    setAppearanceSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Fonction pour gérer le changement de thème
  const handleThemeChange = (themeType) => {
    updateAppearanceSetting("theme", themeType)

    if (themeType === "light" || themeType === "dark") {
      setTheme({
        ...theme,
        name: themeType,
        colors: themeType === "dark" ? darkTheme.colors : defaultTheme.colors,
      })
    }
  }

  // Fonction pour gérer le changement de couleur d'accent
  const handleAccentColorChange = (color) => {
    updateAppearanceSetting("accentColor", color)
    updateThemeProperty("colors.primary", color.color)
  }

  // Fonction pour gérer le changement de famille de police
  const handleFontFamilyChange = (e) => {
    const selectedFont = fontFamilies.find((font) => font.value === e.target.value)
    updateAppearanceSetting("fontFamily", selectedFont)
    updateThemeProperty("fontFamily", selectedFont.value)
  }

  // Fonction pour gérer le changement de taille de police
  const handleFontSizeChange = (e) => {
    const size = Number.parseInt(e.target.value)
    updateAppearanceSetting("fontSize", size)
    updateThemeProperty("fontSize", size)
  }

  // Fonction pour gérer le changement d'épaisseur de police
  const handleFontWeightChange = (weight) => {
    updateAppearanceSetting("fontWeight", weight)
    updateThemeProperty("fontWeight", weight)
  }

  // Fonction pour gérer le changement de densité de l'interface
  const handleInterfaceDensityChange = (density) => {
    updateAppearanceSetting("interfaceDensity", density)
    updateThemeProperty("interfaceDensity", density)
  }

  // Fonction pour appliquer les changements
  const handleApplyChanges = () => {
    // Appliquer tous les changements au thème global
    const newTheme = {
      ...theme,
      name: appearanceSettings.theme === "dark" ? "dark" : "light",
      colors: {
        ...theme.colors,
        primary: appearanceSettings.accentColor.color,
      },
      fontFamily: appearanceSettings.fontFamily.value,
      fontSize: appearanceSettings.fontSize,
      fontWeight: appearanceSettings.fontWeight,
      reduceMotion: appearanceSettings.reduceMotion,
      reduceTransparency: appearanceSettings.reduceTransparency,
      highContrast: appearanceSettings.highContrast,
      fontSmoothing: appearanceSettings.fontSmoothing,
      interfaceDensity: appearanceSettings.interfaceDensity,
    }

    setTheme(newTheme)
    showNotification("System", "Appearance settings applied", "success")
  }

  // Fonction pour réinitialiser les paramètres
  const handleResetSettings = () => {
    const defaultSettings = {
      theme: "light",
      accentColor: accentColors[0],
      fontFamily: fontFamilies[0],
      fontSize: 16,
      fontWeight: "regular",
      reduceMotion: false,
      reduceTransparency: false,
      highContrast: false,
      fontSmoothing: true,
      interfaceDensity: "comfortable",
    }

    setAppearanceSettings(defaultSettings)

    // Réinitialiser le thème global
    setTheme({
      ...defaultTheme,
      name: "light",
      colors: {
        ...defaultTheme.colors,
        primary: accentColors[0].color,
      },
      fontFamily: fontFamilies[0].value,
    })
  }

  // Style pour l'aperçu basé sur les paramètres actuels
  const previewStyle = {
    fontFamily: appearanceSettings.fontFamily.value,
    fontSize: `${appearanceSettings.fontSize}px`,
    fontWeight:
      appearanceSettings.fontWeight === "regular"
        ? "normal"
        : appearanceSettings.fontWeight === "medium"
          ? "500"
          : "bold",
    backgroundColor: appearanceSettings.theme === "dark" ? "#1f2937" : "#ffffff",
    color: appearanceSettings.theme === "dark" ? "#f3f4f6" : "#1f2937",
    borderColor: appearanceSettings.theme === "dark" ? "#374151" : "#e5e7eb",
  }

  // Style pour les boutons d'aperçu
  const previewButtonStyle = {
    backgroundColor: appearanceSettings.accentColor.color,
    color: "#ffffff",
    fontFamily: appearanceSettings.fontFamily.value,
    fontSize: `${appearanceSettings.fontSize - 2}px`,
    fontWeight:
      appearanceSettings.fontWeight === "regular"
        ? "normal"
        : appearanceSettings.fontWeight === "medium"
          ? "500"
          : "bold",
  }

  return (
    <motion.div
      key="appearance"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <SectionTitle title={texts.appearance} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{texts.theme}</h3>
              </div>
              <div className="p-4">
                <div className="flex space-x-4 mb-4">
                  <motion.button
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      appearanceSettings.theme === "light"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange("light")}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center mb-2`}
                    >
                      <Sun className="w-6 h-6 text-orange-400" />
                    </div>
                    <span className="text-sm font-medium">{texts.light}</span>
                  </motion.button>

                  <motion.button
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      appearanceSettings.theme === "dark"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mb-2`}
                    >
                      <Moon className="w-6 h-6 text-gray-100" />
                    </div>
                    <span className="text-sm font-medium">{texts.dark}</span>
                  </motion.button>

                  <motion.button
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      appearanceSettings.theme === "auto"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange("auto")}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-white to-gray-800 border border-gray-300 flex items-center justify-center mb-2`}
                    >
                      <SunMoon className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">{texts.auto}</span>
                  </motion.button>
                </div>
                {appearanceSettings.theme === "auto" && (
                  <p className="text-xs text-gray-500">{texts.autoThemeDescription}</p>
                )}
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{texts.accentColor}</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3 mb-2">
                  {accentColors.map((color, index) => (
                    <motion.button
                      key={index}
                      className={`relative w-full aspect-square rounded-full ${color.value} flex items-center justify-center ${
                        appearanceSettings.accentColor.name === color.name ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAccentColorChange(color)}
                    >
                      {appearanceSettings.accentColor.name === color.name && <Check className="w-5 h-5 text-white" />}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm">{texts.custom}</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={appearanceSettings.accentColor.color}
                      onChange={(e) => {
                        const customColor = {
                          name: "Custom",
                          value: "bg-blue-500", // Cette classe sera remplacée par la couleur personnalisée
                          hover: "bg-blue-600",
                          color: e.target.value,
                        }
                        handleAccentColorChange(customColor)
                      }}
                      className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{texts.fonts}</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm mb-2">{texts.fontFamily}</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    value={appearanceSettings.fontFamily.value}
                    onChange={handleFontFamilyChange}
                  >
                    {fontFamilies.map((font, index) => (
                      <option key={index} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2">{texts.fontSize}</label>
                  <div className="flex items-center space-x-3">
                    <Minimize className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={appearanceSettings.fontSize}
                        onChange={handleFontSizeChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <Maximize className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium w-8 text-right">{appearanceSettings.fontSize}px</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-2">{texts.fontWeight}</label>
                  <div className="flex space-x-3">
                    <motion.button
                      className={`flex-1 py-2 px-3 rounded-md border ${
                        appearanceSettings.fontWeight === "regular"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFontWeightChange("regular")}
                    >
                      <span className="text-sm font-normal">{texts.regular}</span>
                    </motion.button>
                    <motion.button
                      className={`flex-1 py-2 px-3 rounded-md border ${
                        appearanceSettings.fontWeight === "medium"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFontWeightChange("medium")}
                    >
                      <span className="text-sm font-medium">{texts.medium}</span>
                    </motion.button>
                    <motion.button
                      className={`flex-1 py-2 px-3 rounded-md border ${
                        appearanceSettings.fontWeight === "bold"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFontWeightChange("bold")}
                    >
                      <span className="text-sm font-bold">{texts.bold}</span>
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.fontSmoothing}</span>
                  <ToggleSwitch
                    isEnabled={appearanceSettings.fontSmoothing}
                    onChange={(value) => {
                      updateAppearanceSetting("fontSmoothing", value)
                      updateThemeProperty("fontSmoothing", value)
                    }}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{texts.visualEffects}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{texts.reduceMotion}</span>
                  <ToggleSwitch
                    isEnabled={appearanceSettings.reduceMotion}
                    onChange={(value) => {
                      updateAppearanceSetting("reduceMotion", value)
                      updateThemeProperty("reduceMotion", value)
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{texts.reduceTransparency}</span>
                  <ToggleSwitch
                    isEnabled={appearanceSettings.reduceTransparency}
                    onChange={(value) => {
                      updateAppearanceSetting("reduceTransparency", value)
                      updateThemeProperty("reduceTransparency", value)
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{texts.highContrast}</span>
                  <ToggleSwitch
                    isEnabled={appearanceSettings.highContrast}
                    onChange={(value) => {
                      updateAppearanceSetting("highContrast", value)
                      updateThemeProperty("highContrast", value)
                    }}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{texts.interfaceDensity}</h3>
              </div>
              <div className="p-4">
                <div className="flex space-x-3">
                  <motion.button
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      appearanceSettings.interfaceDensity === "compact"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInterfaceDensityChange("compact")}
                  >
                    <div className="flex flex-col items-center">
                      <LayoutGrid className="w-5 h-5 mb-1" />
                      <span className="text-xs">{texts.compact}</span>
                    </div>
                  </motion.button>
                  <motion.button
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      appearanceSettings.interfaceDensity === "comfortable"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInterfaceDensityChange("comfortable")}
                  >
                    <div className="flex flex-col items-center">
                      <LayoutGrid className="w-6 h-6 mb-1" />
                      <span className="text-xs">{texts.comfortable}</span>
                    </div>
                  </motion.button>
                  <motion.button
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      appearanceSettings.interfaceDensity === "spacious"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInterfaceDensityChange("spacious")}
                  >
                    <div className="flex flex-col items-center">
                      <LayoutGrid className="w-7 h-7 mb-1" />
                      <span className="text-xs">{texts.spacious}</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="md:col-span-1 space-y-6">
            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{texts.preview}</h3>
              </div>
              <div className="p-4">
                <div className="rounded-lg border p-4 mb-4 transition-all duration-300" style={previewStyle}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: appearanceSettings.accentColor.color }}>
                    SKYOS
                  </h3>
                  <p className="mb-3">
                    Ceci est un aperçu de l'apparence de votre système avec les paramètres sélectionnés.
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 rounded-md text-sm" style={previewButtonStyle}>
                      {texts.apply}
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-md text-sm border"
                      style={{
                        ...previewStyle,
                        borderColor: appearanceSettings.theme === "dark" ? "#4b5563" : "#d1d5db",
                      }}
                    >
                      {texts.cancel}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    className="flex-1 px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyChanges}
                  >
                    {texts.apply}
                  </motion.button>
                  <motion.button
                    className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResetSettings}
                  >
                    {texts.reset}
                  </motion.button>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center mt-3">
                  <h3 className="text-sm font-medium">{texts.customizeExperience}</h3>
                  <p className="text-xs text-gray-500 mt-1">{texts.adaptAppearance}</p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AppearanceSettings
