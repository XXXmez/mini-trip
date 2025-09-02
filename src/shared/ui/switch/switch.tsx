import styles from './switch.module.scss';

interface SwitchProps {
  readonly checked: boolean;
  readonly onChange: (value: boolean) => void;
  readonly disabled?: boolean;
}

export function Switch(props: SwitchProps) {
  const { checked, onChange, disabled } = props;

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
}
