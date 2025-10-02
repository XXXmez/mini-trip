import { FC } from 'react';
import { WordGameStartLetter } from 'entities';

import styles from './letter-grid.module.scss';

interface LetterGridProps {
  readonly value: WordGameStartLetter;
  readonly onChange: (letter: WordGameStartLetter) => void;
  readonly disabled: boolean;
}

export const LetterGrid: FC<LetterGridProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const letters = Object.values(WordGameStartLetter);

  return (
    <div className={`${styles.grid} ${disabled ? styles.disabled : ''}`}>
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
