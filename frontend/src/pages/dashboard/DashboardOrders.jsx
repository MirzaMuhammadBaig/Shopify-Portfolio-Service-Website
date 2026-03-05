import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyOrders } from '../../hooks/useOrders';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiShoppingCart, HiChevronRight } from 'react-icons/hi';
import styles from './DashboardOrders.module.css';

const STATUS_BADGE_MAP = {
  PENDING: 'warning',
  IN_PROGRESS: 'primary',
  PENDING_APPROVAL: 'warning',
  DELIVERED: 'success',
};

function OrderTimeline({ startedAt, estimatedDelivery, status }) {
  const [tick, setTick] = useState(0);
  const isComplete = status === 'DELIVERED';

  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, [isComplete]);

  const start = new Date(startedAt).getTime();
  const end = new Date(estimatedDelivery).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;

  const hoursRemaining = (end - now) / (1000 * 60 * 60);
  const isOverdue = !isComplete && hoursRemaining <= 0;

  const progress = isComplete || isOverdue
    ? 100
    : total > 0
      ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
      : 0;

  let colorVariant = 'normal';
  if (!isComplete) {
    if (isOverdue) colorVariant = 'overdue';
    else if (hoursRemaining <= 12) colorVariant = 'critical';
    else if (hoursRemaining <= 24) colorVariant = 'urgent';
    else if (hoursRemaining <= 48) colorVariant = 'warning';
  }

  const fillColors = {
    normal: 'linear-gradient(90deg, #6C63FF, #00D9FF)',
    warning: '#FFB300',
    urgent: '#FF3D00',
    critical: '#FF3D00',
    overdue: '#B71C1C',
  };

  const percentClasses = {
    normal: '',
    warning: styles.timelinePercentWarning,
    urgent: styles.timelinePercentUrgent,
    critical: styles.timelinePercentCritical,
    overdue: styles.timelinePercentOverdue,
  };

  const getTimeDisplay = () => {
    if (isComplete) return `${progress}% complete`;
    if (isOverdue) {
      const overdueHours = Math.abs(hoursRemaining);
      if (overdueHours < 1) return `Overdue by ${Math.round(overdueHours * 60)}m`;
      if (overdueHours < 24) return `Overdue by ${Math.round(overdueHours)}h`;
      const days = Math.floor(overdueHours / 24);
      const hrs = Math.round(overdueHours % 24);
      return `Overdue by ${days}d ${hrs}h`;
    }
    return `${progress}% complete`;
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineDates}>
        <span>Started {formatDate(startedAt)}</span>
        <span className={colorVariant === 'overdue' ? styles.timelineDateOverdue : ''}>
          Est. {formatDate(estimatedDelivery)}
        </span>
      </div>
      <div className={styles.timelineTrack}>
        <div className={styles.timelineFill} style={{ width: `${progress}%`, background: fillColors[colorVariant] }} />
      </div>
      <span className={`${styles.timelinePercent} ${percentClasses[colorVariant] || ''}`}>
        {getTimeDisplay()}
      </span>
    </div>
  );
}

const FILTER_OPTIONS = [
  { value: null, label: 'All' },
  ...Object.entries(ORDER_STATUS).map(([, v]) => ({ value: v, label: ORDER_STATUS_LABELS[v] })),
];

const ACTION_HINTS = {
  PENDING_APPROVAL: 'Review Deliverables',
  DELIVERED: 'View Details',
};

export default function DashboardOrders() {
  const navigate = useNavigate();
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
              <Card
                key={order.id}
                className={`${styles.card} ${styles.headerClickable}`}
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
              >
                <div className={styles.header}>
                  <div className={styles.headerLeft}>
                    <span className={styles.orderNum}>{order.orderNumber}</span>
                    <Badge variant={STATUS_BADGE_MAP[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                  </div>
                  <div className={styles.headerRight}>
                    {ACTION_HINTS[order.status] && (
                      <span className={styles.reviewHint}>{ACTION_HINTS[order.status]}</span>
                    )}
                    <HiChevronRight className={styles.expandIcon} />
                  </div>
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
