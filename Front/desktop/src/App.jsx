import React, { Suspense, useEffect, useState } from "react";
import { useApp } from './desktop/AppContext';
import { WebAppProvider } from './Apps/AppManager';
import DesktopBackground from './desktop/mainscreem/DesktopBackground';
import TopBar from './desktop/topbar/TopBar';
import Dock from './desktop/bottombar/Dock';
import { useTranslation } from "react-i18next";
import DesktopManager from './desktop/mainscreem/DesktopManager';
import WindowManager from './desktop/window/WindowManager';
import i18n from "./i18n"; // À ne pas supprimer
import { ThemeProvider } from "./theme/ThemeContext";
import { ContextMenuProvider } from "./desktop/contextual_menu/ContextMenuContext";
import { Toaster } from "sonner";

const App = () => {
  const { t } = useTranslation();
  const { bgRef } = useApp();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setIsPageLoaded(true);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <WebAppProvider>
      <ThemeProvider>
        <ContextMenuProvider>
          <Suspense fallback={<div>{t("loading")}</div>}>
            <DesktopBackground ref={bgRef}>
              <Toaster position="top-right" richColors closeButton />
              {isPageLoaded && (
                <>
                  <TopBar />
                  <Dock />
                  <DesktopManager />
                  <WindowManager />
                </>
              )}
            </DesktopBackground>
          </Suspense>
        </ContextMenuProvider>
      </ThemeProvider>
    </WebAppProvider>
  );
};

export default App;
