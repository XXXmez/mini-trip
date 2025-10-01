import { SelectHTMLAttributes } from 'react';

import { Typography } from '../typography';

import styles from './select-field.module.scss';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function SelectField(props: SelectFieldProps) {
  const { label, ...rest } = props;

  return (
    <div className={styles.selectWrapper}>
      {label && (
        <Typography className={styles.label} size='sm'>
          {label}
        </Typography>
      )}
      <select className={styles.select} {...rest} />
    </div>
  );
}
