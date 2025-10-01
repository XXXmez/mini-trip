import { useEffect } from 'react';
import {
  RouterProvider,
  ServiceWorkerProvider,
  ThemeProvider,
} from 'providers';

import './App.css';
import './styles/themes.scss';

function App() {
  useEffect(() => {
    const handler = (e: TouchEvent) => {
      const touch = e.touches[0];
      const edgeZone = 30; // px от края экрана

      if (
        touch.clientX < edgeZone ||
        touch.clientX > window.innerWidth - edgeZone
      ) {
        // свайп начинается у края → блокируем
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', handler, { passive: false });
    return () => document.removeEventListener('touchstart', handler);
  }, []);

  return (
    <div className={'app'}>
      <ServiceWorkerProvider>
        <ThemeProvider>
          <RouterProvider />
        </ThemeProvider>
      </ServiceWorkerProvider>
    </div>
  );
}

export default App;
