import { useNavigate } from 'react-router-dom';

import { ChevronLeftIcon, Header, IconButton, Typography } from 'src/shared';

import styles from './car-numbers-game-page.module.scss';

export function CarNumbersGamePage() {
  const navigate = useNavigate();

  function onNavigateBack() {
    navigate('/');
  }

  return (
    <div className={styles.carNumbersGamePage}>
      <Header
        paddingY={'xlarge'}
        left={
          <IconButton
            icon={<ChevronLeftIcon />}
            size={'xsmall'}
            onClick={onNavigateBack}
          />
        }
        center={<h2 className={styles.title}>Охота за номерами</h2>}
      />
      <div className={styles.content}>
        <Typography>Игра пока что не готова</Typography>
      </div>
    </div>
  );
}
