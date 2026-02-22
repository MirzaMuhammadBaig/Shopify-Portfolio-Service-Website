import { motion } from 'framer-motion';
import SectionHeader from '../../components/ui/SectionHeader';
import { TECHNOLOGIES } from '../../constants/static-data';
import styles from './Technologies.module.css';

export default function Technologies() {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.label}>TRUSTED INTEGRATIONS & TECHNOLOGIES I PREFER TO WORK WITH</p>
        <div className={styles.marqueeWrap}>
          <div className={styles.marquee}>
            {[...TECHNOLOGIES, ...TECHNOLOGIES].map((tech, i) => (
              <motion.div
                key={i}
                className={styles.techItem}
                whileHover={{ scale: 1.1, opacity: 1 }}
              >
                <span className={styles.techIcon}>{tech.icon}</span>
                <span className={styles.techName}>{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
