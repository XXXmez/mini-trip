import { useState } from 'react';
import { distance } from 'fastest-levenshtein';

import { Modal } from 'src/shared';
import { useLocalStorage } from 'src/shared/lib/hooks/use-local-storage.ts';
import { GameMode, GameSessionModel, nouns } from '../../config';

import styles from './word-game-content.module.scss';

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
}

export function WordGameContent(props: WordGameContentProps) {
  const { session, onExit } = props;

  const sessionId = session.id;

  const [sessions, saveSessions] = useLocalStorage<GameSessionModel[]>(
    'word-game-sessions',
    [],
  );

  const activeSession = sessions.find((s) => s.id === sessionId);

  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!activeSession) {
    return <div>Игра не найдена</div>;
  }
  const usedWords = activeSession.usedWords;

  // Set для быстрого поиска точного совпадения
  const dictionarySet = new Set(nouns);

  // const checkWord = (word: string): CheckResult => {
  //   console.time('checkWord');
  //   word = word.toLowerCase();
  //
  //   // точное совпадение
  //   if (dictionarySet.has(word)) {
  //     if (usedWords.has(word)) {
  //       console.timeEnd('checkWord');
  //       return { status: 'duplicate', word };
  //     }
  //     console.timeEnd('checkWord');
  //     return { status: 'ok', word };
  //   }
  //
  //   // поиск похожих слов
  //   const suggestions = findSimilar(word, nouns, 1);
  //
  //   if (suggestions.length > 0) {
  //     const first = suggestions[0];
  //
  //     if (usedWords.has(first)) {
  //       console.timeEnd('checkWord');
  //       return { status: 'suggest-duplicate', word, suggestions };
  //     }
  //     console.timeEnd('checkWord');
  //     return { status: 'suggest', word, suggestions };
  //   }
  //   console.timeEnd('checkWord');
  //
  //   return { status: 'not-found', word };
  // };
  //
  // const findSimilar = (word: string, dict: string[], maxDistance = 2) => {
  //   const minLen = word.length - 2;
  //   const maxLen = word.length + 2;
  //
  //   return dict
  //     .filter((w) => w.length >= minLen && w.length <= maxLen)
  //     .map((w) => ({ w, d: distance(word, w) }))
  //     .filter((x) => x.d <= maxDistance)
  //     .sort((a, b) => a.d - b.d)
  //     .slice(0, 3)
  //     .map((x) => x.w);
  // };
  //
  // const handleSubmit = () => {
  //   if (!input.trim()) return;
  //
  //   setLoading(true);
  //
  //   setTimeout(() => {
  //     const result = checkWord(input.trim());
  //     setLoading(false);
  //
  //     switch (result.status) {
  //       case 'ok':
  //         setUsedWords((prev) => new Set(prev).add(result.word));
  //         setMessage(`Слово "${result.word}" принято!`);
  //         break;
  //
  //       case 'duplicate':
  //         setMessage(`Слово "${result.word}" уже использовалось.`);
  //         break;
  //
  //       case 'suggest':
  //         setMessage(
  //           `Слово "${result.word}" не найдено. Возможно, вы имели в виду: ${result.suggestions[0]}?`,
  //         );
  //         break;
  //
  //       case 'suggest-duplicate':
  //         setMessage(
  //           `Слово "${result.word}" похоже на "${result.suggestions[0]}", но оно уже использовалось.`,
  //         );
  //         break;
  //
  //       case 'not-found':
  //         setMessage(`Слово "${result.word}" не найдено.`);
  //         break;
  //     }
  //
  //     setInput('');
  //   }, 50); // имитация асинхронной проверки
  // };

  const getExpectedLetter = () => {
    if (activeSession.config.mode === GameMode.SINGLE_LETTER) {
      return activeSession.config.letter;
    }
    if (
      activeSession.config.mode === GameMode.LAST_LETTER &&
      usedWords.length > 0
    ) {
      const lastWord = usedWords[usedWords.length - 1];
      const skip = ['ь', 'ъ', 'й'];
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

  const checkWord = (word: string): CheckResult => {
    word = word.toLowerCase();

    const expectedLetter = getExpectedLetter();
    if (expectedLetter && word[0] !== expectedLetter) {
      return { status: 'invalid-letter', word, expected: expectedLetter };
    }

    if (activeSession.config.checkWords && !new Set(nouns).has(word)) {
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

  const addWord = (word: string) => {
    const updatedSessions = sessions.map((s) =>
      s.id === sessionId
        ? {
            ...s,
            usedWords: [...s.usedWords, word],
            updatedAt: new Date().toISOString(),
          }
        : s,
    );
    saveSessions(updatedSessions);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const result = checkWord(input.trim());

      switch (result.status) {
        case 'ok':
          addWord(result.word);
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

  return (
    <div>
      <h3>{session.config.name}</h3>
      <p>
        Режим:{' '}
        {session.config.mode === GameMode.LAST_LETTER
          ? 'На последнюю букву'
          : `На букву "${session.config.letter}"`}
      </p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Введите слово'
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button onClick={handleSubmit} disabled={loading}>
        Отправить
      </button>
      {loading && <div>⏳ Проверяем слово...</div>}
      {message && <div style={{ marginTop: 10 }}>{message}</div>}
      <div className={styles.wordsSummory}>
        <span>Использовано слов: {usedWords.length}</span>
        <button onClick={() => setModalOpen(true)}>Просмотреть все</button>
      </div>

      <button className={styles.exitButton} onClick={onExit}>
        Выйти из игры
      </button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title='Все введённые слова'
        maxWidth='400px'
      >
        {usedWords.length === 0 ? (
          <p>Пока нет слов</p>
        ) : (
          <ul>
            {Array.from(usedWords).map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
