import './App.css';
import './styles/themes.scss';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HomePage, WordGamePage } from 'src/pages';

function App() {
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
