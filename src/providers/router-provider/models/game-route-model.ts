import { AppRouteModel } from 'src/providers';

export interface GameRouteModel extends AppRouteModel {
  readonly name: string;
  readonly description: string;
}
