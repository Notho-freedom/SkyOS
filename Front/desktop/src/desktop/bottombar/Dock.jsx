"use client"

import { useState, useEffect, memo } from "react"
import { useTheme } from "./../../theme/ThemeContext"
import { useApp } from "../AppContext"

const Dock = () => {
  const { theme } = useTheme()
  const { windows, fetchAppData } = useApp()
  const [dockApps, setDockApps] = useState([])

  useEffect(() => {
    const loadDockApps = async () => {
      try {
        const apps = await Promise.all( // Correction ici
          windows.map(window => fetchAppData(window.url))
        ) // Parenthèse manquante ajoutée
        setDockApps(apps.filter(app => app !== null))
      } catch (error) {
        console.error("Failed to load dock apps:", error)
      }
    }
    loadDockApps()
  }, [windows])

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 ${
      theme.name === "dark" 
        ? "bg-gray-900/80 border-gray-700" 
        : "bg-white/20 border-gray-200"
    } backdrop-blur-lg border rounded-2xl flex items-center space-x-3 z-50 shadow-xl`}>
      
      {dockApps.map((app) => (
        <div 
          key={app.id} 
          className="relative flex flex-col items-center group"
          onClick={() => console.log('Open app:', app.id)}
        >
          <div className="rounded-lg p-1.5 bg-gray-100/20 hover:bg-gray-100/30 transition-colors duration-200 cursor-pointer">
            <img 
              src={app.icon} 
              alt={app.name} 
              className="h-8 w-8 object-cover rounded"
              onError={(e) => e.target.src = '/default-icon.png'}
            />
          </div>
          
          <div className={`absolute -top-8 px-2 py-1 ${
            theme.name === "dark" ? "bg-gray-700" : "bg-gray-800"
          } text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
            {app.name}
          </div>
        </div>
      ))}

    </div>
  )
}

export default memo(Dock)