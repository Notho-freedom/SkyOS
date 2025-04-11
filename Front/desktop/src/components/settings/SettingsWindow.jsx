"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe,
  Monitor,
  Dock,
  Layout,
  Search,
  CreditCardIcon as Card,
  Fingerprint,
  Users,
  Accessibility,
  Clock,
  Wifi,
  Bluetooth,
  Volume,
  Keyboard,
  Battery,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Info,
  Clock1,
  ArrowLeftCircle,
  Shield,
  Check,
  Languages,
  BellRing,
  User,
  KeyRound,
  Group,
  Eye,
  HourglassIcon,
  PuzzleIcon,
  Network,
  VolumeX,
  PrinterIcon,
  Type,
  Mouse,
  DiscIcon as Display,
  MonitorSmartphone,
  BatteryCharging,
  CalendarIcon,
  ShareIcon,
  History,
  HardDrive,
  Apple,
  RefreshCw,
  WifiOff,
  BluetoothOff,
  Mic,
  SlidersHorizontal,
  Lock,
  ShieldCheck,
} from "lucide-react"

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
    chooseDesktop: "Choisir votre fond d'écran",
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
    setupScreenSaver: "Configurer votre économiseur d'écran",

    // Dock & Menu Bar
    dockAndMenuBar: "Dock et barre de menus",
    customizeDock: "Personnaliser votre dock et barre de menus",

    // Communs dans les menus déroulants
    minutes2: "2 minutes",
    minutes5: "5 minutes",
    minutes10: "10 minutes",
    minutes30: "30 minutes",
    never: "Jamais",
  },
}

// Utiliser la langue française par défaut
const t = translations.fr

// Composant pour les éléments de la sidebar
const SidebarItem = ({ icon, label, isActive, onClick }) => {
  return (
    <motion.button
      className={`flex items-center w-full px-3 py-2 text-left rounded-lg transition-colors ${
        isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200/50"
      }`}
      onClick={onClick}
      whileHover={{ x: isActive ? 0 : 3 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center w-6 h-6 mr-3">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  )
}

// Composant pour les éléments de contenu
const ContentItem = ({ icon, label, description, color, onClick }) => {
  return (
    <motion.div
      className="flex items-center p-4 rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
      whileTap={{ y: 0, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}
    >
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mr-4 shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{label}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
    </motion.div>
  )
}

// Composant pour les options de wallpaper
const WallpaperOption = ({ image, isSelected, onClick }) => {
  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden cursor-pointer ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src={image || "/placeholder.svg"}
        alt="Wallpaper option"
        className="w-full h-full object-cover aspect-video"
      />
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  )
}

// Composant pour les toggles
const ToggleSwitch = ({ isEnabled, onChange }) => {
  return (
    <motion.div
      className={`relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full ${
        isEnabled ? "bg-green-500" : "bg-gray-300"
      }`}
      onClick={() => onChange(!isEnabled)}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-6 h-6 bg-white rounded-full shadow-md"
        animate={{ x: isEnabled ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.div>
  )
}

// Composant d'affichage de section avec titre
const SectionTitle = ({ title, children, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {action && action}
    </div>
  )
}

// Composant de carte de section
const SectionCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm mb-6 ${className}`}>
      {title && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}

// Modifier le composant SettingsIcon pour garantir un espace uniforme et un alignement parfait
const SettingsIcon = ({ icon, label, color, onClick }) => {
  return (
    <motion.button
      className="flex flex-col items-center justify-start w-full h-full"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full p-2">
        <div className={`w-16 h-16 ${color} rounded-lg mb-2 flex items-center justify-center shadow-sm`}>
          {React.cloneElement(icon, { className: "w-7 h-7 text-white" })}
        </div>
        <span className="text-xs text-center text-gray-700 font-medium line-clamp-2 w-full">{label}</span>
      </div>
    </motion.button>
  )
}

// Composant pour l'en-tête de l'application
const AppHeader = ({ onBack, showBackButton }) => {
  return (
    <div className="flex items-center px-6 py-4 border-b border-gray-200">
      {showBackButton && (
        <motion.button
          className="mr-4 p-1.5 rounded-full hover:bg-gray-100"
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeftCircle className="w-5 h-5 text-gray-500" />
        </motion.button>
      )}
      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shadow-md">
        <img src="/placeholder.svg?height=64&width=64" alt="Luviapp" className="w-full h-full object-cover" />
      </div>
      <div className="ml-4">
        <h2 className="text-xl font-semibold text-gray-800">Luviapp</h2>
        <p className="text-sm text-gray-500">{t.appInfo}</p>
      </div>
    </div>
  )
}

// Onglets en haut de la fenêtre
const AppTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-2 px-4 text-center ${activeTab === "apple" ? "bg-white shadow-sm" : "bg-gray-50"}`}
        onClick={() => onTabChange("apple")}
      >
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <Apple className="w-5 h-5 text-gray-700" />
          </div>
          <span className="text-xs">{t.appleId}</span>
        </div>
      </button>
      <button
        className={`flex-1 py-2 px-4 text-center ${activeTab === "family" ? "bg-white shadow-sm" : "bg-gray-50"}`}
        onClick={() => onTabChange("family")}
      >
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-xs">{t.familySharing}</span>
        </div>
      </button>
    </div>
  )
}

// Composant pour la barre de recherche
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="px-4 pt-3 pb-2 border-b border-gray-200">
      <div className="relative">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className="w-full py-1.5 pl-8 pr-4 rounded-md bg-gray-200 border-none focus:ring-0 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>
    </div>
  )
}

