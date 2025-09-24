import { GameConfigModel } from 'src/entities/word-game/config/game-config.model.ts';

export interface GameSessionModel {
  /**
   * Возвращает идентификатор игры.
   */
  readonly id: string;
  /**
   * Возвращает настройку игры.
   */
  readonly config: GameConfigModel;
  /**
   * Возвращает использованые в игре слова.
   */
  readonly usedWords: string[];
  /**
   * Возвращает время создания игры.
   */
  readonly createdAt: string;
  /**
   * Возвращает время обновления игры.
   */
  readonly updatedAt: string;
  /**
   * Возвращает признак окончания игры.
   */
  readonly isFinished: boolean;
}
