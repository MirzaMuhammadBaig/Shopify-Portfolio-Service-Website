import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    if (loginError) setLoginError(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setLoginError(null);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Login failed';

      if (status === 404) {
        // Email not registered
        toast.error('You are not registered. Please create an account first.');
        setTimeout(() => navigate('/register'), 1500);
      } else if (status === 409) {
        // Email already registered (shouldn't happen on login, but handle)
        toast.error(message);
      } else {
        setLoginError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome! Signed in with Google.');
      navigate(from, { replace: true });
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        <div className={styles.googleWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google sign-in failed')}
            theme="filled_black"
            shape="pill"
            size="large"
            width="100%"
            text="signin_with"
          />
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or sign in with email</span>
          <span className={styles.dividerLine} />
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Enter your password" />
          <div className={styles.forgotLink}>
            <Link to="/forgot-password" className={styles.link}>Forgot password?</Link>
          </div>
          <Button type="submit" fullWidth loading={loading}>Sign In</Button>
        </form>
        {loginError && (
          <div className={styles.errorBox}>
            <p>{loginError}</p>
          </div>
        )}
        <p className={styles.footer}>
          Don't have an account? <Link to="/register" className={styles.link}>Sign Up</Link>
        </p>
      </div>
    </section>
  );
}
