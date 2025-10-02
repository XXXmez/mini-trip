import { WordGameMode } from '../config';
import { WordGameConfigModel } from '../models';

/**
 * Преобразует конфигурацию игры в человеко-читаемое описание.
 */
export function getGameConfigDescription(config: WordGameConfigModel): string {
  switch (config.mode) {
    case WordGameMode.SINGLE_LETTER:
      return `Режим: На букву «${config.letter?.toUpperCase()}»`;

    case WordGameMode.LAST_LETTER:
      return 'Режим: Последняя буква';

    default:
      return 'Режим: Неизвестно';
  }
}
