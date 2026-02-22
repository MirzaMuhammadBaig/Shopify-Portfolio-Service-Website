import { useState } from 'react';
import { useMyOrders } from '../../hooks/useOrders';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { ORDER_STATUS_LABELS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiShoppingCart } from 'react-icons/hi';
import styles from './DashboardOrders.module.css';

const STATUS_BADGE_MAP = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export default function DashboardOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrders({ page, limit: 10 });
  const orders = data?.data || [];
  const meta = data?.meta;

  if (isLoading) return <LoadingSpinner />;

  if (!orders.length) {
    return <EmptyState icon={<HiShoppingCart />} title="No orders yet" description="Browse our services and place your first order." />;
  }

  return (
    <div>
      <h1 className={styles.title}>My Orders</h1>
      <div className={styles.list}>
        {orders.map((order) => (
          <Card key={order.id} className={styles.card}>
            <div className={styles.header}>
              <span className={styles.orderNum}>{order.orderNumber}</span>
              <Badge variant={STATUS_BADGE_MAP[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
            </div>
            <p className={styles.service}>{order.service?.title || 'Custom Order'}</p>
            <div className={styles.meta}>
              <span>{formatCurrency(order.totalAmount)}</span>
              <span>{formatDate(order.createdAt)}</span>
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
