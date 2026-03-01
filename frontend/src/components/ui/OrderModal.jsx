import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChat } from 'react-icons/hi';
import Button from './Button';
import styles from './OrderModal.module.css';

export default function OrderModal({ isOpen, onClose, onOrderNow, onGetQuote, loading }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <HiX />
            </button>

            <div className={styles.icon}>
              <HiChat />
            </div>

            <h3 className={styles.title}>Get the Perfect Result</h3>
            <p className={styles.message}>
              Want a result that matches your exact vision? Chat with us first to discuss your
              requirements, timeline, and any special needs — then place your order with confidence.
            </p>

            <div className={styles.actions}>
              <Button fullWidth onClick={onOrderNow} loading={loading}>
                Order Now
              </Button>
              <Button fullWidth variant="outline" onClick={onGetQuote} disabled={loading}>
                Get Custom Quote
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
