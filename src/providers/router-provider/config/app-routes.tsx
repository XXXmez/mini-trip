import { HomePage } from 'src/pages';
import { AppRouteModel } from 'src/providers';

import { gameRoutes } from './game-routes';

export const appRoutes: AppRouteModel[] = [
  { path: '/', element: <HomePage /> },
  ...gameRoutes,
];
