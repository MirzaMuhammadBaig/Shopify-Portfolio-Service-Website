import { useState } from 'react';
import { useMyOrders } from '../../hooks/useOrders';
import { useMyReviews, useCreateReview, useUpdateReview } from '../../hooks/useReviews';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiShoppingCart, HiStar, HiChevronDown } from 'react-icons/hi';
import toast from 'react-hot-toast';
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

function StarRating({ rating, onChange, readOnly }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        readOnly ? (
          <HiStar key={n} className={n <= rating ? styles.starFilled : styles.starEmpty} />
        ) : (
          <button key={n} type="button" onClick={() => onChange(n)} className={styles.starBtn}>
            <HiStar className={n <= rating ? styles.starFilled : styles.starEmpty} />
          </button>
        )
      ))}
    </div>
  );
}

function ReviewSection({ order, existingReview }) {
  const [mode, setMode] = useState(null); // null | 'create' | 'edit'
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'edit') {
        await updateReview.mutateAsync({ id: existingReview.id, data: { rating, comment } });
        toast.success('Review updated!');
      } else {
        await createReview.mutateAsync({ serviceId: order.serviceId, rating, comment });
        toast.success('Review submitted!');
      }
      setMode(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const openEdit = () => {
    setRating(existingReview.rating);
    setComment(existingReview.comment || '');
    setMode('edit');
  };

  // Already reviewed — show the review
  if (existingReview && mode !== 'edit') {
    return (
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionHeader}>
          <h4 className={styles.reviewSectionTitle}>Your Review</h4>
          {existingReview.editCount >= 1 ? (
            <Badge variant="neutral">Already edited</Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={openEdit}>Edit Review</Button>
          )}
        </div>
        <StarRating rating={existingReview.rating} readOnly />
        {existingReview.comment && <p className={styles.reviewComment}>{existingReview.comment}</p>}
        <span className={styles.reviewDate}>Reviewed on {formatDate(existingReview.createdAt)}</span>
      </div>
    );
  }

  // Show form (create or edit)
  if (mode === 'create' || mode === 'edit') {
    return (
      <div className={styles.reviewSection}>
        <h4 className={styles.reviewSectionTitle}>{mode === 'edit' ? 'Edit Your Review' : 'Write a Review'}</h4>
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.reviewField}>
            <label className={styles.reviewLabel}>Rating</label>
            <StarRating rating={rating} onChange={setRating} />
          </div>
          <Input
            label="Comment"
            type="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
          />
          <div className={styles.reviewActions}>
            <Button type="submit" size="sm" loading={createReview.isPending || updateReview.isPending}>
              {mode === 'edit' ? 'Save Changes' : 'Submit Review'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setMode(null)}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }

  // Show "Write Review" prompt
  return (
    <div className={styles.reviewSection}>
      <div className={styles.writeReviewPrompt}>
        <p className={styles.writeReviewText}>How was your experience with this service?</p>
        <Button size="sm" onClick={() => setMode('create')}>Write a Review</Button>
      </div>
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
  const [expandedOrder, setExpandedOrder] = useState(null);
  const params = { page, limit: 10, ...(activeStatus && { status: activeStatus }) };
  const { data, isLoading } = useMyOrders(params);
  const { data: myReviewsData } = useMyReviews({ limit: 100 });
  const orders = data?.data || [];
  const meta = data?.meta;
  const myReviews = myReviewsData?.data || [];

  // Map serviceId -> review for quick lookup
  const reviewByService = {};
  myReviews.forEach((r) => { reviewByService[r.serviceId] = r; });

  const handleFilterChange = (status) => {
    setActiveStatus(status);
    setPage(1);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const isReviewable = (status) => status === 'COMPLETED' || status === 'DELIVERED';

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
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const canReview = isReviewable(order.status);
              const existingReview = order.serviceId ? reviewByService[order.serviceId] : null;

              return (
                <Card key={order.id} className={`${styles.card} ${isExpanded ? styles.cardExpanded : ''}`}>
                  <div
                    className={`${styles.header} ${canReview ? styles.headerClickable : ''}`}
                    onClick={() => canReview && toggleExpand(order.id)}
                  >
                    <div className={styles.headerLeft}>
                      <span className={styles.orderNum}>{order.orderNumber}</span>
                      <Badge variant={STATUS_BADGE_MAP[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                    </div>
                    <div className={styles.headerRight}>
                      {canReview && existingReview && existingReview.editCount >= 1 && (
                        <Badge variant="success">Reviewed</Badge>
                      )}
                      {canReview && existingReview && existingReview.editCount < 1 && !isExpanded && (
                        <span className={styles.reviewHint}>Edit Review</span>
                      )}
                      {canReview && !existingReview && !isExpanded && (
                        <span className={styles.reviewHint}>Write Review</span>
                      )}
                      {canReview && (
                        <HiChevronDown className={`${styles.expandIcon} ${isExpanded ? styles.expandIconRotated : ''}`} />
                      )}
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

                  {/* Expanded section with order details + review */}
                  {isExpanded && canReview && (
                    <div className={styles.expandedContent}>
                      <div className={styles.orderDetails}>
                        <h4 className={styles.detailsTitle}>Order Details</h4>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Order Number</span>
                            <span className={styles.detailValue}>{order.orderNumber}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Service</span>
                            <span className={styles.detailValue}>{order.service?.title || 'Custom Order'}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Amount</span>
                            <span className={styles.detailValue}>{formatCurrency(order.totalAmount)}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Ordered On</span>
                            <span className={styles.detailValue}>{formatDate(order.createdAt)}</span>
                          </div>
                          {order.completedAt && (
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Completed On</span>
                              <span className={styles.detailValue}>{formatDate(order.completedAt)}</span>
                            </div>
                          )}
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Status</span>
                            <Badge variant={STATUS_BADGE_MAP[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                          </div>
                        </div>
                      </div>

                      <ReviewSection order={order} existingReview={existingReview} />
                    </div>
                  )}
                </Card>
              );
            })}
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
