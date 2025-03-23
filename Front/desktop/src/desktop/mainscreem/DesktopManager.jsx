import React, { useRef, useState, useEffect } from 'react';
import DesktopIcon from './DesktopIcon';
import { useApp } from './../AppContext';

const DesktopManager = () => {
  const { desktopIcons, handleIconAction } = useApp();
  const desktopRef = useRef(null);
  const [desktopBounds, setDesktopBounds] = useState({
    width: 0,
    height: 0,
    topOffset: 20,    // Hauteur de la TopBar
    bottomOffset: 40  // Hauteur de la Dock
  });

  const updateBounds = () => {
    if (desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      setDesktopBounds(prev => ({
        ...prev,
        width: rect.width,
        height: rect.height
      }));
    }
  };

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  return (
    <div 
      ref={desktopRef}
      className="desktop-area w-full h-full overflow-hidden relative"
      style={{
        top: desktopBounds.topOffset,
        height: `calc(100% - ${desktopBounds.topOffset + desktopBounds.bottomOffset}px)`
      }}
    >
      {desktopIcons.map(icon => (
        <DesktopIcon
          key={icon.id}
          {...icon}
          desktopBounds={desktopBounds}
          onAction={(action) => handleIconAction(icon.id, action)}
        />
      ))}
    </div>
  );
};

export default DesktopManager;