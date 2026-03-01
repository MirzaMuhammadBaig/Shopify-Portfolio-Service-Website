import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiCheckCircle, HiClock, HiHome } from 'react-icons/hi';
import { paymentService } from '../../services/payment.service';
import Button from '../../components/ui/Button';
import styles from './PaymentSuccessPage.module.css';

export default function PaymentSuccessPage() {
  const { orderId } = useParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    if (!orderId) return;

    let interval;
    let attempts = 0;
    const maxAttempts = 20;

    const checkStatus = async () => {
      try {
        const res = await paymentService.getByOrderId(orderId);
        const payment = res.data?.data;
        if (payment?.status === 'PAID') {
          setStatus('confirmed');
          clearInterval(interval);
        }
      } catch {
        // Payment record may not exist yet, keep polling
      }
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <section className="section">
      <div className="container">
        <div className={styles.wrap}>
          {status === 'confirmed' ? (
            <HiCheckCircle className={styles.iconSuccess} />
          ) : (
            <HiClock className={styles.iconProcessing} />
          )}

          <h1 className={styles.title}>
            {status === 'confirmed' ? 'Payment Confirmed!' : 'Payment Successful!'}
          </h1>

          <p className={styles.text}>
            {status === 'confirmed'
              ? 'Your payment has been verified. Thank you for your order!'
              : 'Your payment is being confirmed. This usually takes a few seconds.'}
          </p>

          {status === 'processing' && (
            <div className={styles.statusBar}>
              <div className={styles.statusDot} />
              <span>Confirming payment...</span>
            </div>
          )}

          <div className={styles.actions}>
            <Link to="/dashboard/orders">
              <Button>View My Orders</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <HiHome /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
