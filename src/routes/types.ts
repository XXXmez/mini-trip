export interface AppRouteModel {
  readonly path: string;
  readonly element: JSX.Element;
  readonly children?: AppRouteModel[];
}

export interface GameRouteModel extends AppRouteModel {
  readonly name: string;
  readonly description: string;
}
