import { useState } from 'react';
import { ThemeModal } from 'features';
import { useNavigate } from 'react-router-dom';
import { Header, IconButton, Setting } from 'shared';

import styles from './home-page.module.scss';

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
        <div className={styles.gameCard} onClick={() => navigate('/word-game')}>
          <h2>Словесная дуэль</h2>
          <p>
            Добавляй слова одно за другим и проверяй, насколько длинной
            получится цепочка.
          </p>
        </div>
        <div
          className={styles.gameCard}
          onClick={() => navigate('/car-numbers-game')}
        >
          <h2>Охота за номерами</h2>
          <p>Охоться за номерами от 001 до 999 и не упусти ни одного!</p>
        </div>
      </div>
      <ThemeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
