"use client";

import { memo, useEffect, useCallback, useRef, useState } from "react";
import { useTheme } from "./../../theme/ThemeContext";
import { useWebApps } from "../../Apps/AppManager";
import AppList from './../../Apps/AppWeb';
import { useWindowContext } from './../window/WindowContext';

// Composant de la sphère
const Sphere = () => {
  return (
    <div className="relative w-24 h-24 group cursor-pointer">
      {/* Sphère principale */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-sky-200 animate-complexSpin transform-gpu">
        
        {/* Noyau lumineux */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/40 to-transparent animate-pulse"></div>
        
        {/* Énergie tourbillonnante */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-300/30 to-blue-400/30 animate-energyFlow mix-blend-screen"></div>
        
        {/* Reflets dynamiques */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-dynamicReflect"></div>
      </div>

      {/* Halo interactif */}
      <div className="absolute -inset-6 rounded-full bg-radial-gradient(from_60%_60%, #00aaff10, transparent 60%) animate-haloPulse mix-blend-lighten"></div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 rounded-full animate-particleFloat">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white/30 rounded-full" 
               style={{
                 left: `${Math.random() * 80 + 10}%`,
                 top: `${Math.random() * 80 + 10}%`
               }}/>
        ))}
      </div>
    </div>
  );
};

const Dock = () => {
  const { theme } = useTheme();
  const { batchAddApps, apps, loading, error } = useWebApps();
  const [visibleAppsCount, setVisibleAppsCount] = useState(apps.length);
  const dockRef = useRef(null);
  const resizeFrame = useRef(null);
  const { addWindow } = useWindowContext();

  useEffect(() => {
    batchAddApps(AppList);
  }, [batchAddApps]);

  const handleResize = useCallback(() => {
    if (resizeFrame.current) {
      cancelAnimationFrame(resizeFrame.current);
    }

    resizeFrame.current = requestAnimationFrame(() => {
      if (!dockRef.current) return;

      const viewportWidth = window.innerWidth / 2;
      const paddingX = 32;
      const gap = 8;
      const appItems = dockRef.current.querySelectorAll('.app-item');

      if (!appItems.length) {
        setVisibleAppsCount(apps.length);
        return;
      }

      const appItemWidth = appItems[0].offsetWidth;
      const maxWidth = viewportWidth - paddingX;
      const availableWidthPerApp = appItemWidth + gap;

      let maxN = Math.floor((maxWidth + gap) / availableWidthPerApp);
      maxN = Math.max(1, Math.min(apps.length, maxN));

      setVisibleAppsCount(maxN);
    });
  }, [apps.length]);

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleResize);

    const observer = new MutationObserver(handleResize);
    if (dockRef.current) {
      observer.observe(dockRef.current, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleResize);
      observer.disconnect();
      if (resizeFrame.current) {
        cancelAnimationFrame(resizeFrame.current);
      }
    };
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [apps, handleResize]);

  return (
    <div className="fixed left-1/4 bottom-2 flex items-center justify-center space-x-4 z-50">

      {/* Barre gauche */}
      <div
        ref={dockRef}
        className={`flex flex-row justify-center items-center gap-1 min-h-[40px] ${
          theme.name === "dark"
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/20 border-gray-200"
        } backdrop-blur-lg border rounded-2xl shadow-xl z-50`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        ) : (
          apps.slice(0, visibleAppsCount / 2).map((app) => (
            <div
              key={app.id}
              className="app-item relative flex flex-col items-center group cursor-pointer flex-shrink-0 min-w-[40px]"
              onClick={() => addWindow(app)}
            >
              <div className="rounded-lg p-1.5 hover:bg-gray-100/30 transition-colors duration-200">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="h-6 w-6 object-cover rounded"
                  onError={(e) =>
                    (e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sphère au centre */}
      <Sphere />

      {/* Barre droite */}
      <div
        className={`flex flex-row justify-center items-center gap-1 min-h-[40px] ${
          theme.name === "dark"
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/20 border-gray-200"
        } backdrop-blur-lg border rounded-2xl shadow-xl z-50`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        ) : (
          apps.slice(visibleAppsCount / 2, visibleAppsCount).map((app) => (
            <div
              key={app.id}
              className="app-item relative flex flex-col items-center group cursor-pointer flex-shrink-0 min-w-[40px]"
              onClick={() => addWindow(app)}
            >
            <div className="rounded-lg p-1.5 transition-colors duration-200">
              <img
                  src={app.icon}
                  alt={app.name}
                  className="h-6 w-6 object-cover rounded"
                  onError={(e) =>
                    (e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(Dock);
