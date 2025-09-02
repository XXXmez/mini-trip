import { useEffect, useState } from 'react';
import { distance } from 'fastest-levenshtein';

import { BottomSheet, Button, Modal, Typography } from 'src/shared';
import { GameMode, GameSessionModel, nouns, TurnTime } from '../../config';

import styles from './word-game-content.module.scss';
import { getTurnTimeDescription } from 'src/pages/word-game-page/ui/word-game-page.tsx';
import { InputField } from 'src/shared/ui/input-field/input-field.tsx';

type CheckResult =
  | { status: 'ok'; word: string }
  | { status: 'duplicate'; word: string }
  | { status: 'invalid-letter'; word: string; expected: string }
  | { status: 'suggest'; word: string; suggestions: string[] }
  | { status: 'suggest-duplicate'; word: string; suggestions: string[] }
  | { status: 'not-found'; word: string };

interface WordGameContentProps {
  readonly session: GameSessionModel;
  readonly onExit: () => void;
  readonly onFinish: (sessionId: string) => void;
  readonly onAddWord: (sessionId: string, word: string) => void;
}

export function WordGameContent(props: WordGameContentProps) {
  const { session, onExit, onFinish, onAddWord } = props;

  const { id: sessionId, config, usedWords } = session;
  const { letter, mode, turnTime, checkWords } = config;

  const getInitialSeconds = (t: TurnTime): number | null => {
    switch (t) {
      case TurnTime.SEC_30:
        return 30;
      case TurnTime.SEC_60:
        return 60;
      case TurnTime.MIN_2:
        return 120;
      default:
        return null;
    }
  };

  const initialSeconds = getInitialSeconds(turnTime);

  const [timeLeft, setTimeLeft] = useState<number | null>(() => initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [session.id, turnTime]);

  useEffect(() => {
    if (initialSeconds === null) {
      // Нет лимита — интервал не нужен
      return;
    }

    // сброс значения на начальное (на всякий случай)
    setTimeLeft(initialSeconds);

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          // время вышло — помечаем игру законченной через колбэк
          clearInterval(id);
          onFinish(sessionId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
    // намеренно: пересоздаём интервал при смене session.id или turnTime
  }, [sessionId, turnTime, initialSeconds, onFinish]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const dictionarySet = new Set(nouns);

  const getExpectedLetter = () => {
    if (mode === GameMode.SINGLE_LETTER) {
      return letter;
    }
    if (mode === GameMode.LAST_LETTER && usedWords.length > 0) {
      const lastWord = usedWords[usedWords.length - 1];
      const skip = ['ь', 'ъ', 'й', 'ы', 'ё'];
      let i = lastWord.length - 1;
      while (i >= 0 && skip.includes(lastWord[i])) i--;
      return lastWord[i];
    }
    return undefined;
  };

  const findSimilar = (word: string, dict: string[], maxDistance = 2) => {
    const minLen = word.length - 2;
    const maxLen = word.length + 2;
    return dict
      .filter((w) => w.length >= minLen && w.length <= maxLen)
      .map((w) => ({ w, d: distance(word, w) }))
      .filter((x) => x.d <= maxDistance)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map((x) => x.w);
  };

  const checkWord = (raw: string): CheckResult => {
    const word = raw.toLowerCase();

    const expectedLetter = getExpectedLetter();
    if (expectedLetter && word[0] !== expectedLetter) {
      return { status: 'invalid-letter', word, expected: expectedLetter };
    }

    if (config.checkWords && !dictionarySet.has(word)) {
      const suggestions = findSimilar(word, nouns, 1);
      if (suggestions.length > 0) {
        if (usedWords.includes(suggestions[0])) {
          return { status: 'suggest-duplicate', word, suggestions };
        }
        return { status: 'suggest', word, suggestions };
      }
      return { status: 'not-found', word };
    }

    if (usedWords.includes(word)) {
      return { status: 'duplicate', word };
    }

    return { status: 'ok', word };
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const result = checkWord(input.trim());

      switch (result.status) {
        case 'ok':
          onAddWord(session.id, result.word);
          // СБРОС ТАЙМЕРА: если есть ограничение — сбрасываем на начальное значение
          if (initialSeconds !== null) {
            setTimeLeft(initialSeconds);
          }
          setMessage(`Слово "${result.word}" принято!`);
          break;

        case 'duplicate':
          setMessage(`Слово "${result.word}" уже использовалось.`);
          break;

        case 'invalid-letter':
          setMessage(
            `Слово "${result.word}" начинается не с "${result.expected}".`,
          );
          break;

        case 'suggest':
          setMessage(
            `Слово "${result.word}" не найдено. Возможно, вы имели в виду: ${result.suggestions[0]}?`,
          );
          break;

        case 'suggest-duplicate':
          setMessage(
            `Слово "${result.word}" похоже на "${result.suggestions[0]}", но оно уже использовалось.`,
          );
          break;

        case 'not-found':
          setMessage(`Слово "${result.word}" не найдено.`);
          break;
      }

      setInput('');
      setLoading(false);
    }, 50);
  };

  const expectedLetter = getExpectedLetter();

  return (
    <>
      <div className={styles.wordGameContent}>
        <div className={styles.wordGameContentTitle}>
          <Typography size={'xl2'} weight={'bold'}>
            {session.config.name}
          </Typography>
        </div>
        <div className={styles.wordGameContentInfo}>
          <div className={styles.wordGameContentInfoBlock}>
            <Typography size={'sm'} className={styles.wordGameContentInfoLabel}>
              Режим
            </Typography>
            <div className={styles.wordGameContentInfoContent}>
              {mode === GameMode.LAST_LETTER ? (
                <Typography>Последняя буква</Typography>
              ) : (
                <>
                  <Typography>На букву</Typography>
                  <Typography className={styles.wordGameContentInfoLetter}>
                    {letter}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <div className={styles.wordGameContentInfoBlock}>
            <Typography size={'sm'} className={styles.wordGameContentInfoLabel}>
              Время хода
            </Typography>
            <div className={styles.wordGameContentInfoContent}>
              <Typography>{getTurnTimeDescription(turnTime)}</Typography>
            </div>
          </div>
        </div>
        <div className={styles.wordGameContentWordCheck}>
          <Typography>{`Проверка слов ${checkWords ? 'включена' : 'выключена'}`}</Typography>
        </div>
        <div className={styles.wordGameContentTimer}>
          {turnTime !== TurnTime.UNLIMITED && timeLeft && (
            <div className={styles.wordGameContentTimerWrapper}>
              <Typography size={'xl5'}>{formatTime(timeLeft)}</Typography>
            </div>
          )}
        </div>
        <div className={styles.wordGameContentInputs}>
          <Typography>
            Последнее слово: {usedWords[usedWords.length - 1] ?? '-'}
          </Typography>
          <Typography>
            Следующее слово на:{' '}
            <span className={styles.nextLetter}>
              {expectedLetter ? expectedLetter.toUpperCase() : '-'}
            </span>
          </Typography>
          <InputField
            placeholder={'Введите слово'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            Отправить
          </Button>
        </div>
        <div className={styles.wordGameContentStatus}>
          {message && <Typography>{message}</Typography>}
        </div>
        <div className={styles.wordGameContentLoading}>
          {loading && <div>⏳ Проверяем слово...</div>}
        </div>
        <div className={styles.wordGameContentClue}>
          <Button onClick={() => setHintOpen(true)} disabled={loading}>
            Подсказка
          </Button>
        </div>
        <div className={styles.wordGameContentWords}>
          <Typography>Использовано слов: {usedWords.length}</Typography>
          <Button onClick={() => setModalOpen(true)} disabled={loading}>
            Просмотреть все
          </Button>
        </div>
      </div>
      <BottomSheet open={modalOpen} onClose={() => setModalOpen(false)}>
        {usedWords.length === 0 ? (
          <p>Пока нет слов</p>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {usedWords.map((word) => (
              <Typography key={word}>{word}</Typography>
            ))}
          </div>
        )}
      </BottomSheet>
      <WordHintDialog
        session={session}
        open={hintOpen}
        onClose={() => setHintOpen(false)}
      />
    </>
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
    .map((ch, i) => (chosen.has(i) ? '_' : ch))
    .join('');
}

// helper: выбрать случайное слово с учётом режима и ожидаемой буквы
function getRandomWord(session: GameSessionModel): string | null {
  const expected = getExpectedLetter(session); // у тебя уже есть эта функция
  const expectedNormalized = expected ? expected.toLowerCase() : undefined;

  // фильтруем словарь по начальной букве если она есть
  let candidates = expectedNormalized
    ? nouns.filter((w) => w.startsWith(expectedNormalized))
    : nouns.slice();

  if (candidates.length === 0) return null;

  // предпочитаем неиспользованные слова
  const unused = candidates.filter((w) => !session.usedWords.includes(w));

  const pool = unused.length > 0 ? unused : candidates;

  // возвращаем случайное слово из pool
  return pool[Math.floor(Math.random() * pool.length)];
}

interface WordHintProps {
  session: GameSessionModel;
  open: boolean;
  onClose: () => void;
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
    <Modal isOpen={open} onClose={onClose} title='Подсказка' maxWidth='400px'>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Typography size='xl2'>{masked}</Typography>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button onClick={handleReshuffle}>Переподобрать</Button>
        <Button onClick={onClose}>Закрыть</Button>
      </div>
    </Modal>
  );
}
