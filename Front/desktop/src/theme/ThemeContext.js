// ThemeContext.js
import { createContext, useContext, useState, useEffect } from "react"

const defaultTheme = {
  name: "default",
  colors: {
    primary: "#2563eb", // blue-600
    secondary: "#9333ea", // purple-600
    background: "#ffffff",
    text: "#000000",
  }
}

const darkTheme = {
  name: "dark",
  colors: {
    primary: "#1e40af", // blue-800
    secondary: "#7e22ce", // purple-800
    background: "#1a1a1a",
    text: "#ffffff",
  }
}

// Récupérer le thème initial (localStorage + préférence système)
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      return savedTheme === "dark" ? darkTheme : defaultTheme
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
})

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    localStorage.setItem("theme", theme.name)
    document.documentElement.style.setProperty("--primary", theme.colors.primary)
    document.documentElement.style.setProperty("--secondary", theme.colors.secondary)
    document.documentElement.style.setProperty("--background", theme.colors.background)
    document.documentElement.style.setProperty("--text", theme.colors.text)
  }, [theme])

  const toggleDarkMode = () => {
    setTheme(theme.name === "default" ? darkTheme : defaultTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
