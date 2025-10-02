import { useState } from 'react';
import {
  GameSessionModel,
  getWordGameRandomStartLetter,
  TurnTimeLabels,
  WordGameConfigModel,
  WordGameMode,
  WordGameStartLetter,
  WordGameTurnTime,
} from 'entities';
import { InputField, SelectField, Switch, Typography } from 'shared';

import { LetterGrid } from '../letter-grid';

import styles from './word-game-configuration.module.scss';

/**
 * Представляет пропсы компонента конфигурации игры в слова.
 */
interface WordGameConfigurationProps {
  /**
   * Возвращает игровые сессии.
   */
  readonly sessions: GameSessionModel[];
  /**
   * Возвращает колбэк для сохранения конфигурации.
   */
  readonly onSave: (session: GameSessionModel) => void;
}

/**
 * Представляет компонент конфигурации игры в слова.
 */
export function WordGameConfiguration(props: WordGameConfigurationProps) {
  const { sessions, onSave } = props;

  const defaultGameName = `Игра №${sessions.length + 1}`;

  const [name, setName] = useState(defaultGameName);
  const [mode, setMode] = useState<WordGameMode>(WordGameMode.LAST_LETTER);
  const [turnTime, setTurnTime] = useState<WordGameTurnTime>(
    WordGameTurnTime.UNLIMITED,
  );
  const [letter, setLetter] = useState<WordGameStartLetter>(
    WordGameStartLetter.A,
  );
  const [checkWords, setCheckWords] = useState(false);
  const [isRandomLetter, setIsRandomLetter] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(false);

  const handleSave = () => {
    const isSingleLetterMode = mode === WordGameMode.SINGLE_LETTER;

    const startLetter = isSingleLetterMode
      ? isRandomLetter
        ? getWordGameRandomStartLetter()
        : letter
      : undefined;

    const config = {
      mode,
      name: name || defaultGameName,
      letter: startLetter,
      checkWords,
      hintsEnabled,
      turnTime,
    } satisfies WordGameConfigModel;

    const session: GameSessionModel = {
      id: Math.random().toString(36).slice(2) + Date.now(),
      config: config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usedWords: [],
      isFinished: false,
    };
    onSave(session);
  };

  return (
    <div className={styles.form}>
      <InputField
        label='Название игры'
        placeholder='Введите название'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <SelectField
        label='Выберите режим'
        value={mode}
        onChange={(e) => setMode(e.target.value as WordGameMode)}
      >
        <option value={WordGameMode.LAST_LETTER}>Последняя буква</option>
        <option value={WordGameMode.SINGLE_LETTER}>Одна буква</option>
      </SelectField>
      {mode === WordGameMode.SINGLE_LETTER && (
        <>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Switch checked={isRandomLetter} onChange={setIsRandomLetter} />
            <Typography>Использовать случайную букву</Typography>
          </div>
          <LetterGrid
            value={letter}
            onChange={setLetter}
            disabled={isRandomLetter}
          />
        </>
      )}
      <SelectField
        label='Время хода'
        value={turnTime}
        onChange={(e) => setTurnTime(e.target.value as WordGameTurnTime)}
      >
        {Object.values(WordGameTurnTime).map((value) => (
          <option key={value} value={value}>
            {TurnTimeLabels[value]}
          </option>
        ))}
      </SelectField>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Switch checked={checkWords} onChange={setCheckWords} />
        <Typography>Проверять слова</Typography>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Switch checked={hintsEnabled} onChange={setHintsEnabled} />
        <Typography>Подсказки</Typography>
      </div>
      <button onClick={handleSave} className={styles.button}>
        <Typography>Начать игру</Typography>
      </button>
    </div>
  );
}
