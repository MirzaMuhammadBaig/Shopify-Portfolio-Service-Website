import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { authService } from '../../services/auth.service';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Something went wrong';

      if (status === 404) {
        setError('No account found with this email address.');
      } else {
        setError(message);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <section className={styles.section}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#6C63FF' }}>
            <HiMail />
          </div>
          <h1 className={styles.title}>Check Your Email</h1>
          <p className={styles.subtitle} style={{ marginBottom: '16px' }}>
            We have sent a password reset link to <strong style={{ color: 'var(--color-text)' }}>{email}</strong>
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Please click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
          <Link to="/login">
            <Button fullWidth>Back to Sign In</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.subtitle}>Enter your email and we'll send you a reset link</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            error={error}
            placeholder="you@example.com"
          />
          <Button type="submit" fullWidth loading={loading}>Send Reset Link</Button>
        </form>
        <p className={styles.footer}>
          Remember your password? <Link to="/login" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </section>
  );
}
