import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
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
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(form);
      setEmailSent(true);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Registration failed';

      if (status === 409) {
        // Email already registered
        toast.error('This email is already registered. Please log in instead.');
        setTimeout(() => navigate('/login'), 1500);
      } else if (err.response?.data?.errors) {
        // Validation errors from backend (field + message format)
        const backendErrors = {};
        err.response.data.errors.forEach((e) => {
          if (e.field) backendErrors[e.field] = e.message;
        });
        setErrors(backendErrors);
        toast.error('Please fix the errors below');
      } else {
        toast.error(message);
      }
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
            We have sent a verification link to <strong style={{ color: 'var(--color-text)' }}>{form.email}</strong>
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Please click the link in the email to verify your account. After verification, you can sign in.
          </p>
          <Link to="/login">
            <Button fullWidth>Go to Sign In</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Get started with our services</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="John" />
            <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" />
          </div>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
          <Input label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} placeholder="+92 3XX XXXXXXX" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Min 8 chars, uppercase, lowercase, number" />
          <Button type="submit" fullWidth loading={loading}>Create Account</Button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </section>
  );
}
