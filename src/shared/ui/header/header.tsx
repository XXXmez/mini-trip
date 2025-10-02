import { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './header.module.scss';

interface HeaderProps {
  readonly left?: ReactNode;
  readonly center?: ReactNode;
  readonly right?: ReactNode;
  readonly paddingY?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
}

export function Header(props: HeaderProps) {
  const { left, center, right, paddingY = 'medium' } = props;

  return (
    <header className={classNames(styles.header, styles[paddingY])}>
      <div className={styles.left}>{left}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.right}>{right}</div>
    </header>
  );
}
