"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

// Import des composants communs
import { SidebarItem, SettingsIcon } from "./components/UIComponents"
import { AppHeader, AppTabs, SearchBar } from "./components/HeaderComponents"

// Textes pour l'internationalisation
const translations = {
  fr: {
    // Titres principaux
    settingsTitle: "Paramètres",
    back: "Retour",
    save: "Enregistrer",
    cancel: "Annuler",
    modify: "Modifier",
    configure: "Configurer",

    // Headers
    appInfo: "Identifié Apple, iCloud, contenu multimédia et App Store",
    appleId: "Identifiant Apple",
    familySharing: "Partage familial",
    searchPlaceholder: "Rechercher",

    // Messages communs
    connected: "Connecté",
    disconnected: "Déconnecté",
    enabled: "Activé",
    disabled: "Désactivé",
    notConnected: "Non connecté",
    notConfigured: "Non configuré",

    // Sections de réglages
    general: "Général",
    desktop: "Bureau et économiseur d'écran",
    dock: "Dock et barre de menus",
    missionControl: "Mission Control",
    siri: "Siri",
    spotlight: "Spotlight",
    language: "Langue et région",
    notifications: "Notifications",
    internetAccounts: "Comptes internet",
    wallet: "Wallet et Apple Pay",
    touchId: "Touch ID",
    users: "Utilisateurs et groupes",
    accessibility: "Accessibilité",
    screenTime: "Temps d'écran",
    extensions: "Extensions",
    security: "Sécurité et confidentialité",
    softwareUpdate: "Mise à jour de logiciel",
    network: "Réseau",
    bluetooth: "Bluetooth",
    sound: "Son",
    printers: "Imprimantes et scanners",
    keyboard: "Clavier",
    trackpad: "Trackpad",
    mouse: "Souris",
    displays: "Moniteurs",
    sidecar: "Sidecar",
    battery: "Batterie",
    dateTime: "Date et heure",
    sharing: "Partage",
    timeMachine: "Time Machine",
    startupDisk: "Disque de démarrage",

    // Wallpaper
    wallpaper: "Fond d'écran",
    builtInDisplay: "Écran intégré",
    dynamicDesktop: "Bureau dynamique",
    lightDarkDesktop: "Bureau clair et sombre",
    showLess: "Afficher moins",
    showAll: "Afficher tout",
    // chooseDesktop: "Choisir votre fond d'écran",
    venturaGraphic: "Graphique Ventura",
    desktopChanges: "Ce fond d'écran change tout au long de la journée.",

    // Network
    wifiNetwork: "Wi-Fi",
    vpn: "VPN",
    assistant: "Assistant",
    ipAddress: "Adresse IP",
    subnetMask: "Masque de sous-réseau",
    router: "Routeur",
    dns: "DNS",
    macAddress: "Adresse MAC",

    // Sound
    outputVolume: "Volume de sortie",
    mute: "Couper le son",
    showVolumeInMenuBar: "Afficher le volume dans la barre de menus",
    outputDevice: "Périphérique de sortie",
    internalSpeakers: "Haut-parleurs intégrés",
    defaultDevice: "Périphérique par défaut",
    hdmi: "HDMI",
    soundEffects: "Effets sonores",
    playSoundEffects: "Jouer les effets sonores",
    playStartupSound: "Jouer un son au démarrage",
    alertVolume: "Volume des alertes",
    slow: "Lente",
    fast: "Rapide",

    // Keyboard
    keyRepeatRate: "Vitesse de répétition des touches",
    delayUntilRepeat: "Délai avant répétition",
    long: "Long",
    short: "Court",
    useFunctionKeys: "Utiliser les touches F1, F2, etc. comme touches de fonction standard",
    fnKeyNote: "Appuyez sur la touche Fn pour utiliser les fonctionnalités spéciales imprimées sur chaque touche.",
    keyboardShortcuts: "Raccourcis clavier",
    missionControlShortcut: "Mission Control",
    screenCapture: "Capture d'écran",
    spotlightShortcut: "Spotlight",
    input: "Saisie",
    autoCorrect: "Correction automatique",
    autoCapitalize: "Majuscules automatiques",
    doubleSpacePeriod: "Point par double espace",

    // Battery
    charged: "Chargé",
    timeRemaining: "restantes",
    showPercentInMenuBar: "Afficher le pourcentage dans la barre de menus",
    powerSavingOptions: "Options d'économie d'énergie",
    optimizeVideoStreaming: "Optimiser la lecture vidéo en streaming",
    enablePowerMode: "Activer le mode économie d'énergie",
    turnOffDisplayAfter: "Mettre en veille l'écran après",
    usageHistory: "Historique d'utilisation",
    last24Hours: "Dernières 24 heures",
    batteryLevel: "Niveau de batterie",
    averageUsage: "Utilisation moyenne",
    chargeCycles: "Cycles de charge",
    condition: "État",
    normal: "Normal",
    perHour: "par heure",

    // Security
    requirePasswordAfterSleep: "Exiger le mot de passe après la mise en veille",
    sleepInactivityNote: "Votre Mac est configuré pour se mettre en veille après 10 minutes d'inactivité",
    allowAppDownloadedFrom: "Autoriser les applications téléchargées de",
    appStore: "App Store",
    identifiedDevelopers: "App Store et développeurs identifiés",
    anywhere: "N'importe où",
    fileVault: "FileVault",
    fileVaultEnabled: 'FileVault est activé pour le disque "Macintosh HD"',
    diskEncrypted: "Votre disque est chiffré",
    fileVaultDescription:
      "FileVault chiffre le contenu de votre Mac. Si votre Mac est perdu ou volé, le chiffrement empêche l'accès non autorisé à vos informations.",
    firewall: "Pare-feu",
    firewallOn: "Pare-feu: Activé",
    firewallDescription: "Les connexions entrantes sont bloquées pour certaines applications et services",
    options: "Options",
    privacy: "Confidentialité",
    location: "Localisation",
    contacts: "Contacts",
    calendar: "Calendrier",

    // Screen saver
    screenSaver: "Économiseur d'écran",
    // setupScreenSaver: "Configurer votre économiseur d'écran",

    // Dock & Menu Bar
    dockAndMenuBar: "Dock et barre de menus",
    customizeDock: "Personnaliser votre dock et barre de menus",

    // Communs dans les menus déroulants
    minutes2: "2 minutes",
    minutes5: "5 minutes",
    minutes10: "10 minutes",
    minutes30: "30 minutes",
    never: "Jamais",

    // Descriptions
    chooseDesktop: "Choisir votre fond d'écran",
    setupScreenSaver: "Configurer votre économiseur d'écran",
    // customizeDock: "Personnaliser votre dock et barre de menus",
  },
}

