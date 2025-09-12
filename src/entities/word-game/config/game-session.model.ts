import { GameConfigModel } from 'src/entities/word-game/config/game-config.model.ts';

export interface GameSessionModel {
  readonly id: string;
  readonly config: GameConfigModel;
  readonly usedWords: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly isFinished: boolean;
}
