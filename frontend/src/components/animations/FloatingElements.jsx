import { memo } from 'react';
import styles from './FloatingElements.module.css';

// Rewritten: 36 framer-motion JS animations → 12 pure CSS elements.
// CSS animations use GPU-composited properties (transform + opacity) with zero JS overhead.

function FloatingElements() {
  return (
    <div className={styles.container} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />

      <div className={`${styles.dot} ${styles.dot1}`} />
      <div className={`${styles.dot} ${styles.dot2}`} />
      <div className={`${styles.dot} ${styles.dot3}`} />
      <div className={`${styles.dot} ${styles.dot4}`} />
      <div className={`${styles.dot} ${styles.dot5}`} />

      <div className={`${styles.ring} ${styles.ring1}`} />
      <div className={`${styles.ring} ${styles.ring2}`} />

      <div className={`${styles.line} ${styles.line1}`} />
      <div className={`${styles.line} ${styles.line2}`} />
    </div>
  );
}

export default memo(FloatingElements);
