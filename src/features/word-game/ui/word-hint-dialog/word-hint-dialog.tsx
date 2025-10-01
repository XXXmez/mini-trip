import { useEffect, useState } from 'react';
import { GameMode, GameSessionModel, nouns } from 'entities';
import { BottomSheet, Button, Typography } from 'shared/ui';

import styles from './word-hint-dialog.module.scss';

interface WordHintProps {
  readonly session: GameSessionModel;
  readonly open: boolean;
  readonly onClose: () => void;
}

export function WordHintDialog({ session, open, onClose }: WordHintProps) {
  const [hintWord, setHintWord] = useState<string | null>(null);

  // когда диалог открывается — очищаем предыдущее слово
  useEffect(() => {
    if (open) {
      setHintWord(null);
    }
  }, [open, session.id]);

  const handleReshuffle = () => {
    setHintWord(getRandomWord(session));
  };

  const masked = hintWord
    ? maskWord(hintWord)
    : 'Нажмите «Переподобрать», чтобы получить подсказку';

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className={styles.wordHintDialog}>
        <div className={styles.textContent}>
          <Typography size='xl2' className={styles.text}>
            {masked}
          </Typography>
        </div>
        <div
          className={styles.btn}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button onClick={handleReshuffle}>Обновить</Button>
        </div>
      </div>
    </BottomSheet>
  );
}

function getExpectedLetter(session: GameSessionModel): string | undefined {
  if (session.config.mode === GameMode.SINGLE_LETTER) {
    return session.config.letter;
  }
  if (
    session.config.mode === GameMode.LAST_LETTER &&
    session.usedWords.length > 0
  ) {
    const lastWord = session.usedWords[session.usedWords.length - 1];
    const skip = ['ь', 'ъ', 'й'];
    let i = lastWord.length - 1;
    while (i >= 0 && skip.includes(lastWord[i])) i--;
    return lastWord[i];
  }
  return undefined;
}

// helper: маскируем слово, первая буква всегда видна
function maskWord(word: string): string {
  if (!word) return word;

  const len = word.length;

  // определяем количество скрываемых букв в зависимости от длины
  let hideCount: number;
  if (len <= 5) hideCount = 1;
  else if (len <= 8) hideCount = 2;
  else if (len <= 11) hideCount = 3;
  else hideCount = 4;

  // ограничения
  hideCount = Math.max(1, Math.min(4, hideCount));
  hideCount = Math.min(hideCount, Math.max(0, len - 1)); // никогда не скрываем все символы

  // собираем индексы, которые можно скрывать (исключаем индекс 0 и не-letters)
  const hideableIndices: number[] = [];
  const letterRe = /[а-яё]/i; // кириллическая буква (учитывает ё)
  for (let i = 1; i < len; i++) {
    if (letterRe.test(word[i])) hideableIndices.push(i);
  }

  // если не нашлось ни одного hideable (напр. слово односимвольное или только не-буквы),
  // тогда ничего не маскируем
  if (hideableIndices.length === 0) return word;

  // корректируем hideCount если доступных индексов меньше
  hideCount = Math.min(hideCount, hideableIndices.length);

  // выбираем уникальные случайные индексы из hideableIndices
  const chosen = new Set<number>();
  while (chosen.size < hideCount) {
    const idx =
      hideableIndices[Math.floor(Math.random() * hideableIndices.length)];
    chosen.add(idx);
  }

  // формируем строку с подчёркиваниями вместо спрятанных букв
  return word
    .split('')
    .map((ch, i) => (chosen.has(i) ? '❓' : ch))
    .join('');
}

// helper: выбрать случайное слово с учётом режима и ожидаемой буквы
function getRandomWord(session: GameSessionModel): string | null {
  const expected = getExpectedLetter(session); // у тебя уже есть эта функция
  const expectedNormalized = expected ? expected.toLowerCase() : undefined;

  // фильтруем словарь по начальной букве если она есть
  const candidates = expectedNormalized
    ? nouns.filter((w) => w.startsWith(expectedNormalized))
    : nouns.slice();

  if (candidates.length === 0) return null;

  // предпочитаем неиспользованные слова
  const unused = candidates.filter((w) => !session.usedWords.includes(w));

  const pool = unused.length > 0 ? unused : candidates;

  // возвращаем случайное слово из pool
  return pool[Math.floor(Math.random() * pool.length)];
}
