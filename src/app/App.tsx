import {
  RouterProvider,
  ServiceWorkerProvider,
  ThemeProvider,
} from 'providers';
import { Typography, useBlockEdgeSwipes } from 'shared';

import './App.css';
import './styles/themes.scss';

function App() {
  useBlockEdgeSwipes();

  function isInStandaloneMode() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true
    );
  }

  return (
    <>
      {isInStandaloneMode() ? (
        <div className={'app'}>
          <ServiceWorkerProvider>
            <ThemeProvider>
              <RouterProvider />
            </ThemeProvider>
          </ServiceWorkerProvider>
        </div>
      ) : (
        <Typography>Установите приложение как PWA</Typography>
      )}
    </>
  );
}

export default App;
