import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppProvider } from './desktop/AppContext';
import { WindowProvider } from './desktop/window/WindowContext';

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
      <WindowProvider>
        <App />
      </WindowProvider>
      </AppProvider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
