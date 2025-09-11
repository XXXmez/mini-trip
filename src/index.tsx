import './app/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'src/app/App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  throw new Error('Root element not found');
}
