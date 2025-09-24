import './App.css';
import './styles/themes.scss';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HomePage, WordGamePage } from 'src/pages';
import { useEffect } from 'react';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Доступна новая версия. Обновить?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Приложение готово работать оффлайн');
  },
});

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('app-theme');

    document.documentElement.className = theme
      ? (JSON.parse(theme) as string)
      : 'theme-light';
  }, []);

  return (
    <div className={'app'}>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/word-game' element={<WordGamePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
