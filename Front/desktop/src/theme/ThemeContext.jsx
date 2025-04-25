"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { showNotification } from "../desktop/notify/notifications"
import { useSettings } from "../config/settingsContext"

// Default themes
const defaultTheme = {
  name: "light",
  colors: {
    primary: "#2563eb", // blue-600
    secondary: "#9333ea", // purple-600
    background: "#ffffff",
    text: "#000000",
  },
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
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
    primary: "#1e40af", // blue-800
    secondary: "#7e22ce", // purple-800
    background: "#1a1a1a",
    text: "#ffffff",
  },
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: 16,
  fontWeight: "regular",
  reduceMotion: false,
  reduceTransparency: false,
  highContrast: false,
  fontSmoothing: true,
  interfaceDensity: "comfortable",
}

// Font families available
const fontFamilies = [
  { name: "System UI", value: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" },
  { name: "SF Pro", value: "'SF Pro', sans-serif" },
  { name: "Helvetica Neue", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Inter", value: "'Inter', sans-serif" },
]

// Accent colors available
const accentColors = [
  { name: "Bleu", value: "bg-blue-500", hover: "bg-blue-600", color: "#3b82f6" },
  { name: "Violet", value: "bg-purple-500", hover: "bg-purple-600", color: "#8b5cf6" },
  { name: "Rose", value: "bg-pink-500", hover: "bg-pink-600", color: "#ec4899" },
  { name: "Rouge", value: "bg-red-500", hover: "bg-red-600", color: "#ef4444" },
  { name: "Orange", value: "bg-orange-500", hover: "bg-orange-600", color: "#f97316" },
  { name: "Vert", value: "bg-green-500", hover: "bg-green-600", color: "#22c55e" },
  { name: "Cyan", value: "bg-cyan-500", hover: "bg-cyan-600", color: "#06b6d4" },
  { name: "Gris", value: "bg-gray-500", hover: "bg-gray-600", color: "#6b7280" },
]

// Get initial theme (localStorage + system preference)
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme)
        return themeData.name === "dark"
          ? { ...darkTheme, ...themeData }
          : { ...defaultTheme, ...themeData }
      } catch (error) {
        console.warn("Erreur lors du parsing du thème :", error)
        // Optionnel : supprimer l'entrée corrompue
        localStorage.removeItem("theme")
      }
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return prefersDark ? darkTheme : defaultTheme
  }

  return defaultTheme
}


const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
  toggleDarkMode: () => {},
  updateThemeProperty: () => {},
  fontFamilies: fontFamilies,
  accentColors: accentColors,
})

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme)
  const { state, dispatch } = useSettings()

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme))

    // Apply colors
    document.documentElement.style.setProperty("--primary", theme.colors.primary)
    document.documentElement.style.setProperty("--secondary", theme.colors.secondary)
    document.documentElement.style.setProperty("--background", theme.colors.background)
    document.documentElement.style.setProperty("--text", theme.colors.text)

    // Apply font settings
    document.documentElement.style.setProperty("--font-family", theme.fontFamily)
    document.documentElement.style.setProperty("--font-size", `${theme.fontSize}px`)

    // Apply font weight
    let fontWeightValue = "400"
    if (theme.fontWeight === "medium") fontWeightValue = "500"
    if (theme.fontWeight === "bold") fontWeightValue = "700"
    document.documentElement.style.setProperty("--font-weight", fontWeightValue)

    // Apply font smoothing
    if (theme.fontSmoothing) {
      document.documentElement.style.setProperty("-webkit-font-smoothing", "antialiased")
      document.documentElement.style.setProperty("-moz-osx-font-smoothing", "grayscale")
    } else {
      document.documentElement.style.setProperty("-webkit-font-smoothing", "auto")
      document.documentElement.style.setProperty("-moz-osx-font-smoothing", "auto")
    }

    // Apply motion and transparency settings
    if (theme.reduceMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }

    if (theme.reduceTransparency) {
      document.documentElement.classList.add("reduce-transparency")
    } else {
      document.documentElement.classList.remove("reduce-transparency")
    }

    if (theme.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply interface density
    document.documentElement.style.setProperty("--interface-density", theme.interfaceDensity)
    document.documentElement.classList.remove("density-compact", "density-comfortable", "density-spacious")
    document.documentElement.classList.add(`density-${theme.interfaceDensity}`)

    // Update system settings
    dispatch({
      type: "SET_THEME",
      payload: theme.name,
    })
  }, [theme, dispatch])

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    showNotification("System", "Theme changed", "info")
    setTheme((prevTheme) => {
      const newTheme =
        prevTheme.name === "light"
          ? { ...darkTheme, ...prevTheme, name: "dark", colors: { ...darkTheme.colors } }
          : { ...defaultTheme, ...prevTheme, name: "light", colors: { ...defaultTheme.colors } }
      return newTheme
    })
  }

  // Update a specific theme property
  const updateThemeProperty = (property, value) => {
    setTheme((prevTheme) => {
      if (property.startsWith("colors.")) {
        const colorKey = property.split(".")[1]
        return {
          ...prevTheme,
          colors: {
            ...prevTheme.colors,
            [colorKey]: value,
          },
        }
      }
      return {
        ...prevTheme,
        [property]: value,
      }
    })
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleDarkMode,
        updateThemeProperty,
        fontFamilies,
        accentColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
