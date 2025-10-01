import { HomePage } from 'pages/home-page';

import { gameRoutes } from './game-routes';
import { AppRouteModel } from './types';

export const appRoutes: AppRouteModel[] = [
  { path: '/', element: <HomePage /> },
  ...gameRoutes,
];
