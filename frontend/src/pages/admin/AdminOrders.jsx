import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ORDER_STATUS_LABELS, ORDER_STATUS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiChevronRight } from 'react-icons/hi';
import styles from './AdminTable.module.css';

const STATUS_BADGE_MAP = {
  PENDING: 'warning',
  IN_PROGRESS: 'primary',
  PENDING_APPROVAL: 'warning',
  DELIVERED: 'success',
};

const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([, v]) => v);

const FILTER_OPTIONS = [
  { value: null, label: 'All' },
  ...STATUS_OPTIONS.map((v) => ({ value: v, label: ORDER_STATUS_LABELS[v] })),
];

const ACTION_HINTS = {
  IN_PROGRESS: 'Submit Deliverables',
  PENDING_APPROVAL: 'Awaiting Approval',
  DELIVERED: 'Completed',
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedEmail(searchEmail);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchEmail]);

  const params = {
    page,
    limit: 20,
    ...(activeStatus && { status: activeStatus }),
    ...(debouncedEmail && { email: debouncedEmail }),
  };
  const { data, isLoading } = useOrders(params);
  const orders = data?.data || [];
  const meta = data?.meta;

  const handleFilterChange = (status) => {
    setActiveStatus(status);
    setPage(1);
  };

  return (
    <div>
      <h1 className={styles.title}>Orders</h1>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by customer email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className={styles.searchInput}
        />
      </div>
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
      ) : (
        <>
          <div className={styles.list}>
            {orders.map((order) => (
              <Card
                key={order.id}
                className={styles.row}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                <div className={styles.rowMain}>
                  <div>
                    <span className={styles.rowTitle}>{order.orderNumber}</span>
                    <p className={styles.rowMeta}>{order.user.firstName} {order.user.lastName} — {order.user.email}</p>
                    <p className={styles.rowMeta}>{order.service?.title || 'Custom'}</p>
                    {order.estimatedDelivery && (
                      <p className={styles.rowMeta}>Est. delivery: {formatDate(order.estimatedDelivery)}</p>
                    )}
                  </div>
                  <span className={styles.rowMeta}>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className={styles.rowActions}>
                  <Badge variant={STATUS_BADGE_MAP[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                  {ACTION_HINTS[order.status] && (
                    <span className={styles.rowMeta}>{ACTION_HINTS[order.status]}</span>
                  )}
                  <HiChevronRight style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }} />
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
        </>
      )}
    </div>
  );
}
