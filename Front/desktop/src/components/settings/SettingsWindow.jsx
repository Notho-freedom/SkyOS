"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import {
  Globe,
  Monitor,
  Layout,
  Users,
  Accessibility,
  Wifi,
  Bluetooth,
  Volume,
  Keyboard,
  Battery,
  ArrowLeftCircle,
  Shield,
  Group,
  Network,
  Type,
  DiscIcon as Display,
  BatteryCharging,
  CalendarIcon,
  ShieldCheck,
  Palette,
} from "lucide-react"

// Import des composants de section
import NetworkSettings from "./sections/NetworkSettings"
import SoundSettings from "./sections/SoundSettings"
import KeyboardSettings from "./sections/KeyboardSettings"
import BatterySettings from "./sections/BatterySettings"
import SecuritySettings from "./sections/SecuritySettings"
import WallpaperSettings from "./sections/WallpaperSettings"
import GeneralSettings from "./sections/GeneralSettings"
import DisplaySettings from "./sections/DisplaySettings"
import AccessibilitySettings from "./sections/AccessibilitySettings"
import DateTimeSettings from "./sections/DateTimeSettings"
import UserSettings from "./sections/UserSettings"
import AppearanceSettings from "./sections/AppearanceSettings"

// Import des composants communs
import { SidebarItem, SettingsIcon } from "./components/UIComponents"
import { AppHeader, AppTabs, SearchBar } from "./components/HeaderComponents"