// Utiliser la langue française par défaut
const t = translations.fr

// Composant pour les éléments de la sidebar
// const SidebarItem = ({ icon, label, isActive, onClick }) => {
//   return (
//     <motion.button
//       className={`flex items-center w-full px-3 py-2 text-left rounded-lg transition-colors ${
//         isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200/50"
//       }`}
//       onClick={onClick}
//       whileHover={{ x: isActive ? 0 : 3 }}
//       whileTap={{ scale: 0.98 }}
//     >
//       <div className="flex items-center justify-center w-6 h-6 mr-3">{icon}</div>
//       <span className="text-sm font-medium">{label}</span>
//     </motion.button>
//   )
// }

// Composant pour les éléments de contenu
// const ContentItem = ({ icon, label, description, color, onClick }) => {
//   return (
//     <motion.div
//       className="flex items-center p-4 rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer"
//       onClick={onClick}
//       whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
//       whileTap={{ y: 0, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
//     >
//       <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mr-4 shrink-0`}>{icon}</div>
//       <div className="flex-1 min-w-0">
//         <h3 className="text-sm font-medium text-gray-900 truncate">{label}</h3>
//         {description && <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>}
//       </div>
//       <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
//     </motion.div>
//   )
// }

// Composant pour les options de wallpaper
// const WallpaperOption = ({ image, isSelected, onClick }) => {
//   return (
//     <motion.div
//       className={`relative rounded-lg overflow-hidden cursor-pointer ${isSelected ? "ring-2 ring-blue-500" : ""}`}
//       onClick={onClick}
//       whileHover={{ scale: 1.03 }}
//       whileTap={{ scale: 0.98 }}
//     >
//       <img
//         src={image || "/placeholder.svg"}
//         alt="Wallpaper option"
//         className="w-full h-full object-cover aspect-video"
//       />
//       {isSelected && (
//         <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//           <Check className="w-3 h-3 text-white" />
//         </div>
//       )}
//     </motion.div>
//   )
// }

