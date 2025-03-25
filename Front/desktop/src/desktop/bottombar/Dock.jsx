"use client"

import { useState } from "react"
import {
  FaFolderOpen ,
  FaSafari,
  FaAppStore,
  FaCommentDots ,
  FaPhoneAlt ,
  FaMusic,
  FaCalendar,
  FaPhotoVideo,
  FaBook,
  FaTv,
  FaPodcast,
  FaTrash,
  FaCog,
} from "react-icons/fa"

const Dock = () => {
  const [hoveredApp, setHoveredApp] = useState(null)

  const dockApps = [
    { id: "finder", name: "Finder", icon: FaFolderOpen, color: "bg-blue-500" },
    { id: "safari", name: "Safari", icon: FaSafari, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
    { id: "messages", name: "Messages", icon: FaCommentDots, color: "bg-gradient-to-r from-green-400 to-green-600" },
    { id: "facetime", name: "FaceTime", icon: FaPhoneAlt , color: "bg-gradient-to-r from-green-500 to-emerald-600" },
    { id: "photos", name: "Photos", icon: FaPhotoVideo, color: "bg-gradient-to-r from-indigo-500 to-purple-600" },
    { id: "appstore", name: "App Store", icon: FaAppStore, color: "bg-gradient-to-r from-blue-500 to-blue-700" },
    { id: "music", name: "Music", icon: FaMusic, color: "bg-gradient-to-r from-pink-500 to-red-600" },
    { id: "calendar", name: "Calendar", icon: FaCalendar, color: "bg-white text-black" },
    { id: "books", name: "Books", icon: FaBook, color: "bg-gradient-to-r from-orange-400 to-orange-600" },
    { id: "tv", name: "TV", icon: FaTv, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
    { id: "podcasts", name: "Podcasts", icon: FaPodcast, color: "bg-gradient-to-r from-purple-400 to-purple-600" },
    { id: "settings", name: "Settings", icon: FaCog, color: "bg-gray-400" },
    { id: "trash", name: "Trash", icon: FaTrash, color: "bg-gray-200" },
  ]

  const getScale = (index) => {
    if (hoveredApp === null) return 1
    const distance = Math.abs(index - hoveredApp)
    if (distance === 0) return 1.5
    if (distance === 1) return 1.2
    if (distance === 2) return 1.1
    return 1
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl flex items-end space-x-2 z-50 shadow-xl">
      {dockApps.map((app, index) => {
        const Icon = app.icon
        return (
          <div
            key={app.id}
            className="flex flex-col items-center group relative"
            onMouseEnter={() => setHoveredApp(index)}
            onMouseLeave={() => setHoveredApp(null)}
          >
            <div
              className={`relative rounded-xl p-2 shadow-lg transition-transform duration-200 ease-in-out ${app.color}`}
              style={{
                transform: `scale(${getScale(index)})`,
                zIndex: hoveredApp === index ? 10 : 1,
              }}
            >
              <Icon className="h-8 w-8 text-white" />
              {(app.id === "finder" || app.id === "messages") && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </div>

            {/* Tooltip Nom de l'application */}
            <div
              className={`absolute -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-200 ${
                hoveredApp === index ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {app.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Dock
