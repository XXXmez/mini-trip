export interface AppRouteModel {
  readonly path: string;
  readonly element: JSX.Element;
  readonly children?: AppRouteModel[];
}
