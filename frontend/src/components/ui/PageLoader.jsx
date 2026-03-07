import styles from './PageLoader.module.css';

export default function PageLoader({ showProgress = true }) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.scene}>
        {/* Aura glow */}
        <div className={styles.aura} />

        {/* Morphing ring */}
        <div className={styles.morphRing} />

        {/* 3D Orbit 1 */}
        <div className={styles.orbit1}>
          <div className={`${styles.orbitDot} ${styles.dot1}`} />
        </div>

        {/* 3D Orbit 2 */}
        <div className={styles.orbit2}>
          <div className={`${styles.orbitDot} ${styles.dot2}`} />
        </div>

        {/* Code symbol */}
        <div className={styles.codeSymbol}>&lt;/&gt;</div>

        {/* Progress bar + text (only on initial load) */}
        {showProgress && (
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
        )}
      </div>
    </div>
  );
}
