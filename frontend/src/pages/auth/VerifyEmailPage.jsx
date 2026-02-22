import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { authService } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import styles from './AuthPage.module.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  if (status === 'loading') {
    return (
      <section className={styles.section}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <p className={styles.subtitle} style={{ marginTop: '16px' }}>Verifying your email...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.card} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px', color: status === 'success' ? '#00C853' : '#FF3D00' }}>
          {status === 'success' ? <HiCheckCircle /> : <HiXCircle />}
        </div>
        <h1 className={styles.title}>
          {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
        </h1>
        <p className={styles.subtitle} style={{ marginBottom: '24px' }}>
          {status === 'success'
            ? 'Your email has been verified successfully. You can now sign in to your account.'
            : 'The verification link is invalid or has already been used. Please try registering again.'}
        </p>
        <Link to={status === 'success' ? '/login' : '/register'}>
          <Button fullWidth>
            {status === 'success' ? 'Sign In Now' : 'Register Again'}
          </Button>
        </Link>
      </div>
    </section>
  );
}
