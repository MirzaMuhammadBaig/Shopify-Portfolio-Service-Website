import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

const WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=923209246199';

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className={styles.icon} />
      <span className={styles.tooltip}>Chat on WhatsApp</span>
    </a>
  );
}
