import { motion } from 'framer-motion';

const ORBS = [
  { size: 350, x: '5%', y: '15%', color: 'rgba(108, 99, 255, 0.1)', delay: 0 },
  { size: 250, x: '80%', y: '8%', color: 'rgba(0, 217, 255, 0.07)', delay: 2 },
  { size: 300, x: '65%', y: '55%', color: 'rgba(255, 107, 107, 0.06)', delay: 4 },
  { size: 220, x: '15%', y: '65%', color: 'rgba(108, 99, 255, 0.07)', delay: 1 },
  { size: 180, x: '45%', y: '35%', color: 'rgba(0, 217, 255, 0.05)', delay: 3 },
  { size: 280, x: '90%', y: '70%', color: 'rgba(108, 99, 255, 0.06)', delay: 5 },
  { size: 160, x: '35%', y: '80%', color: 'rgba(0, 217, 255, 0.05)', delay: 2 },
];

const DOTS = [
  { size: 4, x: '12%', y: '18%', color: '#6C63FF', duration: 12, delay: 0 },
  { size: 3, x: '88%', y: '22%', color: '#00D9FF', duration: 15, delay: 1 },
  { size: 5, x: '72%', y: '78%', color: '#6C63FF', duration: 18, delay: 2 },
  { size: 3, x: '28%', y: '82%', color: '#00D9FF', duration: 14, delay: 3 },
  { size: 4, x: '92%', y: '48%', color: '#FF6B6B', duration: 16, delay: 1 },
  { size: 3, x: '8%', y: '42%', color: '#6C63FF', duration: 20, delay: 4 },
  { size: 5, x: '48%', y: '12%', color: '#00D9FF', duration: 13, delay: 2 },
  { size: 3, x: '62%', y: '88%', color: '#6C63FF', duration: 17, delay: 5 },
  { size: 4, x: '35%', y: '55%', color: '#00D9FF', duration: 19, delay: 3 },
  { size: 3, x: '78%', y: '32%', color: '#FF6B6B', duration: 15, delay: 6 },
  { size: 4, x: '18%', y: '92%', color: '#6C63FF', duration: 21, delay: 1 },
  { size: 3, x: '55%', y: '5%', color: '#00D9FF', duration: 16, delay: 4 },
  { size: 5, x: '42%', y: '68%', color: '#6C63FF', duration: 14, delay: 2 },
  { size: 3, x: '95%', y: '15%', color: '#00D9FF', duration: 18, delay: 7 },
];

const RINGS = [
  { size: 30, x: '20%', y: '30%', color: 'rgba(108, 99, 255, 0.15)', duration: 25, delay: 0 },
  { size: 20, x: '75%', y: '20%', color: 'rgba(0, 217, 255, 0.12)', duration: 22, delay: 3 },
  { size: 25, x: '85%', y: '65%', color: 'rgba(108, 99, 255, 0.1)', duration: 28, delay: 1 },
  { size: 18, x: '10%', y: '75%', color: 'rgba(0, 217, 255, 0.12)', duration: 24, delay: 5 },
  { size: 22, x: '50%', y: '50%', color: 'rgba(255, 107, 107, 0.08)', duration: 26, delay: 2 },
];

const LINES = [
  { width: 40, x: '25%', y: '20%', angle: 45, color: 'rgba(108, 99, 255, 0.15)', duration: 18, delay: 0 },
  { width: 30, x: '70%', y: '35%', angle: -30, color: 'rgba(0, 217, 255, 0.12)', duration: 20, delay: 2 },
  { width: 50, x: '15%', y: '60%', angle: 60, color: 'rgba(108, 99, 255, 0.1)', duration: 22, delay: 4 },
  { width: 35, x: '82%', y: '80%', angle: -45, color: 'rgba(0, 217, 255, 0.1)', duration: 19, delay: 1 },
  { width: 25, x: '55%', y: '15%', angle: 30, color: 'rgba(255, 107, 107, 0.08)', duration: 24, delay: 3 },
  { width: 45, x: '40%', y: '90%', angle: -60, color: 'rgba(108, 99, 255, 0.08)', duration: 21, delay: 5 },
];

const CROSSES = [
  { size: 14, x: '30%', y: '25%', color: 'rgba(108, 99, 255, 0.2)', duration: 20, delay: 1 },
  { size: 10, x: '68%', y: '42%', color: 'rgba(0, 217, 255, 0.18)', duration: 18, delay: 3 },
  { size: 12, x: '15%', y: '55%', color: 'rgba(108, 99, 255, 0.15)', duration: 22, delay: 0 },
  { size: 8, x: '85%', y: '88%', color: 'rgba(0, 217, 255, 0.15)', duration: 16, delay: 5 },
];

export default function FloatingElements() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Gradient orbs */}
      {ORBS.map((el, i) => (
        <motion.div
          key={`orb-${i}`}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 20, 0, -20, 0],
            scale: [1, 1.15, 1, 0.85, 1],
          }}
          transition={{ duration: 25 + i * 3, repeat: Infinity, delay: el.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: el.x, top: el.y,
            width: el.size, height: el.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${el.color}, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      ))}

      {/* Floating dots with pulse */}
      {DOTS.map((dot, i) => (
        <motion.div
          key={`dot-${i}`}
          animate={{
            y: [0, -50, 20, -30, 0],
            x: [0, 25, -15, 30, 0],
            scale: [1, 1.5, 0.8, 1.3, 1],
            opacity: [0.2, 0.6, 0.15, 0.5, 0.2],
          }}
          transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: dot.x, top: dot.y,
            width: dot.size, height: dot.size, borderRadius: '50%',
            background: dot.color,
            boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
          }}
        />
      ))}

      {/* Rotating rings */}
      {RINGS.map((ring, i) => (
        <motion.div
          key={`ring-${i}`}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            rotate: [0, 360],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{ duration: ring.duration, repeat: Infinity, delay: ring.delay, ease: 'linear' }}
          style={{
            position: 'absolute', left: ring.x, top: ring.y,
            width: ring.size, height: ring.size, borderRadius: '50%',
            border: `1.5px solid ${ring.color}`,
            background: 'transparent',
          }}
        />
      ))}

      {/* Floating lines */}
      {LINES.map((line, i) => (
        <motion.div
          key={`line-${i}`}
          animate={{
            y: [0, -25, 10, -15, 0],
            x: [0, 10, -8, 12, 0],
            opacity: [0.15, 0.4, 0.1, 0.35, 0.15],
            rotate: [line.angle, line.angle + 15, line.angle - 10, line.angle + 5, line.angle],
          }}
          transition={{ duration: line.duration, repeat: Infinity, delay: line.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: line.x, top: line.y,
            width: line.width, height: 1.5,
            background: `linear-gradient(90deg, transparent, ${line.color}, transparent)`,
            transform: `rotate(${line.angle}deg)`,
          }}
        />
      ))}

      {/* Floating crosses */}
      {CROSSES.map((cross, i) => (
        <motion.div
          key={`cross-${i}`}
          animate={{
            y: [0, -30, 15, -20, 0],
            x: [0, 20, -10, 15, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.15, 0.35, 0.1, 0.3, 0.15],
          }}
          transition={{ duration: cross.duration, repeat: Infinity, delay: cross.delay, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: cross.x, top: cross.y, width: cross.size, height: cross.size }}
        >
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            height: 1.5, background: cross.color, transform: 'translateY(-50%)',
          }} />
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1.5, background: cross.color, transform: 'translateX(-50%)',
          }} />
        </motion.div>
      ))}
    </div>
  );
}
