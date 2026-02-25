import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import FloatingElements from '../../components/animations/FloatingElements';
import styles from './HeroSection.module.css';

const ParticleBackground = lazy(() => import('../../components/animations/ParticleBackground'));

export default function HeroSection() {
  const { user } = useAuth();
  const [showBg, setShowBg] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(() => setShowBg(true));
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setShowBg(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.content}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.textBlock}
        >
          <span className={styles.badge}>Trusted Shopify Experts</span>
          <h1 className={styles.title}>
            Build Your Dream
            <span className={styles.highlight}> Shopify Store</span>
          </h1>
          <p className={styles.subtitle}>
            We craft high-converting, beautifully designed Shopify stores that drive sales
            and elevate your brand to the next level.
          </p>
          <div className={styles.actions}>
            <Link to="/services" className={styles.primaryBtn}>
              Explore Services <HiArrowRight />
            </Link>
            <Link to={user ? '/contact' : '/login'} className={styles.secondaryBtn}>
              Get Custom Quote
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>100+</span>
              <span className={styles.statLabel}>Projects Done</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Happy Clients</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>90%</span>
              <span className={styles.statLabel}>Satisfaction</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.visual}
        >
          <div className={styles.codeBlock}>
            {/* Glow + particles confined inside the card */}
            <div className={styles.glowOrb} />
            {showBg && (
              <div className={styles.particleOverlay}>
                <Suspense fallback={null}>
                  <ParticleBackground />
                </Suspense>
                <FloatingElements />
              </div>
            )}

            <div className={styles.codeHeader}>
              <span className={styles.dot} style={{ background: '#FF5F57' }} />
              <span className={styles.dot} style={{ background: '#FEBC2E' }} />
              <span className={styles.dot} style={{ background: '#28C840' }} />
            </div>
            <pre className={styles.code}>
{`{
  "store": "YourBrand",
  "theme": "custom",
  "conversions": "\u2191 340%",
  "status": "live \u2713"
}`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
