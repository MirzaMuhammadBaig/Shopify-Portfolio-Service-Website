import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

const WHATSAPP_API = import.meta.env.VITE_WHATSAPP_API;
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const WHATSAPP_URL = `${WHATSAPP_API}?phone=${WHATSAPP_NUMBER}`;

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
