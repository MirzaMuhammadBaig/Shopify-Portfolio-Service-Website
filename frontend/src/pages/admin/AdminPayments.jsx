import { useState } from 'react';
import { usePayments, useVerifyPayment } from '../../hooks/usePayments';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const STATUS_BADGE_MAP = {
  PENDING: 'warning',
  PAID: 'success',
  FAILED: 'error',
  REFUNDED: 'info',
};

const STATUS_OPTIONS = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePayments({ page, limit: 20 });
  const verifyPayment = useVerifyPayment();
  const payments = data?.data || [];
  const meta = data?.meta;

  const handleStatusChange = async (id, status) => {
    try {
      await verifyPayment.mutateAsync({ id, data: { status } });
      toast.success('Payment status updated');
    } catch {
      toast.error('Failed to update payment');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.title}>Payments</h1>
      <div className={styles.list}>
        {payments.map((payment) => (
          <Card key={payment.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div>
                <span className={styles.rowTitle}>{payment.order?.orderNumber}</span>
                <p className={styles.rowMeta}>
                  {payment.user?.firstName} {payment.user?.lastName} &middot; {payment.method} &middot; TxID: {payment.transactionId || 'N/A'}
                </p>
              </div>
              <span className={styles.rowMeta}>{formatCurrency(payment.amount)}</span>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={STATUS_BADGE_MAP[payment.status]}>{payment.status}</Badge>
              <select
                value={payment.status}
                onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                className={styles.select}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </Card>
        ))}
        {payments.length === 0 && <p className={styles.rowMeta}>No payments yet.</p>}
      </div>
      {meta && meta.totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
