import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { useProjects } from '../../hooks/useProjects';
import { PROJECTS_DATA } from '../../constants/static-data';
import styles from './Projects.module.css';

const INITIAL_COUNT = 6;

// Use uploaded image first, then fall back to live screenshot via thum.io
function getImageUrl(project) {
  if (project.image) return project.image;
  if (project.liveUrl && project.liveUrl !== '#') {
    return `https://image.thum.io/get/width/600/crop/400/${project.liveUrl}`;
  }
  return null;
}

export default function Projects() {
  const [active, setActive] = useState('All');
  const [showAll, setShowAll] = useState(false);

  // Fetch from API, fall back to static data
  const { data } = useProjects({ limit: 100, active: 'true' });
  const projects = data?.data?.length ? data.data : PROJECTS_DATA;

  const categories = useMemo(
    () => ['All', ...new Set(projects.map(p => p.category))],
    [projects]
  );

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);
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
          {categories.map(cat => (
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
            {visible.map((project, index) => {
              const imageUrl = getImageUrl(project);

              return (
                <ScrollReveal key={project.id} delay={index * 0.08}>
                  <Card glow className={styles.card}>
                    {/* Preview image — clean, no overlay */}
                    <div className={styles.cardImage}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${project.title} preview`}
                          className={styles.previewImg}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className={styles.placeholderBg} />
                      )}
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
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewBtn}
                        >
                          View Project <HiArrowRight />
                        </a>
                      )}
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
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
