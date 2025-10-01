import { InputHTMLAttributes } from 'react';

import { Typography } from '../typography';

import styles from './input-field.module.scss';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
}

export function InputField(props: InputFieldProps) {
  const { label, placeholder, ...rest } = props;

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <Typography className={styles.label} size={'sm'}>
          {label}
        </Typography>
      )}
      <input className={styles.input} placeholder={placeholder} {...rest} />
    </div>
  );
}
