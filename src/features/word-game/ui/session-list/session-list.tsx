import { GameSessionModel } from 'src/entities/word-game/config';
import {
  getGameConfigDescription,
  getTurnTimeDescription,
} from 'src/pages/word-game-page/ui/word-game-page.tsx';
import { Button, ChevronDownIcon, DeleteIcon, IconButton } from 'src/shared';
import { Header } from 'src/shared/ui/header';
import { Typography } from 'src/shared/ui/typography';

import styles from './session-list.module.scss';

interface SessionListProps {
  readonly sessions: GameSessionModel[];
  readonly onNewGame: () => void;
  readonly onSelect: (session: GameSessionModel) => void;
  readonly onDelete: (id: string) => void;
}

export function SessionList(props: SessionListProps) {
  const { sessions, onNewGame, onSelect, onDelete } = props;

  return (
    <div className={styles.sessionList}>
      <Button onClick={onNewGame} className={styles.newGameBtn}>
        Новая игра
      </Button>

      <Header
        left={<span className={styles.saveTitle}>Сохранения</span>}
        right={
          <div className={styles.sorting}>
            <span className={styles.sortTitle}>Сортировка</span>
            <IconButton icon={<ChevronDownIcon />} size={'xsmall'} />
          </div>
        }
      />

      {sessions.length === 0 ? (
        <Typography size={'lg'}>Вы ещё не начинали игры</Typography>
      ) : (
        <div className={styles.sessions}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={styles.session}
              onClick={() => {
                if (!session.isFinished) {
                  onSelect(session);
                }
              }}
              style={{
                backgroundColor: session.isFinished ? '#ed8080' : undefined,
              }}
            >
              <div className={styles.sessionInfo}>
                <Typography size='sm' className={styles.sessionInfoName}>
                  {session.config.name}
                </Typography>
                <Typography size='sm'>
                  {new Date(session.updatedAt).toLocaleString()}
                </Typography>
                <div className={styles.sessionInfoRaw}>
                  <Typography size='xs'>
                    Слов {session.usedWords.length}
                  </Typography>
                  <Typography size='xs'>
                    {getGameConfigDescription(session.config)}
                  </Typography>
                </div>
                <Typography size='xs'>
                  Время хода: {getTurnTimeDescription(session.config.turnTime)}
                </Typography>
              </div>

              <div className={styles.sessionAction}>
                <IconButton
                  icon={<DeleteIcon />}
                  size='xsmall'
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
