import { memo, useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWebApps } from "../../Apps/AppManager"
import { useWindowContext } from "../window/WindowContext"
import DockBar from "./DockBar"
import Sphere from "./Sphere"
import { useApp } from "../AppContext"
import AppList from './../../Apps/AppWeb';

const Dock = () => {
  const { batchAddApps, apps, loading, Refresh } = useWebApps()
  const [visibleAppsCount, setVisibleAppsCount] = useState(apps.length)
  const [show, setShow] = useState(false)
  const dockRef = useRef(null)
  const resizeFrame = useRef(null)
  const { addWindow, addApp } = useWindowContext()
  const { showDock, setShowDock } = useApp()

  useEffect(() => {
    batchAddApps(AppList)

    const timeout = setTimeout(() => {
      setShow(true)
    }, 10000)

    return () => clearTimeout(timeout)
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

  return (
    <motion.div
      className={`fixed left-1/4 bottom-4 ${showDock ? 'flex' : 'hidden'} items-center justify-center space-x-4 z-50`}
      style={{
        opacity: show ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <DockBar apps={apps} loading={loading} visibleAppsCount={visibleAppsCount} dockRef={dockRef} addWindow={addWindow} />
      <Sphere action={() => addApp('IA')} />
      <DockBar apps={apps} loading={loading} visibleAppsCount={visibleAppsCount} dockRef={dockRef} addWindow={addWindow} />
    </motion.div>
  )
}

export default memo(Dock)
