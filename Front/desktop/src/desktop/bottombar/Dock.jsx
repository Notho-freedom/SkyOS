"use client"

import { memo, useEffect, useCallback, useRef, useState } from "react"
import { useTheme } from "./../../theme/ThemeContext"
import { useWebApps } from "../../Apps/AppManager"
import { useApp } from "../AppContext"
import AppList from './../../Apps/AppInit'

const Dock = () => {
  const { theme } = useTheme();
  const { batchAddApps, apps } = useWebApps();
  const { setWindows, windows } = useApp();
  const [visibleAppsCount, setVisibleAppsCount] = useState(apps.length);
  const dockRef = useRef(null);

  useEffect(() => {
    batchAddApps(AppList);
  }, [batchAddApps])

  const handleResize = useCallback(() => {
    const viewportWidth = window.innerWidth/2;
    const paddingX = 32; // px-4 (16px * 2)
    const gap = 8; // gap-2 (8px)
    const appItems = dockRef.current?.querySelectorAll('.app-item');
    
    if (!appItems || appItems.length === 0) return;

    const firstAppItem = appItems[0];
    const appItemWidth = firstAppItem.offsetWidth;
    const maxWidth = viewportWidth - paddingX;
    const availableWidthPerApp = appItemWidth + gap;
    
    let maxN = Math.floor((maxWidth + gap) / availableWidthPerApp);
    maxN = Math.max(1, Math.min(apps.length, maxN));
    
    setVisibleAppsCount(maxN);
  }, [apps.length]);

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [apps, handleResize])

  return (
    <div
      ref={dockRef}
      className={`fixed w-auto bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 ${
        theme.name === "dark"
          ? "bg-gray-900/80 border-gray-700"
          : "bg-white/20 border-gray-200"
      } backdrop-blur-lg border rounded-2xl flex flex-row justify-center gap-2 z-50 shadow-xl`}
    >
      {apps.slice(0, visibleAppsCount).map((app) => (
        <div
          key={app.id}
          className="app-item relative flex flex-col items-center group"
          onClick={() =>
            setWindows([
              ...windows,
              {
                id: app.id,
                url: app.url,
                minimized: false,
                maximized: false,
                zIndex: 1,
                position: { x: 100, y: 100 },
                size: { width: 350, height: 300 },
              },
            ])
          }
        >
          <div className="rounded-lg p-1.5 bg-gray-100/20 hover:bg-gray-100/30 transition-colors duration-200 cursor-pointer">
            <img
              src={app.icon}
              alt={app.name}
              className="h-8 w-8 object-cover rounded"
              onError={(e) => (e.target.src = "/default-icon.png")}
            />
          </div>

          <div
            className={`absolute -top-8 px-2 py-1 ${
              theme.name === "dark" ? "bg-gray-700" : "bg-gray-800"
            } text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
          >
            {app.name}
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(Dock)