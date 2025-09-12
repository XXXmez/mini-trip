import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Header, IconButton, Setting } from 'src/shared';
import { ThemeModal } from 'src/features';

import styles from './home-page.module.scss';

const games = [
  {
    name: 'Словесная дуэль',
    path: '/word-game',
    description:
      'Добавляй слова одно за другим и проверяй, насколько длинной получится цепочка.',
  },
  {
    name: 'Охота за номерами',
    path: '/car-numbers',
    description: 'Охоться за номерами от 001 до 999 и не упусти ни одного!',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.homePage}>
      <Header
        paddingY={'xlarge'}
        center={<h1>Mini Trip</h1>}
        right={
          <IconButton
            icon={<Setting />}
            size={'tiny'}
            onClick={() => setModalOpen(true)}
          />
        }
      />
      <div className={styles.gamesList}>
        {games.map((game) => (
          <div
            key={game.path}
            className={styles.gameCard}
            onClick={() => navigate(game.path)}
          >
            <h2>{game.name}</h2>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
      <ThemeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
