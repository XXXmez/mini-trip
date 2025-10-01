import {
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import { Typography } from '../typography';

import styles from './input-field.module.scss';

/**
 * Пропсы компонента {@link InputField}.
 */
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Текст метки над полем ввода.
   */
  readonly label?: string;
  /**
   * Текст-плейсхолдер внутри поля ввода.
   */
  readonly placeholder?: string;
  /**
   * Колбэк, вызываемый при нажатии клавиши Enter в поле.
   */
  readonly onEnter?: () => void;
}

/**
 * Универсальный компонент поля ввода текста.
 */
export function InputField(props: InputFieldProps) {
  const { label, placeholder, onEnter, ...rest } = props;

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    }

    if (rest.onKeyDown) {
      rest.onKeyDown(e);
    }
  };

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <Typography className={styles.label} size={'sm'}>
          {label}
        </Typography>
      )}
      <input
        className={styles.input}
        placeholder={placeholder}
        {...rest}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
