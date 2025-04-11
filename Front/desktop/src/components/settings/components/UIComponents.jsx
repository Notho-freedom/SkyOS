"use client"

import React from "react"
import { motion } from "framer-motion"
import { ChevronRight, Check } from "lucide-react"

// Composant pour les éléments de la sidebar
export const SidebarItem = ({ icon, label, isActive, onClick }) => {
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
export const ContentItem = ({ icon, label, description, color, onClick }) => {
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
export const WallpaperOption = ({ image, isSelected, onClick }) => {
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
export const ToggleSwitch = ({ isEnabled, onChange }) => {
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
export const SectionTitle = ({ title, children, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {action && action}
    </div>
  )
}

// Composant de carte de section
export const SectionCard = ({ title, children, className = "" }) => {
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
export const SettingsIcon = ({ icon, label, color, onClick }) => {
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
