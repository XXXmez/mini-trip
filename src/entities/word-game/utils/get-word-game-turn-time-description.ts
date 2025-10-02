import { TurnTimeLabels, WordGameTurnTime } from '../config';

/**
 * Преобразует ограничение времени в человеко-читаемое описание.
 */
export function getWordGameTurnTimeDescription(
  turnTime: WordGameTurnTime,
): string {
  return `${TurnTimeLabels[turnTime]}`;
}