const SettingsWindow = ({ config }) => {
  const [viewMode, setViewMode] = useState("grid") // "grid" ou "detail"
  const [activeSection, setActiveSection] = useState("")
  const [activeSubSection, setActiveSubSection] = useState("")
  const [selectedWallpaper, setSelectedWallpaper] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("apple")
  const [windowSize, setWindowSize] = useState({ width: 900, height: 600 })

  // États pour les toggles
  const [toggleStates, setToggleStates] = useState({
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
  })

  // Fonction pour mettre à jour l'état d'un toggle
  const updateToggle = (key, value) => {
    setToggleStates((prev) => ({
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
  const wallpapers = [
    "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/459203/pexels-photo-459203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1212693/pexels-photo-1212693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=10",
    "https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ]

  // Éléments de la sidebar
  const sidebarItems = [
    { id: "screen-time", label: t.screenTime, icon: <Clock1 className="w-4 h-4" /> },
    { id: "general", label: t.general, icon: <Globe className="w-4 h-4" /> },
    { id: "appearance", label: t.desktop, icon: <Monitor className="w-4 h-4" /> },
    { id: "accessibility", label: t.accessibility, icon: <Accessibility className="w-4 h-4" /> },
    { id: "control-center", label: t.dock, icon: <Layout className="w-4 h-4" /> },
    { id: "siri", label: t.siri, icon: <Search className="w-4 h-4" /> },
    { id: "privacy", label: t.security, icon: <Shield className="w-4 h-4" /> },
    { id: "desktop", label: t.desktop, icon: <Dock className="w-4 h-4" /> },
    { id: "displays", label: t.displays, icon: <Monitor className="w-4 h-4" /> },
    { id: "wallpaper", label: t.wallpaper, icon: <Layout className="w-4 h-4" /> },
    { id: "screen-saver", label: t.screenSaver, icon: <Clock className="w-4 h-4" /> },
    { id: "battery", label: t.battery, icon: <Battery className="w-4 h-4" /> },
    { id: "lock-screen", label: t.security, icon: <Lock className="w-4 h-4" /> },
    { id: "touch-id", label: t.touchId, icon: <Fingerprint className="w-4 h-4" /> },
    { id: "users", label: t.users, icon: <Users className="w-4 h-4" /> },
    { id: "network", label: t.network, icon: <Wifi className="w-4 h-4" /> },
    { id: "sound", label: t.sound, icon: <Volume className="w-4 h-4" /> },
    { id: "keyboard", label: t.keyboard, icon: <Keyboard className="w-4 h-4" /> },
    { id: "security", label: t.security, icon: <Shield className="w-4 h-4" /> },
  ]

  // Éléments de la grille principale
  const settingsItems = [
    { id: "general", label: t.general, icon: <Globe className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    {
      id: "desktop",
      label: t.desktop,
      icon: <Monitor className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    {
      id: "dock",
      label: t.dock,
      icon: <Dock className="w-6 h-6 text-white" />,
      color: "bg-blue-400",
    },
    {
      id: "mission-control",
      label: t.missionControl,
      icon: <Layout className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      id: "siri",
      label: t.siri,
      icon: <Mic className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    { id: "spotlight", label: t.spotlight, icon: <Search className="w-6 h-6 text-white" />, color: "bg-gray-600" },
    {
      id: "language",
      label: t.language,
      icon: <Languages className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "notifications",
      label: t.notifications,
      icon: <BellRing className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "internet",
      label: t.internetAccounts,
      icon: <User className="w-6 h-6 text-white" />,
      color: "bg-blue-600",
    },
    {
      id: "wallet",
      label: t.wallet,
      icon: <Card className="w-6 h-6 text-white" />,
      color: "bg-yellow-600",
    },
    {
      id: "touch-id",
      label: t.touchId,
      icon: <KeyRound className="w-6 h-6 text-white" />,
      color: "bg-red-600",
    },
    {
      id: "users",
      label: t.users,
      icon: <Group className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    {
      id: "accessibility",
      label: t.accessibility,
      icon: <Eye className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "screen-time",
      label: t.screenTime,
      icon: <HourglassIcon className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      id: "extensions",
      label: t.extensions,
      icon: <PuzzleIcon className="w-6 h-6 text-white" />,
      color: "bg-gray-600",
    },
    {
      id: "security",
      label: t.security,
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      color: "bg-gray-700",
    },
    {
      id: "software-update",
      label: t.softwareUpdate,
      icon: <RefreshCw className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "network",
      label: t.network,
      icon: <Network className="w-6 h-6 text-white" />,
      color: "bg-blue-400",
    },
    {
      id: "bluetooth",
      label: t.bluetooth,
      icon: <Bluetooth className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "sound",
      label: t.sound,
      icon: <Volume className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    {
      id: "printers",
      label: t.printers,
      icon: <PrinterIcon className="w-6 h-6 text-white" />,
      color: "bg-gray-600",
    },
    {
      id: "keyboard",
      label: t.keyboard,
      icon: <Type className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    {
      id: "trackpad",
      label: t.trackpad,
      icon: <SlidersHorizontal className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    {
      id: "mouse",
      label: t.mouse,
      icon: <Mouse className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    {
      id: "displays",
      label: t.displays,
      icon: <Display className="w-6 h-6 text-white" />,
      color: "bg-blue-400",
    },
    {
      id: "sidecar",
      label: t.sidecar,
      icon: <MonitorSmartphone className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "battery",
      label: t.battery,
      icon: <BatteryCharging className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    {
      id: "date-time",
      label: t.dateTime,
      icon: <CalendarIcon className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "sharing",
      label: t.sharing,
      icon: <ShareIcon className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "time-machine",
      label: t.timeMachine,
      icon: <History className="w-6 h-6 text-white" />,
      color: "bg-indigo-600",
    },
    {
      id: "startup-disk",
      label: t.startupDisk,
      icon: <HardDrive className="w-6 h-6 text-white" />,
      color: "bg-gray-600",
    },
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
    // Section Wallpaper
    if (activeSection === "desktop" || activeSection === "wallpaper") {
      if (activeSubSection === "wallpaper" || !activeSubSection) {
        return (
          <motion.div
            key="wallpaper"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full overflow-y-auto"
          >
            <div className="p-6">
              <SectionTitle
                title={t.wallpaper}
                action={
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Info className="w-4 h-4" />
                    </motion.button>
                  </div>
                }
              />

              <SectionCard className="mb-8">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">{t.builtInDisplay}</h3>
                    <motion.button
                      className="text-xs text-blue-500 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Dynamic ▾
                    </motion.button>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-6 flex justify-center">
                    <div className="w-48 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-md overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Current wallpaper"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard className="mb-8">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">{t.venturaGraphic}</h3>
                    <span className="text-xs text-gray-500">{t.desktopChanges}</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard className="mb-8">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">{t.dynamicDesktop}</h3>
                    <motion.button
                      className="text-xs text-blue-500 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t.showLess}
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {wallpapers.slice(0, 8).map((wallpaper, index) => (
                      <WallpaperOption
                        key={index}
                        image={wallpaper}
                        isSelected={selectedWallpaper === index}
                        onClick={() => setSelectedWallpaper(index)}
                      />
                    ))}
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">{t.lightDarkDesktop}</h3>
                    <motion.button
                      className="text-xs text-blue-500 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t.showAll} (21)
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {wallpapers.slice(0, 4).map((wallpaper, index) => (
                      <WallpaperOption
                        key={index + 8}
                        image={wallpaper}
                        isSelected={selectedWallpaper === index + 8}
                        onClick={() => setSelectedWallpaper(index + 8)}
                      />
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>
          </motion.div>
        )
      }
    }

    // Network settings
    if (activeSection === "network") {
      return (
        <motion.div
          key="network"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full overflow-y-auto"
        >
          <div className="p-6">
            <SectionTitle
              title={t.network}
              action={
                <motion.button
                  className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.assistant}
                </motion.button>
              }
            />

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      {toggleStates.wifi ? (
                        <Wifi className="w-4 h-4 text-white" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{t.wifiNetwork}</h3>
                      <p className="text-xs text-gray-500">
                        {toggleStates.wifi ? `${t.connected} • Home-Network` : t.disconnected}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">{toggleStates.wifi ? t.enabled : t.disabled}</span>
                    <ToggleSwitch isEnabled={toggleStates.wifi} onChange={(value) => updateToggle("wifi", value)} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                {toggleStates.wifi && (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t.ipAddress}</span>
                      <span className="text-sm font-medium">192.168.1.5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t.subnetMask}</span>
                      <span className="text-sm font-medium">255.255.255.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t.router}</span>
                      <span className="text-sm font-medium">192.168.1.1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t.dns}</span>
                      <span className="text-sm font-medium">8.8.8.8, 8.8.4.4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t.macAddress}</span>
                      <span className="text-sm font-medium">00:1B:44:11:3A:B7</span>
                    </div>
                  </div>
                )}
                {!toggleStates.wifi && (
                  <div className="flex justify-center items-center p-4">
                    <div className="text-center">
                      <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t.disconnected}</p>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                      {toggleStates.bluetooth ? (
                        <Bluetooth className="w-4 h-4 text-white" />
                      ) : (
                        <BluetoothOff className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{t.bluetooth}</h3>
                      <p className="text-xs text-gray-500">{toggleStates.bluetooth ? t.enabled : t.disabled}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {toggleStates.bluetooth ? t.enabled : t.disabled}
                    </span>
                    <ToggleSwitch
                      isEnabled={toggleStates.bluetooth}
                      onChange={(value) => updateToggle("bluetooth", value)}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{t.vpn}</h3>
                      <p className="text-xs text-gray-500">{t.notConfigured}</p>
                    </div>
                  </div>
                  <motion.button
                    className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-xs font-medium text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.configure}
                  </motion.button>
                </div>
              </div>
            </SectionCard>
          </div>
        </motion.div>
      )
    }

    // Sound settings
    if (activeSection === "sound") {
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
            <SectionTitle title={t.sound} />

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium mb-4">{t.outputVolume}</h3>
                <div className="flex items-center space-x-3">
                  <VolumeX className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="75"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <Volume className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">{t.mute}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.muteSound}
                    onChange={(value) => updateToggle("muteSound", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.showVolumeInMenuBar}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.showVolumeInMenuBar}
                    onChange={(value) => updateToggle("showVolumeInMenuBar", value)}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium mb-4">{t.outputDevice}</h3>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                      <Volume className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{t.internalSpeakers}</h4>
                      <p className="text-xs text-gray-500">{t.defaultDevice}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                      <Volume className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{t.hdmi}</h4>
                      <p className="text-xs text-gray-500">{t.notConnected}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium mb-4">{t.soundEffects}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.playSoundEffects}</span>
                  <ToggleSwitch isEnabled={true} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.playStartupSound}</span>
                  <ToggleSwitch isEnabled={true} onChange={() => {}} />
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm w-48">{t.alertVolume}</span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="60"
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

    // Keyboard settings
    if (activeSection === "keyboard") {
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
            <SectionTitle title={t.keyboard} />

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium mb-4">{t.keyRepeatRate}</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-xs">{t.slow}</span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="65"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <span className="text-xs">{t.fast}</span>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium mb-4">{t.delayUntilRepeat}</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-xs">{t.long}</span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="40"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <span className="text-xs">{t.short}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.useFunctionKeys}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.useFunctionKeys}
                    onChange={(value) => updateToggle("useFunctionKeys", value)}
                  />
                </div>
                <p className="text-xs text-gray-500">{t.fnKeyNote}</p>
              </div>
            </SectionCard>

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{t.keyboardShortcuts}</h3>
                  <motion.button
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.modify}
                  </motion.button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.missionControlShortcut}</span>
                    <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">^↑</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.screenCapture}</span>
                    <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">⇧⌘3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.spotlightShortcut}</span>
                    <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">⌘Space</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{t.input}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.autoCorrect}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.autoCorrect}
                    onChange={(value) => updateToggle("autoCorrect", value)}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.autoCapitalize}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.autoCapitalize}
                    onChange={(value) => updateToggle("autoCapitalize", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t.doubleSpacePeriod}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.doubleSpacePeriod}
                    onChange={(value) => updateToggle("doubleSpacePeriod", value)}
                  />
                </div>
              </div>
            </SectionCard>
          </div>
        </motion.div>
      )
    }

    // Battery settings
    if (activeSection === "battery") {
      return (
        <motion.div
          key="battery"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full overflow-y-auto"
        >
          <div className="p-6">
            <SectionTitle title={t.battery} />

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-4">
                    <div className="relative w-full h-full">
                      <BatteryCharging className="w-full h-full text-gray-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{t.battery}</h3>
                    <p className="text-xs text-gray-500">
                      85% - {t.charged} - 4:32 {t.timeRemaining}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.showPercentInMenuBar}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.showPercentInMenuBar}
                    onChange={(value) => updateToggle("showPercentInMenuBar", value)}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{t.powerSavingOptions}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.optimizeVideoStreaming}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.optimizeVideoStreaming}
                    onChange={(value) => updateToggle("optimizeVideoStreaming", value)}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.enablePowerMode}</span>
                  <ToggleSwitch
                    isEnabled={toggleStates.enablePowerMode}
                    onChange={(value) => updateToggle("enablePowerMode", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t.turnOffDisplayAfter}</span>
                  <select className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1">
                    <option>{t.minutes2}</option>
                    <option>{t.minutes5}</option>
                    <option selected>{t.minutes10}</option>
                    <option>{t.minutes30}</option>
                    <option>{t.never}</option>
                  </select>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{t.usageHistory}</h3>
              </div>
              <div className="p-4">
                <div className="h-40 bg-gray-50 rounded-lg mb-4 p-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500">{t.last24Hours}</span>
                    <span className="text-xs text-gray-500">{t.batteryLevel}</span>
                  </div>
                  <div className="h-24 relative">
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
                    <div className="absolute bottom-6 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute bottom-12 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute bottom-18 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute bottom-0 left-0 h-full w-px bg-gray-300"></div>

                    {/* Simulated battery graph */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-100 to-green-50 opacity-50 rounded"></div>

                    <div className="absolute bottom-0 left-0 right-0 h-px z-10">
                      <svg height="24" width="100%">
                        <path
                          d="M0,24 Q50,5 100,18 T200,12 T300,20 T400,15"
                          stroke="green"
                          fill="transparent"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.averageUsage}</span>
                    <span className="text-sm font-medium">12% {t.perHour}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.chargeCycles}</span>
                    <span className="text-sm font-medium">124</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t.condition}</span>
                    <span className="text-sm font-medium text-green-500">{t.normal}</span>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </motion.div>
      )
    }

    // Security settings
    if (activeSection === "security") {
      return (
        <motion.div
          key="security"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full overflow-y-auto"
        >
          <div className="p-6">
            <SectionTitle title={t.security} />

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{t.general}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm font-medium block mb-1">{t.requirePasswordAfterSleep}</span>
                    <span className="text-xs text-gray-500">{t.sleepInactivityNote}</span>
                  </div>
                  <ToggleSwitch
                    isEnabled={toggleStates.requirePasswordAfterSleep}
                    onChange={(value) => updateToggle("requirePasswordAfterSleep", value)}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t.allowAppDownloadedFrom}</span>
                  <select className="text-sm bg-gray-100 border-gray-200 rounded-md px-2 py-1">
                    <option>{t.appStore}</option>
                    <option selected>{t.identifiedDevelopers}</option>
                    <option>{t.anywhere}</option>
                  </select>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{t.fileVault}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm font-medium block mb-1">{t.fileVaultEnabled}</span>
                    <span className="text-xs text-gray-500">{t.diskEncrypted}</span>
                  </div>
                  <motion.button
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.disabled}
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500">{t.fileVaultDescription}</p>
              </div>
            </SectionCard>

            <SectionCard className="mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{t.firewall}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm font-medium block mb-1">{t.firewallOn}</span>
                    <span className="text-xs text-gray-500">{t.firewallDescription}</span>
                  </div>
                  <motion.button
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.options}
                  </motion.button>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium">{t.privacy}</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{t.location}</span>
                  </div>
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{t.contacts}</span>
                  </div>
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{t.calendar}</span>
                  </div>
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                      <BellRing className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{t.notifications}</span>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </motion.div>
      )
    }

    // Default content for other sections
    return (
      <motion.div
        key="default"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
      >
        <ContentItem
          icon={<Globe className="w-5 h-5 text-white" />}
          label={t.wallpaper}
          description={t.chooseDesktop}
          color="bg-blue-500"
          onClick={() => {
            navigateToSubSection(activeSection, "wallpaper")
          }}
        />
        <ContentItem
          icon={<Monitor className="w-5 h-5 text-white" />}
          label={t.screenSaver}
          description={t.setupScreenSaver}
          color="bg-purple-500"
          onClick={() => {}}
        />
        <ContentItem
          icon={<Dock className="w-5 h-5 text-white" />}
          label={t.dockAndMenuBar}
          description={t.customizeDock}
          color="bg-green-500"
          onClick={() => {}}
        />
        <ContentItem
          icon={<Layout className="w-5 h-5 text-white" />}
          label={t.missionControl}
          description=""
          color="bg-orange-500"
          onClick={() => {}}
        />
      </motion.div>
    )
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
