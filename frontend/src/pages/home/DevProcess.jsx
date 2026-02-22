import ScrollReveal from '../../components/animations/ScrollReveal';
import SectionHeader from '../../components/ui/SectionHeader';
import { PROCESS_STEPS } from '../../constants/static-data';
import styles from './DevProcess.module.css';

export default function DevProcess() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          tag="HOW I WORK"
          title="My Development Process"
          description="A proven, systematic approach that ensures every project is delivered on time, on budget, and exceeds expectations."
        />
        <div className={styles.grid}>
          {PROCESS_STEPS.map((step, index) => (
            <ScrollReveal key={step.id} delay={index * 0.08}>
              <div className={styles.card}>
                <span className={styles.number}>
                  {String(step.id).padStart(2, '0')}
                </span>
                <div className={styles.iconWrap}>{step.icon}</div>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.description}>{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
