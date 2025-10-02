/**
 * Перечисляет варианты ограничения времени на ход.
 */
export enum WordGameTurnTime {
  UNLIMITED = 'unlimited',
  SEC_30 = '30',
  SEC_60 = '60',
  MIN_2 = '120',
}

export const TurnTimeLabels: Record<WordGameTurnTime, string> = {
  [WordGameTurnTime.UNLIMITED]: 'Неограниченно',
  [WordGameTurnTime.SEC_30]: '30 секунд',
  [WordGameTurnTime.SEC_60]: '60 секунд',
  [WordGameTurnTime.MIN_2]: '2 минуты',
};
