import styles from './word-game-configuration.module.scss';
import React, { useState } from 'react';
import {
  GameConfigModel,
  GameMode,
  GameSessionModel,
  StartLetter,
  TurnTime,
  TurnTimeLabels,
} from 'src/entities/word-game/config';
import { InputField } from 'src/shared/ui/input-field/input-field.tsx';
import { SelectField } from 'src/shared/ui/select-field/select-field.tsx';
import { LetterGrid } from 'src/shared/ui/letter-grid';
import { Switch } from 'src/shared/ui/switch';
import { Typography } from 'src/shared';

interface WordGameConfigurationProps {
  readonly sessions: GameSessionModel[];
  readonly onSave: (session: GameSessionModel) => void;
}

export function WordGameConfiguration(props: WordGameConfigurationProps) {
  const { sessions, onSave } = props;

  const defaultGameName = `Игра №${sessions.length + 1}`;

  const [name, setName] = useState(defaultGameName);
  const [mode, setMode] = useState<GameMode>(GameMode.LAST_LETTER);
  const [turnTime, setTurnTime] = useState<TurnTime>(TurnTime.UNLIMITED);
  const [letter, setLetter] = useState<StartLetter>(StartLetter.A);
  const [checkWords, setCheckWords] = useState(false);
  const [isRandomLetter, setIsRandomLetter] = useState(false);

  const handleSave = () => {
    const isSingleLetterMode = mode === GameMode.SINGLE_LETTER;

    const startLetter = isSingleLetterMode
      ? isRandomLetter
        ? getRandomStartLetter()
        : letter
      : undefined;

    const config = {
      mode,
      name: name || defaultGameName,
      letter: startLetter,
      checkWords,
      turnTime,
    } satisfies GameConfigModel;

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
        onChange={(e) => setMode(e.target.value as GameMode)}
      >
        <option value={GameMode.LAST_LETTER}>Последняя буква</option>
        <option value={GameMode.SINGLE_LETTER}>Одна буква</option>
      </SelectField>
      {mode === GameMode.SINGLE_LETTER && (
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
        onChange={(e) => setTurnTime(e.target.value as TurnTime)}
      >
        {Object.values(TurnTime).map((value) => (
          <option key={value} value={value}>
            {TurnTimeLabels[value]}
          </option>
        ))}
      </SelectField>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Switch checked={checkWords} onChange={setCheckWords} />
        <Typography>Проверять слова</Typography>
      </div>
      <button onClick={handleSave} className={styles.button}>
        <Typography>Начать игру</Typography>
      </button>
    </div>
  );
}

/**
 * Возвращает случайную букву из перечисления StartLetter.
 */
export function getRandomStartLetter(): StartLetter {
  const values = Object.values(StartLetter);
  const index = Math.floor(Math.random() * values.length);
  return values[index];
}
