import classNames from 'classnames';

import { ChildrenProps } from '../../models';

import styles from './typography.module.scss';

export type TextSize =
  | 'xs' // 12px
  | 'sm' // 14px
  | 'md' // 16px
  | 'lg' // 20px
  | 'xl' // 24px
  | 'xl2' // 28px
  | 'xl3' // 32px
  | 'xl4' // 36px
  | 'xl5' // 40px
  | 'xl6'; // 48px

export type TextWeight = 'normal' | 'medium' | 'bold';
export type As = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TypographyProps extends ChildrenProps {
  readonly size?: TextSize;
  readonly className?: string;
  readonly weight?: TextWeight;
  readonly color?: string;
  readonly as?: As;
}

export function Typography(props: TypographyProps) {
  const {
    children,
    size = 'md',
    weight = 'normal',
    className,
    color,
    as: Component = 'span',
  } = props;

  return (
    <Component
      className={classNames(
        styles.text,
        styles[size],
        styles[weight],
        className,
      )}
      style={color ? { color } : undefined}
    >
      {children}
    </Component>
  );
}
