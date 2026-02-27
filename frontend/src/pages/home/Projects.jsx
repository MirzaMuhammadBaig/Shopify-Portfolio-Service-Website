import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiGlobeAlt } from 'react-icons/hi';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { useProjects } from '../../hooks/useProjects';
import { PROJECTS_DATA } from '../../constants/static-data';
import styles from './Projects.module.css';

const INITIAL_COUNT = 6;

// Placeholder shown while loading or when no image available
function ProjectPlaceholder({ category }) {
  return (
    <div className={styles.placeholderBg}>
      <div className={styles.placeholderContent}>
        <HiGlobeAlt className={styles.placeholderIcon} />
        <span className={styles.placeholderCategory}>{category}</span>
      </div>
    </div>
  );
}

// Build live screenshot URL from project's liveUrl
function getLiveScreenshotUrl(liveUrl) {
  if (!liveUrl || liveUrl === '#') return null;
  return `https://image.thum.io/get/width/600/crop/400/${liveUrl}`;
}

/**
 * Validates a screenshot by drawing it on a canvas and sampling pixels.
 * thum.io error images are mostly white/light with text — real screenshots
 * have varied colors and darker areas from actual website content.
 */
function isValidScreenshot(img) {
  try {
    const canvas = document.createElement('canvas');
    const size = 50;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    let lightPixels = 0;
    const totalPixels = size * size;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Count very light / white-ish pixels
      if (r > 220 && g > 220 && b > 220) lightPixels++;
    }

    // If more than 85% of pixels are white/light, it's likely the error image
    return (lightPixels / totalPixels) < 0.85;
  } catch {
    // Canvas tainted (CORS) — can't verify, reject to be safe
    return false;
  }
}

/**
 * ProjectImage — comprehensive 3-tier image logic:
 *   1) Uploaded image → show immediately
 *   2) No upload → show placeholder, try live URL screenshot in background
 *      - If screenshot loads AND passes validation → fade it in
 *      - If screenshot fails OR is a garbage error image → keep placeholder
 */
function ProjectImage({ image, liveUrl, title, category }) {
  const [imageReady, setImageReady] = useState(false);
  const [readySrc, setReadySrc] = useState(null);
  const triedRef = useRef(false);

  useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;

    // Tier 1: uploaded image — load in background, fade in when ready
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => { setReadySrc(image); setImageReady(true); };
      return;
    }

    // Tier 2: live URL screenshot — load + validate, fade in if good
    const url = getLiveScreenshotUrl(liveUrl);
    if (!url) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      if (isValidScreenshot(img)) { setReadySrc(url); setImageReady(true); }
    };
    // onError → do nothing, placeholder stays
  }, [image, liveUrl]);

  // Always render placeholder first, fade in image once ready
  return (
    <div className={styles.cardImage}>
      <ProjectPlaceholder category={category} />
      {imageReady && (
        <img
          src={readySrc}
          alt={`${title} preview`}
          className={`${styles.previewImg} ${styles.screenshotFadeIn}`}
        />
      )}
    </div>
  );
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
            {visible.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 0.08}>
                  <Card glow className={styles.card}>
                    <ProjectImage
                      image={project.image}
                      liveUrl={project.liveUrl}
                      title={project.title}
                      category={project.category}
                    />

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
