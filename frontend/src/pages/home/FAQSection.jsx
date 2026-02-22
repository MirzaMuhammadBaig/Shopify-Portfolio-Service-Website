import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiMinus } from 'react-icons/hi';
import SectionHeader from '../../components/ui/SectionHeader';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { FAQ_DATA } from '../../constants/static-data';
import styles from './FAQSection.module.css';

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`${styles.item} ${isOpen ? styles.active : ''}`}>
      <button className={styles.question} onClick={onToggle}>
        <span>{faq.question}</span>
        <span className={styles.icon}>
          {isOpen ? <HiMinus /> : <HiPlus />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.answerWrap}
          >
            <p className={styles.answer}>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const INITIAL_COUNT = 10;

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? FAQ_DATA : FAQ_DATA.slice(0, INITIAL_COUNT);
  const hasMore = FAQ_DATA.length > INITIAL_COUNT;

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          tag="FAQ"
          title="Frequently Asked Questions"
          description="Got questions? We've got answers. Find what you need below."
        />
        <div className={styles.list}>
          {visible.map((faq, index) => (
            <ScrollReveal key={faq.id} delay={index * 0.05}>
              <FAQItem
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            </ScrollReveal>
          ))}
        </div>
        {hasMore && (
          <div className={styles.viewMore}>
            <button onClick={() => setShowAll(!showAll)} className={styles.viewMoreBtn}>
              {showAll ? 'Show Less' : `View More FAQs (${FAQ_DATA.length - INITIAL_COUNT} more)`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
