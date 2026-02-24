import { forwardRef, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import styles from './Input.module.css';

const Input = forwardRef(function Input(
  { label, error, type = 'text', className = '', ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      {type === 'textarea' ? (
        <textarea ref={ref} className={`${styles.input} ${styles.textarea} ${error ? styles.error : ''}`} {...props} />
      ) : (
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            className={`${styles.input} ${isPassword ? styles.hasToggle : ''} ${error ? styles.error : ''}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          )}
        </div>
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

export default Input;
