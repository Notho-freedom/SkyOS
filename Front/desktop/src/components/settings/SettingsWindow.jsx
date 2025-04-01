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
  Bell,
  UserCircle,
  CreditCard,
  Fingerprint,
  Users,
  Accessibility,
  Clock,
  Layers,
  Wifi,
  Bluetooth,
  Volume,
  Printer,
  Keyboard,
  MousePointer,
  Server,
  Battery,
  Calendar,
  Share2,
  Clock3,
  Disc,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Info,
  Clock1,
  ArrowLeftCircle,
} from "lucide-react"

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
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </motion.div>
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
        <p className="text-sm text-gray-500">Identifié Apple, iCloud, contenu multimédia et App Store</p>
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
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.06 2.093-.98 3.935-.98 1.831 0 2.35.98 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"
                fill="currentColor"
              />
              <path
                d="M14.128 3.198c.835-1.014 1.396-2.427 1.245-3.83-1.207.052-2.662.804-3.532 1.817-.78.896-1.456 2.338-1.273 3.714 1.338.104 2.716-.683 3.56-1.701z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-xs">Identifiant Apple</span>
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
          <span className="text-xs">Partage familial</span>
        </div>
      </button>
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

  const windowConfig = config || {
    title: "Paramètres",
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

  // Ajouter un effet pour gérer la responsivité de la grille
  useEffect(() => {
    const handleResize = () => {
      // Simuler le redimensionnement de la fenêtre
      const width = Math.min(1200, Math.max(800, window.innerWidth * 0.7))
      const height = Math.min(800, Math.max(600, window.innerHeight * 0.7))
      setWindowSize({ width, height })

      // Ajuster la disposition de la grille en fonction de la taille
      const gridContainer = document.querySelector(".grid")
      if (gridContainer) {
        const containerWidth = gridContainer.clientWidth
        // Logique pour ajuster la disposition si nécessaire
      }
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
   'https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600',
    "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/459203/pexels-photo-459203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1212693/pexels-photo-1212693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=10",
    "https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",

  ]

  // Éléments de la sidebar
  const sidebarItems = [
    { id: "screen-time", label: "Screen Time", icon: <Clock1 className="w-4 h-4" /> },
    { id: "general", label: "General", icon: <Globe className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Monitor className="w-4 h-4" /> },
    { id: "accessibility", label: "Accessibility", icon: <Accessibility className="w-4 h-4" /> },
    { id: "control-center", label: "Control Center", icon: <Layout className="w-4 h-4" /> },
    { id: "siri", label: "Siri & Spotlight", icon: <Search className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy & Security", icon: <Fingerprint className="w-4 h-4" /> },
    { id: "desktop", label: "Desktop & Dock", icon: <Dock className="w-4 h-4" /> },
    { id: "displays", label: "Displays", icon: <Monitor className="w-4 h-4" /> },
    { id: "wallpaper", label: "Wallpaper", icon: <Layout className="w-4 h-4" /> },
    { id: "screen-saver", label: "Screen Saver", icon: <Clock className="w-4 h-4" /> },
    { id: "battery", label: "Battery", icon: <Battery className="w-4 h-4" /> },
    { id: "lock-screen", label: "Lock Screen", icon: <Fingerprint className="w-4 h-4" /> },
    { id: "touch-id", label: "Touch ID & Password", icon: <Fingerprint className="w-4 h-4" /> },
    { id: "users", label: "Users & Groups", icon: <Users className="w-4 h-4" /> },
  ]

  // Éléments de la grille principale
  const settingsItems = [
    { id: "general", label: "Général", icon: <Globe className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    {
      id: "desktop",
      label: "Bureau et économiseur d'écran",
      icon: <Monitor className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    {
      id: "dock",
      label: "Dock et barre de menus",
      icon: <Dock className="w-6 h-6 text-white" />,
      color: "bg-blue-400",
    },
    {
      id: "mission-control",
      label: "Mission Control",
      icon: <Layout className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      id: "siri",
      label: "Siri",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            d="M12 18.5c3.5 0 6.5-2.9 6.5-6.5S15.5 5.5 12 5.5 5.5 8.4 5.5 12s2.9 6.5 6.5 6.5z"
            fill="white"
            stroke="white"
          />
          <path
            d="M12.5 8.8c-.2-.1-.3-.1-.5-.1-.9 0-1.7.8-1.7 1.7 0 .2 0 .3.1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14.7 11.3c.1.2.1.4.1.7 0 .9-.7 1.7-1.7 1.7-.2 0-.5 0-.7-.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M10.6 13.4c-.2-.2-.4-.5-.5-.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14.8 10.2c-.1-.3-.3-.6-.5-.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    { id: "spotlight", label: "Spotlight", icon: <Search className="w-6 h-6 text-white" />, color: "bg-gray-600" },
    {
      id: "language",
      label: "Langue et région",
      icon: <Globe className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "internet",
      label: "Comptes internet",
      icon: <UserCircle className="w-6 h-6 text-white" />,
      color: "bg-blue-600",
    },
    {
      id: "wallet",
      label: "Wallet et Apple Pay",
      icon: <CreditCard className="w-6 h-6 text-white" />,
      color: "bg-yellow-600",
    },
    {
      id: "touch-id",
      label: "Touch ID",
      icon: <Fingerprint className="w-6 h-6 text-white" />,
      color: "bg-red-600",
    },
    {
      id: "users",
      label: "Utilisateurs et groupes",
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    {
      id: "accessibility",
      label: "Accessibilité",
      icon: <Accessibility className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "screen-time",
      label: "Temps d'écran",
      icon: <Clock className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
    },
    { id: "extensions", label: "Extensions", icon: <Layers className="w-6 h-6 text-white" />, color: "bg-gray-600" },
    {
      id: "security",
      label: "Sécurité et confidentialité",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
        >
          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="white" />
          <path d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 11.5V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: "bg-gray-700",
    },
    {
      id: "software-update",
      label: "Mise à jour de logiciel",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
        >
          <circle cx="12" cy="12" r="10" fill="white" />
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 16l-4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: "bg-red-500",
    },
    { id: "network", label: "Réseau", icon: <Wifi className="w-6 h-6 text-white" />, color: "bg-blue-400" },
    {
      id: "bluetooth",
      label: "Bluetooth",
      icon: <Bluetooth className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    { id: "sound", label: "Son", icon: <Volume className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    {
      id: "printers",
      label: "Imprimantes et scanners",
      icon: <Printer className="w-6 h-6 text-white" />,
      color: "bg-gray-600",
    },
    { id: "keyboard", label: "Clavier", icon: <Keyboard className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    {
      id: "trackpad",
      label: "Trackpad",
      icon: <MousePointer className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    { id: "mouse", label: "Souris", icon: <MousePointer className="w-6 h-6 text-white" />, color: "bg-gray-500" },
    { id: "displays", label: "Moniteurs", icon: <Monitor className="w-6 h-6 text-white" />, color: "bg-blue-400" },
    { id: "sidecar", label: "Sidecar", icon: <Server className="w-6 h-6 text-white" />, color: "bg-blue-500" },
    { id: "battery", label: "Batterie", icon: <Battery className="w-6 h-6 text-white" />, color: "bg-green-500" },
    {
      id: "date-time",
      label: "Date et heure",
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    { id: "sharing", label: "Partage", icon: <Share2 className="w-6 h-6 text-white" />, color: "bg-blue-500" },
    {
      id: "time-machine",
      label: "Time Machine",
      icon: <Clock3 className="w-6 h-6 text-white" />,
      color: "bg-indigo-600",
    },
    {
      id: "startup-disk",
      label: "Disque de démarrage",
      icon: <Disc className="w-6 h-6 text-white" />,
      color: "bg-gray-600",
    },
  ]

  // Fonction pour gérer le clic sur un élément de la grille
  const handleGridItemClick = (itemId) => {
    setActiveSection(itemId)
    setViewMode("detail")
  }

  // Fonction pour revenir à la grille
  const handleBackToGrid = () => {
    setViewMode("grid")
    setActiveSection("")
    setActiveSubSection("")
  }

  // Rendu du contenu en fonction de la section active
  const renderDetailContent = () => {
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Wallpaper</h2>
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
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Built-In Display</h3>
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

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Ventura Graphic</h3>
                  <span className="text-xs text-gray-500">This desktop picture changes throughout the day.</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Dynamic Desktop</h3>
                  <motion.button
                    className="text-xs text-blue-500 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Show Less
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

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Light & Dark Desktop</h3>
                  <motion.button
                    className="text-xs text-blue-500 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Show All (21)
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
            </div>
          </motion.div>
        )
      }
    }

    // Contenu par défaut pour les autres sections
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
          label="Wallpaper"
          description="Choose your desktop picture"
          color="bg-blue-500"
          onClick={() => {
            setActiveSubSection("wallpaper")
          }}
        />
        <ContentItem
          icon={<Monitor className="w-5 h-5 text-white" />}
          label="Screen Saver"
          description="Set up your screen saver"
          color="bg-purple-500"
          onClick={() => {}}
        />
        <ContentItem
          icon={<Dock className="w-5 h-5 text-white" />}
          label="Dock & Menu Bar"
          description="Customize your dock and menu bar"
          color="bg-green-500"
          onClick={() => {}}
        />
        <ContentItem
          icon={<Layout className="w-5 h-5 text-white" />}
          label="Mission Control"
          description="Organize your windows"
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
        <div className="px-4 pt-3 pb-2 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher"
              className="w-full py-1.5 pl-8 pr-4 rounded-md bg-gray-200 border-none focus:ring-0 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

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
                label="Retour"
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
                onClick={() => setActiveSection(item.id)}
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

