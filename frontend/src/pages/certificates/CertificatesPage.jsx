import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAcademicCap, HiX, HiArrowLeft } from 'react-icons/hi';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAboutData } from '../../hooks/useAbout';
import { ABOUT_CERTIFICATES, ABOUT_TEAM } from '../../constants/static-data';
import styles from './CertificatesPage.module.css';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

export default function CertificatesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCert, setSelectedCert] = useState(null);

  const { data: apiData } = useAboutData();
  const api = apiData?.data;

  const certificates = api?.certificates?.length ? api.certificates : ABOUT_CERTIFICATES;
  const members = api?.members?.length ? api.members : ABOUT_TEAM;

  const teamMap = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m.name])),
    [members],
  );

  // For API data, cert.memberId; for static data, cert.member
  const getMemberId = (cert) => cert.memberId || cert.member;
  const getMemberName = (cert) => cert.member?.name || teamMap[getMemberId(cert)] || '';

  const filters = useMemo(() => [
    { key: 'all', label: 'All Certificates' },
    ...members.map((m) => ({ key: m.id, label: m.name })),
  ], [members]);

  const filtered =
    activeFilter === 'all'
      ? certificates
      : certificates.filter((c) => getMemberId(c) === activeFilter);

  return (
    <section className={`section ${styles.pageWrapper}`}>
      <div className={styles.bgOrb + ' ' + styles.bgOrb1} />
      <div className={styles.bgOrb + ' ' + styles.bgOrb2} />
      <div className={styles.bgOrb + ' ' + styles.bgOrb3} />
      <div className="container">
        <Link to="/about" className={styles.backLink}>
          <HiArrowLeft /> Back to About
        </Link>

        <ScrollReveal>
          <div className={styles.hero}>
            <motion.span
              className={styles.heroTag}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Certifications
            </motion.span>
            <h1 className={styles.heroTitle}>
              Our <span className={styles.heroTitleAccent}>Credentials</span>
            </h1>
            <p className={styles.heroDesc}>
              {certificates.length} industry-recognized certifications across our team,
              validating deep expertise in e-commerce, design, development, and marketing.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.filters}>
            {filters.map((f) => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${activeFilter === f.key ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
                {f.key !== 'all' && (
                  <span className={styles.filterCount}>
                    {certificates.filter((c) => getMemberId(c) === f.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={activeFilter}
        >
          {filtered.map((cert) => (
            <motion.div key={cert.id} variants={staggerItem} layout>
              <Card glow className={styles.certCard} onClick={() => setSelectedCert(cert)}>
                <div className={styles.certBadge}>
                  <div className={styles.certImageWrap}>
                    {cert.image ? (
                      <img src={cert.image} alt={cert.title} />
                    ) : (
                      <HiAcademicCap className={styles.certIcon} />
                    )}
                  </div>
                </div>
                <h3 className={styles.certTitle}>{cert.title}</h3>
                <span className={styles.certIssuer}>{cert.issuer}</span>
                <div className={styles.certMeta}>
                  <span className={styles.certYear}>{cert.year}</span>
                  <span className={styles.certMember}>{getMemberName(cert)}</span>
                </div>
                <span className={styles.certViewLabel}>Click to view details</span>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className={styles.empty}>No certificates found for this filter.</p>
        )}

        <AnimatePresence>
          {selectedCert && (
            <motion.div
              className={styles.modalOverlay}
              variants={modalOverlay}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                className={styles.modal}
                variants={modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.modalClose} onClick={() => setSelectedCert(null)}>
                  <HiX />
                </button>
                <div className={styles.modalImageWrap}>
                  {selectedCert.image ? (
                    <img src={selectedCert.image} alt={selectedCert.title} />
                  ) : (
                    <div className={styles.modalPlaceholder}>
                      <HiAcademicCap />
                      <span>Certificate image</span>
                    </div>
                  )}
                </div>
                <div className={styles.modalBody}>
                  <h2 className={styles.modalTitle}>{selectedCert.title}</h2>
                  <div className={styles.modalTags}>
                    <span className={styles.modalIssuer}>{selectedCert.issuer}</span>
                    <span className={styles.modalYear}>{selectedCert.year}</span>
                    <span className={styles.modalMember}>{getMemberName(selectedCert)}</span>
                  </div>
                  <p className={styles.modalDesc}>{selectedCert.description}</p>
                </div>
                <div className={styles.modalFooter}>
                  <Button variant="outline" onClick={() => setSelectedCert(null)}>Close</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ScrollReveal variant="scale">
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Want to Work with Certified Experts?</h2>
            <p className={styles.ctaDesc}>
              Our team's certifications ensure you get industry-standard quality on every project.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact"><Button>Get a Free Consultation</Button></Link>
              <Link to="/about"><Button variant="outline">Back to About</Button></Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
