import { useEffect } from 'react';

export function useThemeInitializer() {
  useEffect(() => {
    const theme = localStorage.getItem('app-theme');

    document.documentElement.className = theme
      ? (JSON.parse(theme) as string)
      : 'theme-light';
  }, []);
}
