import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 48, className = '' }) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.spinner} style={{ width: size, height: size }}>
        {/* Outer glow ring */}
        <div className={styles.glowRing} />

        {/* 3 arcs rotating in different directions */}
        <div className={styles.arcOuter}>
          <div className={`${styles.orbitDot} ${styles.dot1}`} />
        </div>
        <div className={styles.arcMiddle}>
          <div className={`${styles.orbitDot} ${styles.dot2}`} />
        </div>
        <div className={styles.arcInner} />

        {/* Center pulsing core */}
        <div className={styles.core} />
      </div>
    </div>
  );
}
