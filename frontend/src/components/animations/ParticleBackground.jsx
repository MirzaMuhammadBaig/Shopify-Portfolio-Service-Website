import { useCallback, useState, useEffect, memo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const PARTICLE_CONFIG = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 30,
  particles: {
    color: { value: ['#6C63FF', '#00D9FF', '#FF6B6B'] },
    links: {
      color: '#6C63FF',
      distance: 150,
      enable: true,
      opacity: 0.15,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'bounce' },
    },
    number: { density: { enable: true, area: 1200 }, value: 25 },
    opacity: { value: { min: 0.1, max: 0.35 } },
    size: { value: { min: 1, max: 2.5 } },
  },
  detectRetina: true,
};

function ParticleBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Skip particles on mobile — hero still has floating CSS elements
  if (isMobile) return null;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={PARTICLE_CONFIG}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default memo(ParticleBackground);
