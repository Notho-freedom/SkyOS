import React, { useState } from 'react';
import DesktopBackground from './desktop/mainscreem/DesktopBackground';
import TopBar from './desktop/topbar/TopBar';
import Dock from './desktop/bottombar/Dock';
import WebViewWindow from './desktop/window/WebViewWindow';

const App = () => {
  const [activeWindow, setActiveWindow] = useState(null);
  const [windows] = useState([
    { id: 1, url: "https://windows-live.genesis-company.net" },
    { id: 2, url: "https://genesis-company.net" }
  ]);

  return (
    <DesktopBackground>
      <TopBar />
      <Dock />
      {windows.map(window => (
        <WebViewWindow
          key={window.id}
          id={window.id}
          url={window.url}
          active={activeWindow === window.id}
          onFocus={() => setActiveWindow(window.id)}
        />
      ))}
    </DesktopBackground>
  );
};

export default App;