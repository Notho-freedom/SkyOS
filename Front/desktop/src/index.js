import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppProvider } from './desktop/AppContext';
import { WindowProvider } from './desktop/window/WindowContext';

// Récupère l'élément racine
const container = document.getElementById('root');

// Crée une racine React
const root = createRoot(container);

// Rend l'application avec tous les providers
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
        <WindowProvider>
          <App />
        </WindowProvider>
      </AppProvider>
    </DndProvider>
  </React.StrictMode>
);

// Si vous utilisez reportWebVitals
reportWebVitals();