// Composant pour les toggles
// const ToggleSwitch = ({ isEnabled, onChange }) => {
//   return (
//     <motion.div
//       className={`relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full ${
//         isEnabled ? "bg-green-500" : "bg-gray-300"
//       }`}
//       onClick={() => onChange(!isEnabled)}
//       whileTap={{ scale: 0.95 }}
//     >
//       <motion.div
//         className="absolute inset-y-0 left-0 w-6 h-6 bg-white rounded-full shadow-md"
//         animate={{ x: isEnabled ? 16 : 0 }}
//         transition={{ type: "spring", stiffness: 500, damping: 30 }}
//       />
//     </motion.div>
//   )
// }

// Composant d'affichage de section avec titre
// const SectionTitle = ({ title, children, action }) => {
//   return (
//     <div className="flex items-center justify-between mb-6">
//       <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//       {action && action}
//     </div>
//   )
// }

// Composant de carte de section
// const SectionCard = ({ title, children, className = "" }) => {
//   return (
//     <div className={`bg-white rounded-lg border border-gray-200 shadow-sm mb-6 ${className}`}>
//       {title && (
//         <div className="p-4 border-b border-gray-200">
//           <h3 className="text-sm font-medium">{title}</h3>
//         </div>
//       )}
//       {children}
//     </div>
//   )
// }

// Modifier le composant SettingsIcon pour garantir un espace uniforme et un alignement parfait
// const SettingsIcon = ({ icon, label, color, onClick }) => {
//   return (
//     <motion.button
//       className="flex flex-col items-center justify-start w-full h-full"
//       onClick={onClick}
//       whileHover={{ y: -3 }}
//       whileTap={{ scale: 0.95 }}
//     >
//       <div className="flex flex-col items-center justify-center w-full h-full p-2">
//         <div className={`w-16 h-16 ${color} rounded-lg mb-2 flex items-center justify-center shadow-sm`}>
//           {React.cloneElement(icon, { className: "w-7 h-7 text-white" })}
//         </div>
//         <span className="text-xs text-center text-gray-700 font-medium line-clamp-2 w-full">{label}</span>
//       </div>
//     </motion.button>
//   )
// }

// Composant pour l'en-tête de l'application
// const AppHeader = ({ onBack, showBackButton }) => {
//   return (
//     <div className="flex items-center px-6 py-4 border-b border-gray-200">
//       {showBackButton && (
//         <motion.button
//           className="mr-4 p-1.5 rounded-full hover:bg-gray-100"
//           onClick={onBack}
//           initial={{ opacity: 0, x: -10 }}
//           animate={{ opacity: 1, x: 0 }}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <ArrowLeftCircle className="w-5 h-5 text-gray-500" />
//         </motion.button>
//       )}
//       <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shadow-md">
//         <img src="/placeholder.svg?height=64&width=64" alt="Luviapp" className="w-full h-full object-cover" />
//       </div>
//       <div className="ml-4">
//         <h2 className="text-xl font-semibold text-gray-800">Luviapp</h2>
//         <p className="text-sm text-gray-500">{t.appInfo}</p>
//       </div>
//     </div>
//   )
// }

// Onglets en haut de la fenêtre
// const AppTabs = ({ activeTab, onTabChange }) => {
//   return (
//     <div className="flex border-b border-gray-200">
//       <button
//         className={`flex-1 py-2 px-4 text-center ${activeTab === "apple" ? "bg-white shadow-sm" : "bg-gray-50"}`}
//         onClick={() => onTabChange("apple")}
//       >
//         <div className="flex flex-col items-center">
//           <div className="w-8 h-8 mb-1 flex items-center justify-center">
//             <Apple className="w-5 h-5 text-gray-700" />
//           </div>
//           <span className="text-xs">{t.appleId}</span>
//         </div>
//       </button>
//       <button
//         className={`flex-1 py-2 px-4 text-center ${activeTab === "family" ? "bg-white shadow-sm" : "bg-gray-50"}`}
//         onClick={() => onTabChange("family")}
//       >
//         <div className="flex flex-col items-center">
//           <div className="w-8 h-8 mb-1 flex items-center justify-center">
//             <Users className="w-5 h-5 text-blue-500" />
//           </div>
//           <span className="text-xs">{t.familySharing}</span>
//         </div>
//       </button>
//     </div>
//   )
// }

