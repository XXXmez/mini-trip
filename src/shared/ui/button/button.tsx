import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './button.module.scss';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly size?: ButtonSize;
  readonly variant?: ButtonVariant;
  readonly width?: string;
}

export function Button(props: ButtonProps) {
  const {
    size = 'md',
    variant = 'primary',
    className,
    children,
    width,
    style,
    ...rest
  } = props;

  return (
    <button
      className={classNames(
        styles.button,
        styles[size],
        styles[variant],
        className,
      )}
      style={{ width, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
