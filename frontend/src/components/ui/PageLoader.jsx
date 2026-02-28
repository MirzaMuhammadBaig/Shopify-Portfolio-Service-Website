import styles from './PageLoader.module.css';
import LoadingSpinner from './LoadingSpinner';

export default function PageLoader() {
  return (
    <div className={styles.backdrop}>
      <div className={styles.scene}>
        {/* Corner bracket accents */}
        <div className={`${styles.cornerAccent} ${styles.topLeft}`} />
        <div className={`${styles.cornerAccent} ${styles.topRight}`} />
        <div className={`${styles.cornerAccent} ${styles.bottomLeft}`} />
        <div className={`${styles.cornerAccent} ${styles.bottomRight}`} />

        {/* Sparkle particles */}
        <div className={styles.sparkles}>
          <div className={`${styles.sparkle} ${styles.sparkle1}`} />
          <div className={`${styles.sparkle} ${styles.sparkle2}`} />
          <div className={`${styles.sparkle} ${styles.sparkle3}`} />
          <div className={`${styles.sparkle} ${styles.sparkle4}`} />
          <div className={`${styles.sparkle} ${styles.sparkle5}`} />
          <div className={`${styles.sparkle} ${styles.sparkle6}`} />
        </div>

        {/* Reuse the creative LoadingSpinner at large size */}
        <LoadingSpinner size={80} className={styles.noPadding} />

        {/* Progress bar + text */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
          <div className={styles.loadingText}>
            {'Loading'.split('').map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
