import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const hideTimer = useRef(null);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      setProgress(0);
      setVisible(false);
      return;
    }
    setProgress(scrollTop / docHeight);
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!dragging.current) setVisible(false);
    }, 1500);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  const scrollToPosition = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ratio * docHeight });
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    setVisible(true);
    clearTimeout(hideTimer.current);
    scrollToPosition(e.clientY);
    document.body.style.userSelect = 'none';

    const onMove = (ev) => scrollToPosition(ev.clientY);
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      hideTimer.current = setTimeout(() => setVisible(false), 1500);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [scrollToPosition]);

  const thumbHeight = Math.max(24, (window.innerHeight / document.documentElement.scrollHeight) * 100);
  const thumbTop = progress * (100 - thumbHeight);

  return (
    <div
      ref={trackRef}
      className={`${styles.track} ${visible ? styles.visible : ''}`}
      onPointerDown={handlePointerDown}
    >
      <div className={styles.fill} style={{ height: `${progress * 100}%` }} />
      <div
        className={styles.thumb}
        style={{ top: `${thumbTop}%`, height: `${thumbHeight}%` }}
      />
    </div>
  );
}
