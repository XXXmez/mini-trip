import { WordGameMode, WordGameStartLetter, WordGameTurnTime } from '../config';

/**
 * Представляет модель конфигурирования игры в слова.
 */
export interface WordGameConfigModel {
  /**
   * Возвращает наименование игры.
   */
  readonly name: string;
  /**
   * Возвращает режим игры.
   */
  readonly mode: WordGameMode;
  /**
   * Возвращает букву хода для режима игры SINGLE_LETTER.
   */
  readonly letter?: WordGameStartLetter;
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
  readonly turnTime: WordGameTurnTime;
}
