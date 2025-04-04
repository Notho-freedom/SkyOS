"use client";

import { memo, useEffect, useCallback, useRef, useState } from "react";
import { useTheme } from "./../../theme/ThemeContext";
import { useWebApps } from "../../Apps/AppManager";
import AppList from './../../Apps/AppWeb';
import { useWindowContext } from './../window/WindowContext';

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
    <div className="relative">

      <div
        ref={dockRef}
        className={`fixed w-auto bottom-4 left-1/2 transform -translate-x-1/2 m-1 p-1 min-h-[50px] ${
          theme.name === "dark"
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/20 border-gray-200"
        } backdrop-blur-lg border rounded-2xl flex flex-row justify-center items-center gap-2 z-50 shadow-xl`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        ) : (
          apps.slice(0, visibleAppsCount).map((app) => (
            <div
              key={app.id}
              className="app-item relative flex flex-col items-center group cursor-pointer flex-shrink-0 min-w-[48px]"
              onClick={() =>addWindow(app)}
            >
              <div className="rounded-lg p-1.5 bg-gray-100/20 hover:bg-gray-100/30 transition-colors duration-200">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="h-8 w-8 object-cover rounded"
                  onError={(e) => (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")}
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
          ))
        )}
      </div>
    </div>
  );
};

export default memo(Dock);
