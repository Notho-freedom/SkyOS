// BackgroundContext.jsx
import React, { createContext, useContext } from 'react';
import useBackgroundManager from './useBackgroundManager';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const backgroundManager = useBackgroundManager();
  
  return (
    <BackgroundContext.Provider value={backgroundManager}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
