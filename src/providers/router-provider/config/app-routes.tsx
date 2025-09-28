import { HomePage, WordGamePage } from 'src/pages';
import { AppRouteModel } from 'src/providers';

export const appRoutes: AppRouteModel[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/word-game',
    element: <WordGamePage />,
  },
] as const satisfies AppRouteModel[];
