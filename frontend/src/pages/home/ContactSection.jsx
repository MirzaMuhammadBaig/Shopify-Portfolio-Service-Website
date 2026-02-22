import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import styles from './ContactSection.module.css';

const CONTACT_INFO = [
  { icon: HiMail, label: 'Email', value: 'webdev.muhammad@gmail.com' },
  { icon: HiPhone, label: 'Phone', value: '+92 320 9246199' },
  { icon: HiLocationMarker, label: 'Location', value: 'Remote - Worldwide' },
];

export default function ContactSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const isGuest = !user;

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.name || prev.name),
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    if (e.target.name === 'email') return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSending(true);
    try {
      await authService.contact(form);
      toast.success('Message sent! We will get back to you soon.');
      setForm((prev) => ({ ...prev, message: '' }));
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className={styles.grid}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className={styles.title}>Get In Touch</h2>
            <p className={styles.desc}>Have a project in mind? Let's discuss how we can help.</p>
            <div className={styles.info}>
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className={styles.infoItem}>
                  <Icon className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>{label}</span>
                    <span className={styles.infoValue}>{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className={styles.form}>
            <Input label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" disabled={isGuest} />
            <div className={styles.emailField}>
              <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" readOnly={!!user?.email} disabled={isGuest} />
              {user?.email && (
                <span className={styles.lockBadge}>
                  <HiLockClosed /> From your account
                </span>
              )}
            </div>
            <Input label="Message" name="message" type="textarea" value={form.message} onChange={handleChange} placeholder="Tell us about your project..." disabled={isGuest} />
            {isGuest ? (
              <Button type="button" fullWidth onClick={() => navigate('/login')}>Sign In First</Button>
            ) : (
              <Button type="submit" fullWidth disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</Button>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
