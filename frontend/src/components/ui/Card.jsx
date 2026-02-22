import { motion } from 'framer-motion';
import styles from './Card.module.css';

export default function Card({
  children,
  hover = true,
  glow = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`${styles.card} ${glow ? styles.glow : ''} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
