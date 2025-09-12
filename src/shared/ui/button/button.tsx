import { ButtonHTMLAttributes, FC } from 'react';
import classNames from 'classnames';

import styles from './button.module.scss';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const Button: FC<ButtonProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[size],
        styles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
