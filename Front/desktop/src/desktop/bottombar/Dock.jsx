"use client"

import { memo, useEffect, useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../../theme/ThemeContext"
import { useWebApps } from "../../Apps/AppManager"
import AppList from "../../Apps/AppWeb"
import { useWindowContext } from "../window/WindowContext"

// Composant de la sphère centrale avec animation
const Sphere = ({action}) => {
  return (
    <motion.div
      className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-400 to-blue-300 z-50 flex justify-center items-center shadow-lg"
      initial={{ scale: 0.8 }}
      animate={{
        scale: [0.9, 1, 0.9],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      onClick={action}
      title="MAX IA"
    >
      <motion.div
        className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md"
        animate={{
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

// Composant d'icône d'application avec animation au survol
const AppIcon = ({ app, onClick }) => {
  return (
    <motion.div
      className="app-item relative flex flex-col items-center group cursor-pointer flex-shrink-0 min-w-[50px]"
      onClick={onClick}
      whileHover={{ scale: 1.2, y: -10 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="rounded-xl p-1.5 transition-colors duration-200"
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <img
          src={app.icon || "/placeholder.svg"}
          alt={app.name}
          className="h-8 w-8 object-cover rounded-lg"
          onError={(e) => (e.target.src = app.image)}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-8 px-2 py-1 bg-black/70 text-white text-xs rounded-md whitespace-nowrap"
      >
        {app.name}
      </motion.div>
      <motion.div
        className="w-1 h-1 rounded-full bg-white mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: app.isActive ? 1 : 0 }}
      />
    </motion.div>
  )
}

const Dock = () => {
  const { theme } = useTheme()
  const { batchAddApps, apps, loading, Refresh } = useWebApps()
  const [visibleAppsCount, setVisibleAppsCount] = useState(apps.length)
  const dockRef = useRef(null)
  const resizeFrame = useRef(null)
  const { addWindow, addApp } = useWindowContext()

  useEffect(() => {
    batchAddApps(AppList)
  }, [Refresh, batchAddApps])

  const handleResize = useCallback(() => {
    if (resizeFrame.current) {
      cancelAnimationFrame(resizeFrame.current)
    }

    resizeFrame.current = requestAnimationFrame(() => {
      if (!dockRef.current) return

      const viewportWidth = window.innerWidth / 2
      const paddingX = 32
      const gap = 8
      const appItems = dockRef.current.querySelectorAll(".app-item")

      if (!appItems.length) {
        setVisibleAppsCount(apps.length)
        return
      }

      const appItemWidth = appItems[0].offsetWidth
      const maxWidth = viewportWidth - paddingX
      const availableWidthPerApp = appItemWidth + gap

      let maxN = Math.floor((maxWidth + gap) / availableWidthPerApp)
      maxN = Math.max(1, Math.min(apps.length, maxN))

      setVisibleAppsCount(maxN)
    })
  }, [apps.length])

  useEffect(() => {
    handleResize()

    window.addEventListener("resize", handleResize)
    window.addEventListener("keydown", handleResize)

    const observer = new MutationObserver(handleResize)
    if (dockRef.current) {
      observer.observe(dockRef.current, { childList: true, subtree: true })
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("keydown", handleResize)
      observer.disconnect()
      if (resizeFrame.current) {
        cancelAnimationFrame(resizeFrame.current)
      }
    }
  }, [handleResize])

  useEffect(() => {
    handleResize()
  }, [apps, handleResize])

  // Animation d'entrée pour le dock
  const dockAnimation = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      className="fixed left-1/4 bottom-4 flex items-center justify-center space-x-4 z-50"
      initial="hidden"
      animate="show"
      variants={dockAnimation}
    >
      {/* Barre gauche */}
      <motion.div
        ref={dockRef}
        className={`flex flex-row justify-center items-center gap-2 min-h-[50px] px-2 ${
          theme.name === "dark" ? "bg-gray-900/60 border-gray-700" : "bg-white/20 border-gray-200"
        } backdrop-blur-xl border rounded-2xl shadow-xl z-50`}
        layout
      >
        {loading ? (
          <div className="flex items-center justify-center p-3">
            <motion.div
              className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : (
          <AnimatePresence>
            {apps.slice(0, visibleAppsCount / 2).map((app) => (
              <AppIcon key={app.id} app={app} onClick={() => addWindow(app)} />
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Sphère au centre */}
      <Sphere action={()=>addApp('Chatbot')} />

      {/* Barre droite */}
      <motion.div
        className={`flex flex-row justify-center items-center gap-2 min-h-[50px] px-2 ${
          theme.name === "dark" ? "bg-gray-900/60 border-gray-700" : "bg-white/20 border-gray-200"
        } backdrop-blur-xl border rounded-2xl shadow-xl z-50`}
        layout
      >
        {loading ? (
          <div className="flex items-center justify-center p-3">
            <motion.div
              className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : (
          <AnimatePresence>
            {apps.slice(visibleAppsCount / 2, visibleAppsCount).map((app) => (
              <AppIcon key={app.id} app={app} onClick={() => addWindow(app)} />
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  )
}

export default memo(Dock)

