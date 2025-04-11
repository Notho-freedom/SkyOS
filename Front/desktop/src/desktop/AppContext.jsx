// AppContext.jsx
import React, { createContext, useRef, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const bgRef = useRef();
  const [top, setTop] = useState('top');
  const [showDock,setShowDock] = useState(true);
  const [error, setError] = useState([{}]);

  useEffect(() => {
    top=='bottom'? setShowDock(false):setShowDock(true);
  }, [top])

  return (
    <AppContext.Provider 
      value={{
        bgRef,
        top, setTop,
        setShowDock,showDock,
        error, setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};