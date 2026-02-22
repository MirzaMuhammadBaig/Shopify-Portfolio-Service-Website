import styles from './Badge.module.css';

const VARIANTS = {
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
  neutral: styles.neutral,
};

export default function Badge({ children, variant = 'primary', className = '' }) {
  return (
    <span className={`${styles.badge} ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}
