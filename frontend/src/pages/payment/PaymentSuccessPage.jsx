import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { HiCheckCircle, HiClock, HiHome, HiChat } from 'react-icons/hi';
import { paymentService } from '../../services/payment.service';
import { orderService } from '../../services/order.service';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import styles from './PaymentSuccessPage.module.css';

export default function PaymentSuccessPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [order, setOrder] = useState(null);
  const confirmedRef = useRef(false);

  const fetchOrderDetails = async () => {
    try {
      const orderRes = await orderService.getById(orderId);
      setOrder(orderRes.data?.data);
    } catch {
      // Order details are optional for the success page
    }
  };

  useEffect(() => {
    if (!orderId) return;

    let interval;
    let cancelled = false;

    const onConfirmed = () => {
      if (cancelled) return;
      setStatus('confirmed');
      if (interval) clearInterval(interval);
      fetchOrderDetails();
    };

    const startPolling = () => {
      let attempts = 0;
      const maxAttempts = 20;

      const checkStatus = async () => {
        if (cancelled) return;
        try {
          const res = await paymentService.getByOrderId(orderId);
          if (res.data?.data?.status === 'PAID') {
            onConfirmed();
          }
        } catch {
          // Payment record may not exist yet, keep polling
        }
        attempts++;
        if (attempts >= maxAttempts && interval) {
          clearInterval(interval);
        }
      };

      checkStatus();
      interval = setInterval(checkStatus, 3000);
    };

    const tracker = searchParams.get('tracker');
    const sig = searchParams.get('sig');

    if (tracker && !confirmedRef.current) {
      // Primary: verify payment using Safepay redirect params
      confirmedRef.current = true;
      paymentService.confirmSafepay({ tracker, ...(sig && { sig }), orderId })
        .then(() => onConfirmed())
        .catch(() => startPolling());
    } else {
      // Fallback: poll for webhook-based confirmation
      startPolling();
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
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
            {status === 'confirmed' ? 'Payment Successful!' : 'Processing Payment...'}
          </h1>

          <p className={styles.text}>
            {status === 'confirmed'
              ? 'Your order is confirmed and our team has started working on it right away!'
              : 'Your payment is being processed. This usually takes a few seconds.'}
          </p>

          {status === 'processing' && (
            <div className={styles.statusBar}>
              <div className={styles.statusDot} />
              <span>Confirming payment...</span>
            </div>
          )}

          {status === 'confirmed' && order && (
            <div className={styles.orderInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Order</span>
                <span className={styles.infoValue}>{order.orderNumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Service</span>
                <span className={styles.infoValue}>{order.service?.title || 'Custom Order'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Amount</span>
                <span className={styles.infoValue}>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Status</span>
                <span className={styles.infoValueHighlight}>In Progress</span>
              </div>
              {order.estimatedDelivery && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Est. Delivery</span>
                  <span className={styles.infoValueHighlight}>{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
            </div>
          )}

          {status === 'confirmed' && (
            <p className={styles.chatNote}>
              We've sent you a message with more details — check your chat!
            </p>
          )}

          <div className={styles.actions}>
            <Link to="/dashboard/orders">
              <Button>View My Orders</Button>
            </Link>
            {status === 'confirmed' && (
              <Link to="/dashboard/chat">
                <Button variant="outline">
                  <HiChat /> View Messages
                </Button>
              </Link>
            )}
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
