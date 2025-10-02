import { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './icon-button.module.scss';

/**
 * Представляет модель пропсов компонента кнопки иконки.
 */
export interface IconButtonProps {
  /**
   * Возвращает иконку.
   */
  readonly icon: ReactNode;
  /**
   * Возвращает метод обработки клика.
   */
  readonly onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Возвращает состояние блокировки кнопки.
   */
  readonly disabled?: boolean;
  /**
   * Возвращает наименование класса для стилизации.
   */
  readonly className?: string;
  /**
   * Возвращает размер кнопки: большой, маленький или средний.
   */
  readonly size?: 'xxsmall' | 'xsmall' | 'tiny' | 'small' | 'medium' | 'large';
}

/**
 * Представляет компонент кнопки иконки.
 */
export function IconButton(props: IconButtonProps) {
  const { icon, onClick, disabled = false, className, size = 'small' } = props;

  const buttonClassName = classNames(styles.iconButton, className, {
    [styles.xxsmall]: size === 'xxsmall',
    [styles.xsmall]: size === 'xsmall',
    [styles.tiny]: size === 'tiny',
    [styles.small]: size === 'small',
    [styles.medium]: size === 'medium',
    [styles.large]: size === 'large',
    [styles.disabled]: disabled,
  });

  return (
    <button className={buttonClassName} onClick={onClick} disabled={disabled}>
      {icon}
    </button>
  );
}
