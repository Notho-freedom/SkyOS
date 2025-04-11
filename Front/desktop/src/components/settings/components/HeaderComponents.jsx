"use client"
import { motion } from "framer-motion"
import { ArrowLeftCircle, Search, Cloud, Users } from "lucide-react"

// Textes pour l'internationalisation
const translations = {
  fr: {
    appInfo: "Identifié Apple, iCloud, contenu multimédia et App Store",
    appleId: "Identifiant Apple",
    familySharing: "Partage familial",
    searchPlaceholder: "Rechercher",
  },
}

// Utiliser la langue française par défaut
const t = translations.fr

// Composant pour l'en-tête de l'application
export const AppHeader = ({ onBack, showBackButton }) => {
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
      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-md flex items-center justify-center">
        <Cloud className="w-10 h-10 text-white" />
      </div>
      <div className="ml-4">
        <h2 className="text-xl font-semibold text-gray-800">SKYOS</h2>
        <p className="text-sm text-gray-500">{t.appInfo}</p>
      </div>
    </div>
  )
}

// Onglets en haut de la fenêtre
export const AppTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-2 px-4 text-center ${activeTab === "apple" ? "bg-white shadow-sm" : "bg-gray-50"}`}
        onClick={() => onTabChange("apple")}
      >
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-blue-500" />
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
export const SearchBar = ({ value, onChange }) => {
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
