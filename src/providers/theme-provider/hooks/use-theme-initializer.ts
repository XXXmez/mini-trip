import { useEffect } from 'react';

export function useThemeInitializer() {
  useEffect(() => {
    const theme = localStorage.getItem('app-theme');

    console.log('theme', theme);

    document.documentElement.className = theme
      ? (JSON.parse(theme) as string)
      : 'theme-light';
  }, []);
}
