import { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ORDER_STATUS_LABELS, ORDER_STATUS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const STATUS_BADGE_MAP = {
  PENDING: 'warning', CONFIRMED: 'info', IN_PROGRESS: 'primary',
  COMPLETED: 'success', DELIVERED: 'success', CANCELLED: 'error',
};

const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([, v]) => v);

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page, limit: 20 });
  const updateStatus = useUpdateOrderStatus();
  const orders = data?.data || [];
  const meta = data?.meta;

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.title}>Orders</h1>
      <div className={styles.list}>
        {orders.map((order) => (
          <Card key={order.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div>
                <span className={styles.rowTitle}>{order.orderNumber}</span>
                <p className={styles.rowMeta}>{order.user.firstName} {order.user.lastName} - {order.service?.title || 'Custom'}</p>
              </div>
              <span className={styles.rowMeta}>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={STATUS_BADGE_MAP[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={styles.select}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </Card>
        ))}
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
