import { useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T>(() => {
    const raw = localStorage.getItem(key);

    if (raw) {
      return JSON.parse(raw) as T;
    }

    return defaultValue;
  });

  const save = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    setData(value);
  };

  return [data, save] as const;
}
