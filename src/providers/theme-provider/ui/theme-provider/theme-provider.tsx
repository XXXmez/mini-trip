import { ChildrenProps } from 'shared';

import { useThemeInitializer } from '../../hooks';

type ThemeProviderProps = ChildrenProps;

export function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;

  useThemeInitializer();

  return <>{children}</>;
}
