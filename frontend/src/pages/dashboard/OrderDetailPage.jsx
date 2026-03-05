import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrderById, useApproveOrder, useRequestRevision } from '../../hooks/useOrders';
import { useMyReviews, useCreateReview, useUpdateReview } from '../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import OrderChat from '../../components/shared/OrderChat';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiArrowLeft, HiExternalLink, HiDownload, HiStar, HiCheckCircle, HiRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';
import styles from './OrderDetailPage.module.css';

const STATUS_BADGE_MAP = {
  PENDING: 'warning',
  IN_PROGRESS: 'primary',
  PENDING_APPROVAL: 'warning',
  DELIVERED: 'success',
};

function OrderTimeline({ startedAt, estimatedDelivery, status }) {
  const start = new Date(startedAt).getTime();
  const end = new Date(estimatedDelivery).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;
  const isComplete = status === 'DELIVERED';
  const hoursRemaining = (end - now) / (1000 * 60 * 60);
  const isOverdue = !isComplete && hoursRemaining <= 0;
  const progress = isComplete || isOverdue ? 100 : total > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))) : 0;

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
  const [mode, setMode] = useState(null);
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

  if (existingReview && mode !== 'edit') {
    return (
      <Card className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <h3 className={styles.sectionTitle}>Your Review</h3>
          {existingReview.editCount >= 1 ? (
            <Badge variant="neutral">Already edited</Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={openEdit}>Edit Review</Button>
          )}
        </div>
        <StarRating rating={existingReview.rating} readOnly />
        {existingReview.comment && <p className={styles.reviewComment}>{existingReview.comment}</p>}
        <span className={styles.reviewDate}>Reviewed on {formatDate(existingReview.createdAt)}</span>
      </Card>
    );
  }

  if (mode === 'create' || mode === 'edit') {
    return (
      <Card className={styles.section}>
        <h3 className={styles.sectionTitle}>{mode === 'edit' ? 'Edit Your Review' : 'Write a Review'}</h3>
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.reviewField}>
            <label className={styles.reviewLabel}>Rating</label>
            <StarRating rating={rating} onChange={setRating} />
          </div>
          <Input label="Comment" type="textarea" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." />
          <div className={styles.reviewActions}>
            <Button type="submit" size="sm" loading={createReview.isPending || updateReview.isPending}>
              {mode === 'edit' ? 'Save Changes' : 'Submit Review'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setMode(null)}>Cancel</Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className={styles.section}>
      <div className={styles.writeReviewPrompt}>
        <p className={styles.writeReviewText}>How was your experience with this service?</p>
        <Button size="sm" onClick={() => setMode('create')}>Write a Review</Button>
      </div>
    </Card>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useOrderById(id);
  const { data: myReviewsData } = useMyReviews({ limit: 100 });
  const approveOrder = useApproveOrder();
  const requestRevision = useRequestRevision();
  const [confirmAction, setConfirmAction] = useState(null);

  const order = data?.data;
  const myReviews = myReviewsData?.data || [];
  const existingReview = order?.serviceId ? myReviews.find((r) => r.serviceId === order.serviceId) : null;

  const handleApprove = async () => {
    try {
      await approveOrder.mutateAsync(order.id);
      toast.success('Order approved! Thank you.');
      setConfirmAction(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleRevision = async () => {
    try {
      await requestRevision.mutateAsync(order.id);
      toast.success('Revision requested.');
      setConfirmAction(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request revision');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!order) return <p>Order not found.</p>;

  const isPendingApproval = order.status === ORDER_STATUS.PENDING_APPROVAL;
  const isDelivered = order.status === ORDER_STATUS.DELIVERED;
  const hasDeliverables = order.orderDeliverables?.length > 0 || order.githubUrl;

  return (
    <div>
      <Link to="/dashboard/orders" className={styles.backLink}>
        <HiArrowLeft /> Back to Orders
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* Order Info */}
          <Card className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.orderNumber}>{order.orderNumber}</h2>
              <Badge variant={STATUS_BADGE_MAP[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
            </div>
            <p className={styles.serviceName}>{order.service?.title || 'Custom Order'}</p>

            <div className={styles.detailsGrid}>
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
                  <span className={styles.detailLabel}>Submitted On</span>
                  <span className={styles.detailValue}>{formatDate(order.completedAt)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Delivered On</span>
                  <span className={styles.detailValue}>{formatDate(order.deliveredAt)}</span>
                </div>
              )}
              {order.revisionCount > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Revisions</span>
                  <span className={styles.detailValue}>{order.revisionCount}</span>
                </div>
              )}
            </div>

            {order.startedAt && order.estimatedDelivery && (
              <OrderTimeline startedAt={order.startedAt} estimatedDelivery={order.estimatedDelivery} status={order.status} />
            )}
          </Card>

          {/* Deliverables */}
          {hasDeliverables && (
            <Card className={styles.section}>
              <h3 className={styles.sectionTitle}>Deliverables</h3>

              {order.githubUrl && (
                <a href={order.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                  <HiExternalLink /> View GitHub Repository
                </a>
              )}

              {order.orderDeliverables?.length > 0 && (
                <div className={styles.deliverablesGrid}>
                  {order.orderDeliverables.map((d) => (
                    <div key={d.id} className={styles.deliverableItem}>
                      {d.fileType === 'IMAGE' ? (
                        <a href={d.fileUrl} target="_blank" rel="noopener noreferrer">
                          <img src={d.fileUrl} alt={d.fileName} className={styles.deliverableImage} />
                        </a>
                      ) : (
                        <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
                          <HiDownload /> {d.fileName}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Approve / Revision Actions */}
          {isPendingApproval && (
            <Card className={styles.section}>
              <h3 className={styles.sectionTitle}>Review Deliverables</h3>
              {!confirmAction ? (
                <div className={styles.actionButtons}>
                  <Button onClick={() => setConfirmAction('approve')} className={styles.approveBtn}>
                    <HiCheckCircle /> Approve Project
                  </Button>
                  <Button variant="outline" onClick={() => setConfirmAction('revision')} className={styles.revisionBtn}>
                    <HiRefresh /> Request Revision
                  </Button>
                </div>
              ) : confirmAction === 'approve' ? (
                <div className={styles.confirmBox}>
                  <p>Are you sure you want to approve this project? This will mark the order as delivered.</p>
                  <div className={styles.confirmActions}>
                    <Button onClick={handleApprove} loading={approveOrder.isPending}>Yes, Approve</Button>
                    <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className={styles.confirmBox}>
                  <p>Are you sure you want to request a revision? The project will go back to In Progress.</p>
                  <div className={styles.confirmActions}>
                    <Button onClick={handleRevision} loading={requestRevision.isPending}>Yes, Request Revision</Button>
                    <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Review (when delivered) */}
          {isDelivered && <ReviewSection order={order} existingReview={existingReview} />}
        </div>

        {/* Sidebar: Chat */}
        <div className={styles.sidebar}>
          <OrderChat orderId={order.id} disabled={!isPendingApproval} />
        </div>
      </div>
    </div>
  );
}
