import { GameMode } from 'src/entities/word-game/config/game-mode.ts';
import { StartLetter } from 'src/entities/word-game/config/start-letter.ts';
import { TurnTime } from 'src/entities/word-game/config/turn-time.ts';

export interface GameConfigModel {
  readonly name: string; // название игры
  readonly mode: GameMode; // режим игры
  readonly letter?: StartLetter; // если режим SINGLE_LETTER
  readonly checkWords: boolean; // нужна ли проверка слов
  readonly turnTime: TurnTime; // время хода
}
