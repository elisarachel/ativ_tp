import React from 'react';
import { createRoot } from 'react-dom/client';
import Roteador from './routes/roteador';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Roteador />
    </React.StrictMode>
  );
}

reportWebVitals();
