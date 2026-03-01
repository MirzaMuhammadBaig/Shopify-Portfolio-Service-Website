import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { HiCheckCircle, HiClock, HiChat, HiShoppingCart, HiHome } from 'react-icons/hi';
import { paymentService } from '../../services/payment.service';
import { orderService } from '../../services/order.service';
import { CHAT_QUERY_KEYS } from '../../hooks/useChat';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import styles from './PaymentSuccessPage.module.css';

export default function PaymentSuccessPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('processing');
  const [order, setOrder] = useState(null);
  const confirmedRef = useRef(false);

  const fetchOrderDetails = async () => {
    try {
      const orderRes = await orderService.getById(orderId);
      setOrder(orderRes.data?.data);
    } catch {
      // Order details are optional
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
      // Invalidate unread count + conversations so sidebar dot appears instantly
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.unread });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations });
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
          // Keep polling
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
      confirmedRef.current = true;
      paymentService.confirmSafepay({ tracker, ...(sig && { sig }), orderId })
        .then(() => onConfirmed())
        .catch(() => startPolling());
    } else {
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
            <button className={styles.chatBanner} onClick={() => navigate('/dashboard/chat')}>
              <HiChat className={styles.chatBannerIcon} />
              <div>
                <strong>You have a new message!</strong>
                <span>We sent you order details and next steps in chat</span>
              </div>
            </button>
          )}

          <div className={styles.actions}>
            <Button onClick={() => navigate('/dashboard/orders')}>
              <HiShoppingCart style={{ marginRight: 6 }} /> View My Orders
            </Button>
            {status === 'confirmed' && (
              <Button variant="outline" onClick={() => navigate('/dashboard/chat')}>
                <HiChat style={{ marginRight: 6 }} /> View Messages
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/')}>
              <HiHome style={{ marginRight: 6 }} /> Back to Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
