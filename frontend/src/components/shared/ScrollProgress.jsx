import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const [isDragging, setIsDragging] = useState(false);
  const [side, setSide] = useState(() => localStorage.getItem('scrollbar-side') || 'right');
  const thumbRef = useRef(null);
  const progressRef = useRef(0);
  const dragging = useRef(false);
  const rafId = useRef(null);

  const updateThumbPosition = useCallback(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const progress = window.scrollY / docHeight;
    progressRef.current = progress;
    const trackHeight = window.innerHeight - 80;
    const y = 40 + progress * (trackHeight - 48);
    thumb.style.transform = `translateY(${y}px)`;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateThumbPosition);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateThumbPosition();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateThumbPosition]);

  const scrollToPosition = useCallback((clientY) => {
    const viewH = window.innerHeight;
    const trackHeight = viewH - 80;
    const ratio = Math.max(0, Math.min(1, (clientY - 40) / trackHeight));
    const docHeight = document.documentElement.scrollHeight - viewH;
    window.scrollTo({ top: ratio * docHeight, behavior: 'instant' });
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    scrollToPosition(e.clientY);

    const onMove = (ev) => scrollToPosition(ev.clientY);
    const onUp = () => {
      dragging.current = false;
      setIsDragging(false);
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [scrollToPosition]);

  const toggleSide = useCallback(() => {
    setSide((prev) => {
      const next = prev === 'right' ? 'left' : 'right';
      localStorage.setItem('scrollbar-side', next);
      return next;
    });
  }, []);

  return (
    <div
      ref={thumbRef}
      className={`${styles.thumb} ${isDragging ? styles.dragging : ''} ${side === 'left' ? styles.left : ''}`}
      onPointerDown={handlePointerDown}
      onDoubleClick={toggleSide}
    />
  );
}
