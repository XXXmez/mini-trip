import { GameMode } from './game-mode';
import { StartLetter } from './start-letter';
import { TurnTime } from './turn-time';

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
   * Возвращает признак необходимости подсказок.
   */
  readonly hintsEnabled: boolean;
  /**
   * Возвращает время хода.
   */
  readonly turnTime: TurnTime;
}
