import { useThemeInitializer } from 'src/providers';
import { ChildrenProps } from 'src/shared';

type ThemeProviderProps = ChildrenProps;

export function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;

  useThemeInitializer();

  return <>{children}</>;
}
