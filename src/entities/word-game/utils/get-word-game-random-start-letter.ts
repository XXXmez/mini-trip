import { WordGameStartLetter } from '../config';

/**
 * Возвращает случайную букву из перечисления StartLetter.
 */
export function getWordGameRandomStartLetter(): WordGameStartLetter {
  const values = Object.values(WordGameStartLetter);
  const index = Math.floor(Math.random() * values.length);

  return values[index];
}
