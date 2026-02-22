import ScrollReveal from '../animations/ScrollReveal';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ tag, title, description, center = true }) {
  return (
    <ScrollReveal>
      <div className={`${styles.header} ${center ? styles.center : ''}`}>
        {tag && <span className={styles.tag}>{tag}</span>}
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </ScrollReveal>
  );
}
