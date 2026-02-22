import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { PROJECTS_DATA } from '../../constants/static-data';
import styles from './Projects.module.css';

const INITIAL_COUNT = 6;
const CATEGORIES = ['All', ...new Set(PROJECTS_DATA.map(p => p.category))];

export default function Projects() {
  const [active, setActive] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const filtered = active === 'All' ? PROJECTS_DATA : PROJECTS_DATA.filter(p => p.category === active);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  const handleFilterChange = (cat) => {
    setActive(cat);
    setShowAll(false);
  };

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          tag="Portfolio"
          title="Featured Projects"
          description="A showcase of Shopify stores and solutions we've built for our clients."
        />
        <div className={styles.filters}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`${styles.filterBtn} ${active === cat ? styles.activeFilter : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${showAll}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={styles.grid}
          >
            {visible.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.08}>
                <Card glow className={styles.card}>
                  <div className={styles.cardImage}>
                    <div className={styles.placeholder}>
                      <span className={styles.placeholderIcon}>🖥️</span>
                      <span className={styles.placeholderText}>{project.category}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.category}>{project.category}</span>
                    <h3 className={styles.title}>{project.title}</h3>
                    <p className={styles.desc}>{project.description}</p>
                    <div className={styles.tags}>
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    <div className={styles.results}>
                      {project.results.map((result, i) => (
                        <span key={i} className={styles.result}>{result}</span>
                      ))}
                    </div>
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.visitLink}>
                        Visit Site <HiExternalLink />
                      </a>
                    )}
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </motion.div>
        </AnimatePresence>
        {hasMore && (
          <div className={styles.viewMore}>
            <button onClick={() => setShowAll(!showAll)} className={styles.viewMoreBtn}>
              {showAll ? 'Show Less' : `View More Projects (${filtered.length - INITIAL_COUNT} more)`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
