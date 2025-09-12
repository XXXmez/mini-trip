import { useEffect, useState } from 'react';
import { distance } from 'fastest-levenshtein';

import { Button, Modal, Typography } from 'src/shared';
import { useLocalStorage } from 'src/shared/lib/hooks/use-local-storage.ts';
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

  // если сессия или конфиг сменились — сбросим таймер на начальное значение
  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [session.id, turnTime]); // при смене сессии/времени сбрасываем

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

  // Set для быстрого поиска точного совпадения
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
        <Button onClick={() => setHintOpen(true)} disabled={true}>
          Подсказка
        </Button>
      </div>
      <div className={styles.wordGameContentWords}>
        <Typography>Использовано слов: {usedWords.length}</Typography>
        <Button onClick={() => setModalOpen(true)} disabled={loading}>
          Просмотреть все
        </Button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title='Все введённые слова'
        maxWidth='400px'
      >
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
            {Array.from(usedWords).map((word) => (
              <Typography key={word}>{word}</Typography>
            ))}
          </div>
        )}
      </Modal>
      <WordHintDialog
        session={session}
        open={hintOpen}
        onClose={() => setHintOpen(false)}
      />
    </div>
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

function maskWord(word: string): string {
  const len = word.length;
  let hideCount = 1;
  if (len >= 5 && len <= 6) hideCount = 2;
  else if (len >= 7 && len <= 9) hideCount = 3;
  else if (len >= 10) hideCount = 4;

  const indices = new Set<number>();
  while (indices.size < hideCount) {
    const idx = Math.floor(Math.random() * len);
    indices.add(idx);
  }

  return word
    .split('')
    .map((ch, i) => (indices.has(i) ? '_' : ch))
    .join('');
}

function getRandomWord(session: GameSessionModel): string | null {
  const expected = getExpectedLetter(session);
  const dict = expected ? nouns.filter((w) => w.startsWith(expected)) : nouns;

  if (dict.length === 0) return null;
  return dict[Math.floor(Math.random() * dict.length)];
}

interface WordHintProps {
  session: GameSessionModel;
  open: boolean;
  onClose: () => void;
}

export function WordHintDialog({ session, open, onClose }: WordHintProps) {
  const [hintWord, setHintWord] = useState<string | null>(() =>
    getRandomWord(session),
  );

  const handleReshuffle = () => {
    setHintWord(getRandomWord(session));
  };

  const masked = hintWord ? maskWord(hintWord) : 'Нет доступных слов';

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
