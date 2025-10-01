import { CarNumbersGamePage } from 'pages/car-numbers-game-page';
import { WordGamePage } from 'pages/word-game-page';

import { GameRouteModel } from './types';

export const gameRoutes: GameRouteModel[] = [
  {
    path: '/word-game',
    element: <WordGamePage />,
    name: 'Словесная дуэль',
    description:
      'Добавляй слова одно за другим и проверяй, насколько длинной получится цепочка.',
  },
  {
    path: '/car-numbers-game',
    element: <CarNumbersGamePage />,
    name: 'Охота за номерами',
    description: 'Охоться за номерами от 001 до 999 и не упусти ни одного!',
  },
] as const satisfies GameRouteModel[];
