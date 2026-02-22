import { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(function Input(
  { label, error, type = 'text', className = '', ...props },
  ref
) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      {type === 'textarea' ? (
        <textarea ref={ref} className={`${styles.input} ${styles.textarea} ${error ? styles.error : ''}`} {...props} />
      ) : (
        <input ref={ref} type={type} className={`${styles.input} ${error ? styles.error : ''}`} {...props} />
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

export default Input;
