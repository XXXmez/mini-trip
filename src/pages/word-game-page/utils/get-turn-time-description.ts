import { TurnTime, TurnTimeLabels } from 'src/entities/word-game';

/**
 * Преобразует ограничение времени в человеко-читаемое описание.
 */
export function getTurnTimeDescription(turnTime: TurnTime): string {
  return `${TurnTimeLabels[turnTime]}`;
}
