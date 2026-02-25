import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import ScrollReveal from '../../components/animations/ScrollReveal';
import styles from './CTASection.module.css';

export default function CTASection() {
  const { user } = useAuth();
  return (
    <section className={styles.section}>
      <div className="container">
        <ScrollReveal>
          <div className={styles.card}>
            <div className={styles.glow} />
            <h2 className={styles.title}>Ready to Transform Your Shopify Store?</h2>
            <p className={styles.description}>
              Let's discuss your project and build something extraordinary together.
            </p>
            <div className={styles.actions}>
              <Link to={user ? '/contact' : '/login'} className={styles.primaryBtn}>
                Start Your Project <HiArrowRight />
              </Link>
              <Link to="/services" className={styles.secondaryBtn}>
                View Pricing
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
