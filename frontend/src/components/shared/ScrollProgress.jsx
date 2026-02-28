import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const thumbRef = useRef(null);
  const dragging = useRef(false);
  const hideTimer = useRef(null);

  const show = useCallback(() => {
    setVisible(true);
    clearTimeout(hideTimer.current);
  }, []);

  const hideAfterDelay = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!dragging.current) setVisible(false);
    }, 1200);
  }, []);

  const updateProgress = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      setProgress(0);
      setVisible(false);
      return;
    }
    setProgress(window.scrollY / docHeight);
    show();
    hideAfterDelay();
  }, [show, hideAfterDelay]);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  const scrollToPosition = useCallback((clientY) => {
    const viewH = window.innerHeight;
    const ratio = Math.max(0, Math.min(1, (clientY - 40) / (viewH - 80)));
    const docHeight = document.documentElement.scrollHeight - viewH;
    window.scrollTo({ top: ratio * docHeight });
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    show();
    document.body.style.userSelect = 'none';

    const onMove = (ev) => {
      scrollToPosition(ev.clientY);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      hideAfterDelay();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [scrollToPosition, show, hideAfterDelay]);

  // Position: thumb moves within viewport with 40px padding top/bottom
  const thumbTop = 40 + progress * (window.innerHeight - 80 - 36);

  return (
    <div
      ref={thumbRef}
      className={`${styles.thumb} ${visible || hovered ? styles.visible : ''} ${dragging.current ? styles.dragging : ''}`}
      style={{ top: `${thumbTop}px` }}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => { setHovered(true); show(); }}
      onPointerLeave={() => { setHovered(false); hideAfterDelay(); }}
    />
  );
}
