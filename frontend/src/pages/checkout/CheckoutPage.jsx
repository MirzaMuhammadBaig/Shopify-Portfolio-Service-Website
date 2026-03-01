import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiClipboardCopy, HiCheckCircle, HiPhotograph, HiX } from 'react-icons/hi';
import { useOrderById } from '../../hooks/useOrders';
import {
  usePaymentMethods,
  useCreateManualPayment,
  useCreateSafepaySession,
  usePaymentByOrder,
} from '../../hooks/usePayments';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: orderData, isLoading: orderLoading } = useOrderById(orderId);
  const { data: methodsData, isLoading: methodsLoading } = usePaymentMethods();
  const { data: paymentData } = usePaymentByOrder(orderId);
  const createManual = useCreateManualPayment();
  const createSafepay = useCreateSafepaySession();
  const fileInputRef = useRef(null);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copied, setCopied] = useState('');

  const order = orderData?.data;
  const methods = methodsData?.data?.methods || [];
  const existingPayment = paymentData?.data;

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Screenshot must be under 5MB');
      return;
    }
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Please enter the transaction ID');
      return;
    }
    if (!screenshot) {
      toast.error('Please upload a transaction screenshot');
      return;
    }
    try {
      await createManual.mutateAsync({
        orderId,
        method: selectedMethod,
        transactionId: transactionId.trim(),
        screenshot,
      });
      toast.success('Payment submitted! We will verify it shortly.');
      navigate('/dashboard/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    }
  };

  const handleSafepayPayment = async () => {
    try {
      const result = await createSafepay.mutateAsync({ orderId });
      if (result.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error('Failed to create payment session');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create payment session');
    }
  };

  if (orderLoading || methodsLoading) return <LoadingSpinner />;
  if (!order) return <div className="container section"><p>Order not found</p></div>;

  const selectedMethodData = methods.find((m) => m.id === selectedMethod);

  if (existingPayment?.status === 'PAID') {
    return (
      <section className="section">
        <div className="container">
          <div className={styles.successWrap}>
            <HiCheckCircle className={styles.successIcon} />
            <h2>Payment Confirmed</h2>
            <p className={styles.successText}>Your payment has been verified. Thank you!</p>
            <Link to="/dashboard/orders"><Button>View Orders</Button></Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <Link to="/dashboard/orders" className={styles.backLink}>
          <HiArrowLeft /> Back to Orders
        </Link>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.main}>
            {existingPayment?.status === 'PENDING' && (
              <div className={styles.pendingNotice}>
                <Badge variant="warning">Payment Pending Verification</Badge>
                <p>Your previous payment (Transaction: {existingPayment.transactionId}) is being reviewed. You can update it below if needed.</p>
              </div>
            )}

            <h3 className={styles.subtitle}>Select Payment Method</h3>
            <div className={styles.methods}>
              {methods.map((method) => (
                <div
                  key={method.id}
                  className={`${styles.methodCard} ${selectedMethod === method.id ? styles.methodActive : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className={styles.methodHeader}>
                    <div className={`${styles.radio} ${selectedMethod === method.id ? styles.radioActive : ''}`} />
                    <span className={styles.methodName}>{method.name}</span>
                    {method.type === 'manual' && <Badge variant="neutral">Manual</Badge>}
                    {method.type === 'automated' && <Badge variant="primary">Auto</Badge>}
                  </div>
                </div>
              ))}
            </div>

            {selectedMethodData && selectedMethodData.type === 'manual' && (
              <Card hover={false} className={styles.detailsCard}>
                <h4 className={styles.detailsTitle}>Payment Details</h4>
                <p className={styles.instructions}>{selectedMethodData.instructions}</p>

                {selectedMethodData.accountName && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Account Name</span>
                    <div className={styles.detailValue}>
                      <span>{selectedMethodData.accountName}</span>
                      <button className={styles.copyBtn} onClick={() => handleCopy(selectedMethodData.accountName, 'name')}>
                        {copied === 'name' ? <HiCheckCircle /> : <HiClipboardCopy />}
                      </button>
                    </div>
                  </div>
                )}
                {selectedMethodData.email && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Payoneer Email</span>
                    <div className={styles.detailValue}>
                      <span>{selectedMethodData.email}</span>
                      <button className={styles.copyBtn} onClick={() => handleCopy(selectedMethodData.email, 'email')}>
                        {copied === 'email' ? <HiCheckCircle /> : <HiClipboardCopy />}
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleManualSubmit} className={styles.form}>
                  <Input
                    label="Transaction ID / Reference"
                    placeholder="Enter the transaction ID from your payment"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />

                  <div className={styles.uploadGroup}>
                    <label className={styles.uploadLabel}>Transaction Screenshot</label>
                    {previewUrl ? (
                      <div className={styles.previewWrap}>
                        <img src={previewUrl} alt="Screenshot" className={styles.preview} />
                        <button type="button" className={styles.removeBtn} onClick={removeScreenshot}>
                          <HiX />
                        </button>
                      </div>
                    ) : (
                      <label className={styles.uploadArea} htmlFor="screenshot-input">
                        <HiPhotograph className={styles.uploadIcon} />
                        <span>Click to upload screenshot</span>
                        <span className={styles.uploadHint}>JPEG, PNG or WebP (max 5MB)</span>
                      </label>
                    )}
                    <input
                      ref={fileInputRef}
                      id="screenshot-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                    />
                  </div>

                  <Button type="submit" fullWidth loading={createManual.isPending}>
                    Submit Payment
                  </Button>
                </form>
              </Card>
            )}

            {selectedMethodData && selectedMethodData.type === 'automated' && (
              <Card hover={false} className={styles.detailsCard}>
                <h4 className={styles.detailsTitle}>Pay with Card / Wallet via Safepay</h4>
                <p className={styles.instructions}>{selectedMethodData.instructions}</p>
                <Button fullWidth onClick={handleSafepayPayment} loading={createSafepay.isPending}>
                  Pay {formatCurrency(order.totalAmount)}
                </Button>
              </Card>
            )}
          </div>

          <div className={styles.sidebar}>
            <Card hover={false} className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span>Service</span>
                <span className={styles.summaryValue}>{order.service?.title || 'Custom Order'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Order #</span>
                <span className={styles.summaryValue}>{order.orderNumber}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalPrice}>{formatCurrency(order.totalAmount)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
