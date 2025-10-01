import { GameConfigModel, GameMode } from '../config';

/**
 * Преобразует конфигурацию игры в человеко-читаемое описание.
 */
export function getGameConfigDescription(config: GameConfigModel): string {
  switch (config.mode) {
    case GameMode.SINGLE_LETTER:
      return `Режим: На букву «${config.letter?.toUpperCase()}»`;

    case GameMode.LAST_LETTER:
      return 'Режим: Последняя буква';

    default:
      return 'Режим: Неизвестно';
  }
}
