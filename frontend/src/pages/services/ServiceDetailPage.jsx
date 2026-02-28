import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { useServiceBySlug } from '../../hooks/useServices';
import { useServiceReviews } from '../../hooks/useReviews';
import { useCreateOrder } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import styles from './ServiceDetailPage.module.css';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { data, isLoading } = useServiceBySlug(slug);
  const service = data?.data;
  const { data: reviewsData } = useServiceReviews(service?.id);
  const reviews = reviewsData?.data || [];
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const handleOrderNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const result = await createOrder.mutateAsync({
        serviceId: service.id,
        totalAmount: Number(service.price),
      });
      navigate(`/checkout/${result.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!service) return <div className="container section"><p>Service not found</p></div>;

  return (
    <section className="section">
      <div className="container">
        <Link to="/services" className={styles.backLink}><HiArrowLeft /> Back to Services</Link>
        <div className={styles.layout}>
          <div className={styles.main}>
            <h1 className={styles.title}>{service.title}</h1>
            <p className={styles.desc}>{service.description}</p>
            <h3 className={styles.subtitle}>What's Included</h3>
            <ul className={styles.features}>
              {(service.features || []).map((f, i) => (
                <li key={i} className={styles.feature}><HiCheckCircle className={styles.check} /> {f}</li>
              ))}
            </ul>
            {reviews.length > 0 && (
              <>
                <h3 className={styles.subtitle}>Client Reviews</h3>
                {reviews.map((r) => (
                  <div key={r.id} className={styles.review}>
                    <div className={styles.stars}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <HiStar key={i} style={{ color: i < r.rating ? '#FFB300' : '#2A2A4A' }} />
                      ))}
                    </div>
                    <p className={styles.comment}>{r.comment}</p>
                    <span className={styles.reviewer}>{r.user.firstName} {r.user.lastName}</span>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className={styles.sidebar}>
            <div className={styles.priceCard}>
              <span className={styles.priceLabel}>Starting at</span>
              <span className={styles.price}>{formatCurrency(service.price)}</span>
              <Button fullWidth onClick={handleOrderNow} loading={createOrder.isPending}>
                Order Now
              </Button>
              <Link to={user ? '/contact' : '/login'}><Button variant="outline" fullWidth>Get Custom Quote</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
