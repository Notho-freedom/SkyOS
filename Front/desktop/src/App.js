// App.jsx
import React from 'react';
import { AppProvider } from './desktop/AppContext';
import AppInitializer from './desktop/AppInitializer';
import DesktopBackground from './desktop/mainscreem/DesktopBackground';
import TopBar from './desktop/topbar/TopBar';
import Dock from './desktop/bottombar/Dock';
import DesktopManager from './desktop/mainscreem/DesktopManager';
import WindowManager from './desktop/window/WindowManager';

const App = () => (
  <AppProvider>
    <AppInitializer>
      <DesktopBackground>
        <TopBar />
        <DesktopManager />
        <WindowManager />
        <Dock />
      </DesktopBackground>
    </AppInitializer>
  </AppProvider>
);

export default App;