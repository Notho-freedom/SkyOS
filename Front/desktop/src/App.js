// App.jsx
import { WebAppProvider } from './Apps/AppManager';
import React, {Suspense }  from 'react';
import {useApp } from './desktop/AppContext';
import DesktopBackground from './desktop/mainscreem/DesktopBackground';
import TopBar from './desktop/topbar/TopBar';
import Dock from './desktop/bottombar/Dock';
import { useTranslation } from "react-i18next";
import DesktopManager from './desktop/mainscreem/DesktopManager';
import WindowManager from './desktop/window/WindowManager';
//A ne pas suprimer
import i18n from "./i18n";
import { ThemeProvider } from "./theme/ThemeContext"
import { ContextMenuProvider } from "./desktop/contextual_menu/ContextMenuContext";
import { Toaster } from "sonner";


const App = () => {
  const { t } = useTranslation();
  const { bgRef } = useApp();

  return (
<WebAppProvider>
      <ThemeProvider>
        <ContextMenuProvider>
            <Suspense fallback={<div>{t("loading")}</div>}>
              <DesktopBackground ref={bgRef}>
                <Toaster position="top-right" richColors closeButton />
                <TopBar />
                <Dock />
                <DesktopManager />
                <WindowManager />
              </DesktopBackground>
            </Suspense>
        </ContextMenuProvider>
      </ThemeProvider>
</WebAppProvider>
  );
};

export default App;
