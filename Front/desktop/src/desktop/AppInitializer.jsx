// AppInitializer.jsx
import React, { useEffect } from 'react';
import { useApp } from './AppContext';

const AppInitializer = ({ children }) => {
  const { initializeResources } = useApp();

  useEffect(() => {
    initializeResources();
    // Autres initialisations globales
    const handleGlobalKey = (e) => {
      if (e.altKey && e.key === 'Tab') {
        // Gestion des raccourcis
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [initializeResources]);

  return <>{children}</>;
};

export default AppInitializer;