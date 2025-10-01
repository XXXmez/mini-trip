/**
 * Перечисляет варианты ограничения времени на ход.
 */
export enum TurnTime {
  UNLIMITED = 'unlimited',
  SEC_30 = '30',
  SEC_60 = '60',
  MIN_2 = '120',
}

export const TurnTimeLabels: Record<TurnTime, string> = {
  [TurnTime.UNLIMITED]: 'Неограниченно',
  [TurnTime.SEC_30]: '30 секунд',
  [TurnTime.SEC_60]: '60 секунд',
  [TurnTime.MIN_2]: '2 минуты',
};

/**
 * Преобразует ограничение времени в человеко-читаемое описание.
 */
export function getTurnTimeDescription(turnTime: TurnTime): string {
  return `${TurnTimeLabels[turnTime]}`;
}
