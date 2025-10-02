import { useState } from 'react';
import { GameSessionModel } from 'entities/word-game';
import { SessionList, WordGameConfiguration, WordGameContent } from 'features';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'shared/assets';
import { useLocalStorage } from 'shared/lib';
import { Header, IconButton } from 'shared/ui';

import styles from './word-game-page.module.scss';

const keyGame = 'word-game-sessions';

enum GameScreen {
  LIST = 'list',
  CONFIG = 'config',
  GAME = 'game',
}

export function WordGamePage() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useLocalStorage<GameSessionModel[]>(
    keyGame,
    [],
  );

  const [screen, setScreen] = useState<GameScreen>(GameScreen.LIST);
  const [activeSession, setActiveSession] = useState<GameSessionModel | null>(
    null,
  );

  const handleNewGame = () => {
    setScreen(GameScreen.CONFIG);
  };

  const handleSelectSession = (session: GameSessionModel) => {
    setActiveSession(session);
    setScreen(GameScreen.GAME);
  };

  function onNavigateBack() {
    if (screen === GameScreen.LIST) {
      navigate('/');
    }
    if (screen === GameScreen.CONFIG) {
      setScreen(GameScreen.LIST);
    }
    if (screen === GameScreen.GAME) {
      setScreen(GameScreen.LIST);
    }
  }

  const handleDelete = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
  };

  const handleAddWord = (sessionId: string, word: string) => {
    const updated = sessions.map((s) =>
      s.id === sessionId
        ? {
            ...s,
            usedWords: [...s.usedWords, word],
            updatedAt: new Date().toISOString(),
          }
        : s,
    );
    setSessions(updated);
    setActiveSession(updated.find((s) => s.id === sessionId) ?? null);
  };

  const handleFinish = (sessionId: string) => {
    const updated = sessions.map((s) =>
      s.id === sessionId
        ? { ...s, isFinished: true, updatedAt: new Date().toISOString() }
        : s,
    );
    setSessions(updated);
    setScreen(GameScreen.LIST);
  };

  return (
    <div className={styles.wordGamePage}>
      <Header
        paddingY={'xlarge'}
        left={
          <IconButton
            icon={<ChevronLeftIcon />}
            size={'xsmall'}
            onClick={onNavigateBack}
          />
        }
        center={<h2 className={styles.title}>Словесная дуэль</h2>}
      />
      <div className={styles.content}>
        {screen === GameScreen.LIST && (
          <SessionList
            sessions={sessions}
            onNewGame={handleNewGame}
            onSelect={handleSelectSession}
            onDelete={handleDelete}
          />
        )}

        {screen === GameScreen.CONFIG && (
          <WordGameConfiguration
            sessions={sessions}
            onSave={(session) => {
              setSessions([...sessions, session]);
              setActiveSession(session);
              setScreen(GameScreen.GAME);
            }}
          />
        )}

        {screen === GameScreen.GAME && activeSession && (
          <WordGameContent
            session={activeSession}
            onExit={() => setScreen(GameScreen.LIST)}
            onAddWord={handleAddWord}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
