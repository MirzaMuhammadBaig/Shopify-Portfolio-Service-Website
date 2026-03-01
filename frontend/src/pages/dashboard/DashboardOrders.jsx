import { useState } from 'react';
import { useMyOrders } from '../../hooks/useOrders';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
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

function OrderTimeline({ startedAt, estimatedDelivery, status }) {
  const start = new Date(startedAt).getTime();
  const end = new Date(estimatedDelivery).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;
  const isComplete = status === 'COMPLETED' || status === 'DELIVERED';
  const progress = isComplete ? 100 : total > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))) : 0;

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineDates}>
        <span>Started {formatDate(startedAt)}</span>
        <span>Est. {formatDate(estimatedDelivery)}</span>
      </div>
      <div className={styles.timelineTrack}>
        <div className={styles.timelineFill} style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.timelinePercent}>{progress}% complete</span>
    </div>
  );
}

const FILTER_OPTIONS = [
  { value: null, label: 'All' },
  ...Object.entries(ORDER_STATUS).map(([, v]) => ({ value: v, label: ORDER_STATUS_LABELS[v] })),
];

export default function DashboardOrders() {
  const [page, setPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState(null);
  const params = { page, limit: 10, ...(activeStatus && { status: activeStatus }) };
  const { data, isLoading } = useMyOrders(params);
  const orders = data?.data || [];
  const meta = data?.meta;

  const handleFilterChange = (status) => {
    setActiveStatus(status);
    setPage(1);
  };

  return (
    <div>
      <h1 className={styles.title}>My Orders</h1>
      <div className={styles.filters}>
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value || 'all'}
            className={`${styles.filterBtn} ${activeStatus === opt.value ? styles.filterActive : ''}`}
            onClick={() => handleFilterChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !orders.length ? (
        <EmptyState
          icon={<HiShoppingCart />}
          title={activeStatus ? 'No orders found' : 'No orders yet'}
          description={activeStatus ? 'Try a different filter.' : 'Browse our services and place your first order.'}
        />
      ) : (
        <>
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
                {order.startedAt && order.estimatedDelivery && (
                  <OrderTimeline startedAt={order.startedAt} estimatedDelivery={order.estimatedDelivery} status={order.status} />
                )}
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
        </>
      )}
    </div>
  );
}
