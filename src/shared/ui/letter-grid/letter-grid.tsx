import { FC } from 'react';
import styles from './letter-grid.module.scss';
import { StartLetter } from 'src/entities/word-game/config';

interface LetterGridProps {
  readonly value: StartLetter;
  readonly onChange: (letter: StartLetter) => void;
  readonly disabled: boolean;
}

export const LetterGrid: FC<LetterGridProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const letters = Object.values(StartLetter);

  const opacity = disabled ? 0.5 : undefined;

  return (
    <div className={styles.grid} style={{ opacity }}>
      {letters.map((letter) => (
        <button
          disabled={disabled}
          key={letter}
          type='button'
          className={`${styles.letter} ${value === letter ? styles.active : ''}`}
          onClick={() => onChange(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};
