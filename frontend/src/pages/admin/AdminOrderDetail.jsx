import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderById, useSubmitDeliverables } from '../../hooks/useOrders';
import OrderChat from '../../components/shared/OrderChat';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiArrowLeft, HiExternalLink, HiDownload, HiUpload, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import styles from './AdminOrderDetail.module.css';

const STATUS_BADGE_MAP = {
  PENDING: 'warning',
  IN_PROGRESS: 'primary',
  PENDING_APPROVAL: 'warning',
  DELIVERED: 'success',
};

function DeliveryForm({ orderId }) {
  const [files, setFiles] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const fileInputRef = useRef(null);
  const submitDeliverables = useSubmitDeliverables();

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const total = files.length + selected.length;
    if (total > 3) {
      toast.error('Maximum 3 files allowed');
      return;
    }
    for (const f of selected) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 10MB limit`);
        return;
      }
      const isImage = f.type.startsWith('image/');
      const isPdf = f.type === 'application/pdf';
      if (!isImage && !isPdf) {
        toast.error(`${f.name}: Only images and PDFs allowed`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please upload at least 1 file');
      return;
    }
    if (!githubUrl.trim()) {
      toast.error('GitHub URL is required');
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    formData.append('githubUrl', githubUrl.trim());

    try {
      await submitDeliverables.mutateAsync({ id: orderId, formData });
      toast.success('Deliverables submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit deliverables');
    }
  };

  return (
    <Card className={styles.section}>
      <h3 className={styles.sectionTitle}>Submit Deliverables</h3>
      <form onSubmit={handleSubmit} className={styles.deliveryForm}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Files (1-3, images or PDFs, max 10MB each)</label>
          <div
            className={styles.dropZone}
            onClick={() => fileInputRef.current?.click()}
          >
            <HiUpload className={styles.dropZoneIcon} />
            <p className={styles.dropZoneText}>Click to upload files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
          </div>
          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((f, i) => (
                <div key={i} className={styles.fileItem}>
                  {f.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(f)} alt={f.name} className={styles.filePreview} />
                  ) : (
                    <span className={styles.pdfIcon}>PDF</span>
                  )}
                  <span className={styles.fileName}>{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className={styles.removeFileBtn}>
                    <HiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel}>GitHub Repository URL *</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className={styles.textInput}
            required
          />
        </div>

        <Button type="submit" loading={submitDeliverables.isPending} disabled={files.length === 0 || !githubUrl.trim()}>
          Submit Deliverables
        </Button>
      </form>
    </Card>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { data, isLoading } = useOrderById(id);
  const order = data?.data;

  if (isLoading) return <LoadingSpinner />;
  if (!order) return <p>Order not found.</p>;

  const isInProgress = order.status === ORDER_STATUS.IN_PROGRESS;
  const isPendingApproval = order.status === ORDER_STATUS.PENDING_APPROVAL;
  const isDelivered = order.status === ORDER_STATUS.DELIVERED;
  const hasDeliverables = order.orderDeliverables?.length > 0 || order.githubUrl;

  return (
    <div>
      <Link to="/admin/orders" className={styles.backLink}>
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
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>{order.user?.firstName} {order.user?.lastName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{order.user?.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Amount</span>
                <span className={styles.detailValue}>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Ordered On</span>
                <span className={styles.detailValue}>{formatDate(order.createdAt)}</span>
              </div>
              {order.startedAt && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Started On</span>
                  <span className={styles.detailValue}>{formatDate(order.startedAt)}</span>
                </div>
              )}
              {order.estimatedDelivery && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Est. Delivery</span>
                  <span className={styles.detailValue}>{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
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
          </Card>

          {/* Delivery Form (when IN_PROGRESS) */}
          {isInProgress && <DeliveryForm orderId={order.id} />}

          {/* Deliverables View (when submitted) */}
          {hasDeliverables && (isPendingApproval || isDelivered) && (
            <Card className={styles.section}>
              <h3 className={styles.sectionTitle}>Submitted Deliverables</h3>

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

          {/* Status info for delivered */}
          {isDelivered && (
            <Card className={styles.section}>
              <div className={styles.deliveredBanner}>
                <h3 className={styles.sectionTitle}>Order Delivered</h3>
                <p className={styles.deliveredText}>This order has been approved by the customer and is now complete.</p>
              </div>
            </Card>
          )}

          {isPendingApproval && (
            <Card className={styles.section}>
              <div className={styles.awaitingBanner}>
                <h3 className={styles.sectionTitle}>Awaiting Customer Approval</h3>
                <p className={styles.awaitingText}>The customer is reviewing the deliverables. They can approve or request a revision.</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar: Chat */}
        <div className={styles.sidebar}>
          <OrderChat orderId={order.id} disabled={!isPendingApproval} />
        </div>
      </div>
    </div>
  );
}
