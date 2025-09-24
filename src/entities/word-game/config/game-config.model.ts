import { GameMode } from 'src/entities/word-game/config/game-mode.ts';
import { StartLetter } from 'src/entities/word-game/config/start-letter.ts';
import { TurnTime } from 'src/entities/word-game/config/turn-time.ts';

/**
 * Представляет модель конфигурирования игры в слова.
 */
export interface GameConfigModel {
  /**
   * Возвращает наименование игры.
   */
  readonly name: string;
  /**
   * Возвращает режим игры.
   */
  readonly mode: GameMode;
  /**
   * Возвращает букву хода для режима игры SINGLE_LETTER.
   */
  readonly letter?: StartLetter;
  /**
   * Возвращает признак необходимости проверки слов.
   */
  readonly checkWords: boolean;
  /**
   * Возвращает время хода.
   */
  readonly turnTime: TurnTime;
}