const SettingsWindow = ({ config }) => {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState("grid") // "grid" ou "detail"
  const [activeSection, setActiveSection] = useState("")
  const [activeSubSection, setActiveSubSection] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("apple")
  const [windowSize, setWindowSize] = useState({ width: 900, height: 600 })

  const texts = {
    general: t("parametre.general"),
    desktop: t("parametre.desktop_pc"),
    dock: t("parametre.dock"),
    missionControl: t("parametre.missionControl"),
    siri: t("parametre.siri"),
    spotlight: t("parametre.spotlight"),
    language: t("parametre.language"),
    notifications: t("parametre.notifications"),
    internetAccounts: t("parametre.internetAccounts"),
    wallet: t("parametre.wallet"),
    touchId: t("parametre.touchId"),
    users: t("parametre.users"),
    accessibility: t("parametre.accessibility"),
    screenTime: t("parametre.screenTime"),
    extensions: t("parametre.extensions"),
    security: t("parametre.security"),
    softwareUpdate: t("parametre.softwareUpdate"),
    network: t("parametre.network"),
    bluetooth: t("parametre.bluetooth"),
    sound: t("parametre.sound"),
    printers: t("parametre.printers"),
    keyboard: t("parametre.keyboard"),
    trackpad: t("parametre.trackpad"),
    mouse: t("parametre.mouse"),
    displays: t("parametre.displays"),
    sidecar: t("parametre.sidecar"),
    battery: t("parametre.battery"),
    dateTime: t("parametre.dateTime"),
    sharing: t("parametre.sharing"),
    timeMachine: t("parametre.timeMachine"),
    startupDisk: t("parametre.startupDisk"),
    wallpaper: t("parametre.wallpaper"),
    back: t("parametre.back"),
    settingsTitle: t("parametre.settingsTitle"),
    appearance: t("parametre.appearance"),
  }

  // État global pour les toggles et autres paramètres
  const [settingsState, setSettingsState] = useState({
    wifi: true,
    bluetooth: false,
    muteSound: false,
    showVolumeInMenuBar: true,
    useFunctionKeys: true,
    autoCorrect: true,
    autoCapitalize: true,
    doubleSpacePeriod: false,
    showPercentInMenuBar: true,
    optimizeVideoStreaming: true,
    enablePowerMode: false,
    requirePasswordAfterSleep: true,
    fileVaultEnabled: true,
    firewallEnabled: true,
    selectedWallpaper: 1,
    volume: 75,
    alertVolume: 60,
    keyRepeatRate: 65,
    delayUntilRepeat: 40,
  })

  // Fonction pour mettre à jour l'état des paramètres
  const updateSettings = (key, value) => {
    setSettingsState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const windowConfig = config || {
    title: texts.settingsTitle,
    id: "settings-window",
    size: windowSize,
    position: { x: 100, y: 100 },
    resizable: true,
    minimizable: true,
    maximizable: true,
  }

  // Effet pour détecter les changements de taille de fenêtre
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(1200, Math.max(800, window.innerWidth * 0.7))
      const height = Math.min(800, Math.max(600, window.innerHeight * 0.7))
      setWindowSize({ width, height })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Animation pour les transitions de contenu
  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Animation pour la grille
  const gridVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Éléments de la sidebar
  const sidebarItems = [
    { id: "general", label: texts.general, icon: <Globe className="w-4 h-4" /> },
    { id: "appearance", label: texts.appearance, icon: <Palette className="w-4 h-4" /> },
    { id: "desktop", label: texts.desktop, icon: <Monitor className="w-4 h-4" /> },
    { id: "wallpaper", label: texts.wallpaper, icon: <Layout className="w-4 h-4" /> },
    { id: "accessibility", label: texts.accessibility, icon: <Accessibility className="w-4 h-4" /> },
    { id: "network", label: texts.network, icon: <Wifi className="w-4 h-4" /> },
    { id: "sound", label: texts.sound, icon: <Volume className="w-4 h-4" /> },
    { id: "keyboard", label: texts.keyboard, icon: <Keyboard className="w-4 h-4" /> },
    { id: "battery", label: texts.battery, icon: <Battery className="w-4 h-4" /> },
    { id: "security", label: texts.security, icon: <Shield className="w-4 h-4" /> },
    { id: "users", label: texts.users, icon: <Users className="w-4 h-4" /> },
    { id: "date-time", label: texts.dateTime, icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "displays", label: texts.displays, icon: <Monitor className="w-4 h-4" /> },
  ]

  // Éléments de la grille principale
  const settingsItems = [
    { id: "general", label: texts.general, icon: <Globe className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    { id: "appearance", label: texts.appearance, icon: <Palette className="w-6 h-6 text-white" />, color: "bg-purple-500" },
    { id: "desktop", label: texts.desktop, icon: <Monitor className="w-6 h-6 text-white" />, color: "bg-green-500" },
    { id: "wallpaper", label: texts.wallpaper, icon: <Layout className="w-6 h-6 text-white" />, color: "bg-blue-400" },
    { id: "network", label: texts.network, icon: <Network className="w-6 h-6 text-white" />, color: "bg-blue-400" },
    { id: "bluetooth", label: texts.bluetooth, icon: <Bluetooth className="w-6 h-6 text-white" />, color: "bg-blue-500" },
    { id: "sound", label: texts.sound, icon: <Volume className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    { id: "keyboard", label: texts.keyboard, icon: <Type className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    {
      id: "battery",
      label: texts.battery,
      icon: <BatteryCharging className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    { id: "security", label: texts.security, icon: <ShieldCheck className="w-6 h-6 text-white" />, color: "bg-gray-700" },
    { id: "users", label: texts.users, icon: <Group className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    { id: "date-time", label: texts.dateTime, icon: <CalendarIcon className="w-6 h-6 text-white" />, color: "bg-red-500" },
    { id: "displays", label: texts.displays, icon: <Display className="w-6 h-6 text-white" />, color: "bg-blue-400" },
  ]

  // Fonction pour gérer le clic sur un élément de la grille
  const handleGridItemClick = (itemId) => {
    setActiveSection(itemId)
    setActiveSubSection("")
    setViewMode("detail")
  }

  // Fonction pour revenir à la grille
  const handleBackToGrid = () => {
    setViewMode("grid")
    setActiveSection("")
    setActiveSubSection("")
  }

  // Fonction pour naviguer vers une sous-section
  const navigateToSubSection = (section, subSection = "") => {
    setActiveSection(section)
    setActiveSubSection(subSection)
  }

  // Rendu du contenu en fonction de la section active
  const renderDetailContent = () => {
    switch (activeSection) {
      case "network":
        return (
          <NetworkSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "sound":
        return (
          <SoundSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "keyboard":
        return (
          <KeyboardSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "battery":
        return (
          <BatterySettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "security":
        return (
          <SecuritySettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "appearance":
        return (
          <AppearanceSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "wallpaper":
      case "desktop":
        if (activeSubSection === "wallpaper" || !activeSubSection) {
          return (
            <WallpaperSettings
              settingsState={settingsState}
              updateSettings={updateSettings}
              contentVariants={contentVariants}
            />
          )
        }
        return (
          <GeneralSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
            navigateToSubSection={navigateToSubSection}
          />
        )
      case "displays":
        return (
          <DisplaySettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "accessibility":
        return (
          <AccessibilitySettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "date-time":
        return (
          <DateTimeSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      case "users":
        return (
          <UserSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
          />
        )
      default:
        return (
          <GeneralSettings
            settingsState={settingsState}
            updateSettings={updateSettings}
            contentVariants={contentVariants}
            navigateToSubSection={navigateToSubSection}
          />
        )
    }
  }

  // Modifier la section de rendu de la grille pour améliorer l'alignement et la responsivité
  const renderGridView = () => {
    return (
      <motion.div
        className="flex flex-col h-full"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* App info */}
        <AppHeader onBack={null} showBackButton={false} />

        {/* Tabs */}
        <AppTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Grid layout */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid-container mx-auto max-w-6xl">
            <motion.div
              className="grid auto-rows-fr gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              }}
            >
              {settingsItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="aspect-square flex flex-col items-center justify-center"
                  style={{ height: "120px" }}
                >
                  <SettingsIcon
                    icon={item.icon}
                    label={item.label}
                    color={item.color}
                    onClick={() => handleGridItemClick(item.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Rendu de la vue détaillée
  const renderDetailView = () => {
    return (
      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Search bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
  
        <div className="flex flex-1 min-h-full"> {/* Ajout de min-h-0 pour éviter les problèmes de débordement */}
          {/* Sidebar */}
          <motion.div
            className="w-56 bg-gray-100/80 border-r border-gray-200 overflow-y-auto py-2 px-2 flex-shrink-0"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="mb-2">
              <SidebarItem
                icon={<ArrowLeftCircle className="w-4 h-4" />}
                label={texts.back}
                isActive={false}
                onClick={handleBackToGrid}
              />
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeSection === item.id}
                onClick={() => navigateToSubSection(item.id)}
              />
            ))}
          </motion.div>
  
          {/* Content area */}
          <div className="flex-1 min-h-full overflow-auto"> {/* Ajout de min-h-0 et overflow-auto */}
            <AnimatePresence mode="wait">
              <motion.div className="h-full"> {/* Nouveau conteneur avec h-full */}
                {renderDetailContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div config={windowConfig}>
      <motion.div
        className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence mode="wait">{viewMode === "grid" ? renderGridView() : renderDetailView()}</AnimatePresence>
      </motion.div>
    </div>
  )
}

export default SettingsWindow