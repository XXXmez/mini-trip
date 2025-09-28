import { useEffect, useState } from 'react';

import { Modal, useLocalStorage } from 'src/shared';

import styles from './theme-modal.module.scss';

const themes = [
  { id: 'theme-light', name: 'Светлая' },
  { id: 'theme-dark', name: 'Тёмная' },
  { id: 'theme-dark-green', name: 'Тёмно-зелёная' },
];

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const [storedTheme, setStoredTheme] = useLocalStorage(
    'app-theme',
    'theme-light',
  );
  const [selected, setSelected] = useState(storedTheme);

  useEffect(() => {
    document.documentElement.className = selected;
    setStoredTheme(selected);
  }, [selected, setStoredTheme]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Выберите тему'
      maxWidth='300px'
    >
      <div className={styles.themeList}>
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`${styles.themeItem} ${
              selected === theme.id ? styles.active : ''
            }`}
            onClick={() => setSelected(theme.id)}
          >
            {theme.name}
          </div>
        ))}
      </div>
    </Modal>
  );
}
