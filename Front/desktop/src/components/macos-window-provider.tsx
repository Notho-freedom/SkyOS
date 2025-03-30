"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { MacOSWindow } from "./macos-window"
import { createPortal } from "react-dom"

interface Window {
  id: string
  title: string
  content: React.ReactNode
  width?: number | string
  height?: number | string
  position?: { x: number; y: number }
  showNavigation?: boolean
  showSearch?: boolean
  resizable?: boolean
  theme?: "light" | "dark"
  zIndex: number
}

interface MacOSWindowContextType {
  windows: Window[]
  createWindow: (window: Omit<Window, "id" | "zIndex">) => string
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  bringToFront: (id: string) => void
  setTheme: (theme: "light" | "dark") => void
  currentTheme: "light" | "dark"
}

const MacOSWindowContext = createContext<MacOSWindowContextType | undefined>(undefined)

export const useMacOSWindow = () => {
  const context = useContext(MacOSWindowContext)
  if (!context) {
    throw new Error("useMacOSWindow must be used within a MacOSWindowProvider")
  }
  return context
}

export const MacOSWindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Window[]>([])
  const [highestZIndex, setHighestZIndex] = useState(1000)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  // Create portal container on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const container = document.createElement("div")
      container.id = "macos-window-portal"
      document.body.appendChild(container)
      setPortalContainer(container)

      return () => {
        document.body.removeChild(container)
      }
    }
  }, [])

  // Modifier la fonction createWindow pour ajouter un positionnement plus naturel des fenêtres
  const createWindow = useCallback(
    (windowData: Omit<Window, "id" | "zIndex">) => {
      const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newZIndex = highestZIndex + 1
      setHighestZIndex(newZIndex)

      // Calculer une position en cascade pour les nouvelles fenêtres
      const offsetX = (windows.length % 5) * 30 + 50
      const offsetY = (windows.length % 5) * 30 + 50

      const newWindow: Window = {
        ...windowData,
        id,
        zIndex: newZIndex,
        position: windowData.position || { x: offsetX, y: offsetY },
      }

      setWindows((prev) => [...prev, newWindow])
      return id
    },
    [windows, highestZIndex],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((window) => window.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    // Animation could be added here
    setWindows((prev) => prev.filter((window) => window.id !== id))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            width: "100%",
            height: "calc(100vh - 40px)",
            position: { x: 0, y: 0 },
          }
        }
        return window
      }),
    )
  }, [])

  const bringToFront = useCallback(
    (id: string) => {
      const newZIndex = highestZIndex + 1
      setHighestZIndex(newZIndex)
      setWindows((prev) =>
        prev.map((window) => {
          if (window.id === id) {
            return { ...window, zIndex: newZIndex }
          }
          return window
        }),
      )
    },
    [highestZIndex],
  )

  const changeTheme = useCallback((newTheme: "light" | "dark") => {
    setTheme(newTheme)
  }, [])

  const value = {
    windows,
    createWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    setTheme: changeTheme,
    currentTheme: theme,
  }

  return (
    <MacOSWindowContext.Provider value={value}>
      {children}
      {portalContainer &&
        createPortal(
          <>
            {windows.map((window) => (
              <div key={window.id} style={{ zIndex: window.zIndex }} onClick={() => bringToFront(window.id)}>
                <MacOSWindow
                  title={window.title}
                  width={window.width}
                  height={window.height}
                  initialPosition={window.position}
                  showNavigation={window.showNavigation}
                  showSearch={window.showSearch}
                  resizable={window.resizable}
                  theme={window.theme || theme}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  onMaximize={() => maximizeWindow(window.id)}
                >
                  {window.content}
                </MacOSWindow>
              </div>
            ))}
          </>,
          portalContainer,
        )}
    </MacOSWindowContext.Provider>
  )
}