// Composant pour la barre de recherche
// const SearchBar = ({ value, onChange }) => {
//   return (
//     <div className="px-4 pt-3 pb-2 border-b border-gray-200">
//       <div className="relative">
//         <input
//           type="text"
//           placeholder={t.searchPlaceholder}
//           className="w-full py-1.5 pl-8 pr-4 rounded-md bg-gray-200 border-none focus:ring-0 text-sm"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//         <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
//       </div>
//     </div>
//   )
// }

const SettingsWindow = ({ config }) => {
  const [viewMode, setViewMode] = useState("grid") // "grid" ou "detail"
  const [activeSection, setActiveSection] = useState("")
  const [activeSubSection, setActiveSubSection] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("apple")
  const [windowSize, setWindowSize] = useState({ width: 900, height: 600 })

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
    title: t.settingsTitle,
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
      // Simuler le redimensionnement de la fenêtre
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

  // Données pour les wallpapers
  // const wallpapers = [
  //   "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600",
  //   "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600",
  //   "https://images.pexels.com/photos/459203/pexels-photo-459203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //   "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //   "https://images.pexels.com/photos/1212693/pexels-photo-1212693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=10",
  //   "https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  // ]

  // Éléments de la sidebar
  const sidebarItems = [
    { id: "general", label: t.general, icon: <Globe className="w-4 h-4" /> },
    { id: "desktop", label: t.desktop, icon: <Monitor className="w-4 h-4" /> },
    { id: "wallpaper", label: t.wallpaper, icon: <Layout className="w-4 h-4" /> },
    { id: "accessibility", label: t.accessibility, icon: <Accessibility className="w-4 h-4" /> },
    { id: "network", label: t.network, icon: <Wifi className="w-4 h-4" /> },
    { id: "sound", label: t.sound, icon: <Volume className="w-4 h-4" /> },
    { id: "keyboard", label: t.keyboard, icon: <Keyboard className="w-4 h-4" /> },
    { id: "battery", label: t.battery, icon: <Battery className="w-4 h-4" /> },
    { id: "security", label: t.security, icon: <Shield className="w-4 h-4" /> },
    { id: "users", label: t.users, icon: <Users className="w-4 h-4" /> },
    { id: "date-time", label: t.dateTime, icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "displays", label: t.displays, icon: <Monitor className="w-4 h-4" /> },
  ]

  // Éléments de la grille principale
  const settingsItems = [
    { id: "general", label: t.general, icon: <Globe className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    { id: "desktop", label: t.desktop, icon: <Monitor className="w-6 h-6 text-white" />, color: "bg-green-500" },
    { id: "wallpaper", label: t.wallpaper, icon: <Layout className="w-6 h-6 text-white" />, color: "bg-blue-400" },
    { id: "network", label: t.network, icon: <Network className="w-6 h-6 text-white" />, color: "bg-blue-400" },
    { id: "bluetooth", label: t.bluetooth, icon: <Bluetooth className="w-6 h-6 text-white" />, color: "bg-blue-500" },
    { id: "sound", label: t.sound, icon: <Volume className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    { id: "keyboard", label: t.keyboard, icon: <Type className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    {
      id: "battery",
      label: t.battery,
      icon: <BatteryCharging className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    { id: "security", label: t.security, icon: <ShieldCheck className="w-6 h-6 text-white" />, color: "bg-gray-700" },
    { id: "users", label: t.users, icon: <Group className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    { id: "date-time", label: t.dateTime, icon: <CalendarIcon className="w-6 h-6 text-white" />, color: "bg-red-500" },
    { id: "displays", label: t.displays, icon: <Display className="w-6 h-6 text-white" />, color: "bg-blue-400" },
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
                display: "grid",
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

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <motion.div
            className="w-56 bg-gray-100/80 border-r border-gray-200 overflow-y-auto py-2 px-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="mb-2">
              <SidebarItem
                icon={<ArrowLeftCircle className="w-4 h-4" />}
                label={t.back}
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
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">{renderDetailContent()}</AnimatePresence>
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
