import { FC } from 'react';
import styles from './switch.module.scss';

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Switch: FC<SwitchProps> = ({ checked, onChange, disabled }) => {
  return (
    <button
      type='button'
      className={`${styles.switch} ${checked ? styles.checked : ''} ${
        disabled ? styles.disabled : ''
      }`}
      onClick={() => !disabled && onChange(!checked)}
      aria-pressed={checked}
    >
      <span className={styles.thumb} />
    </button>
  );
};
