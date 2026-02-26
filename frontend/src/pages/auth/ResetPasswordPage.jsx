import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { authService } from '../../services/auth.service';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(token ? 'form' : 'error'); // form | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      errs.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(form.password)) {
      errs.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(form.password)) {
      errs.password = 'Password must contain at least one number';
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password: form.password });
      setStatus('success');
      toast.success('Password reset successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      if (err.response?.status === 400) {
        setStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <section className={styles.section}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px', color: '#00C853' }}>
            <HiCheckCircle />
          </div>
          <h1 className={styles.title}>Password Reset!</h1>
          <p className={styles.subtitle} style={{ marginBottom: '24px' }}>
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Link to="/login">
            <Button fullWidth>Sign In Now</Button>
          </Link>
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className={styles.section}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px', color: '#FF3D00' }}>
            <HiXCircle />
          </div>
          <h1 className={styles.title}>Invalid Reset Link</h1>
          <p className={styles.subtitle} style={{ marginBottom: '24px' }}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/forgot-password">
            <Button fullWidth>Request New Link</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set New Password</h1>
        <p className={styles.subtitle}>Enter your new password below</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="New Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Min 8 chars, uppercase, lowercase, number"
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
          />
          <Button type="submit" fullWidth loading={loading}>Reset Password</Button>
        </form>
        <p className={styles.footer}>
          Remember your password? <Link to="/login" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </section>
  );
}
