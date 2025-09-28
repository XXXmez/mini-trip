import {
  RouterProvider,
  ServiceWorkerProvider,
  ThemeProvider,
} from 'src/providers';

import './App.css';
import './styles/themes.scss';

function App() {
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
