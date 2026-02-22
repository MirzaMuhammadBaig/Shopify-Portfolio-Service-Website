import { useReviews } from '../../hooks/useReviews';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { HiStar } from 'react-icons/hi';
import { getInitials } from '../../utils/formatters';
import { REVIEWS_DATA } from '../../constants/static-data';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const { data, isLoading } = useReviews({ limit: 6 });
  const reviews = data?.data?.length ? data.data : (isLoading ? [] : REVIEWS_DATA);

  if (isLoading || !reviews.length) return null;

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          tag="Testimonials"
          title="What Our Clients Say"
          description="Real feedback from businesses we've helped grow with Shopify."
        />
        <div className={styles.grid}>
          {reviews.map((review, index) => (
            <ScrollReveal key={review.id || index} delay={index * 0.1}>
              <Card className={styles.card}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <HiStar key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty} />
                  ))}
                </div>
                {review.comment && <p className={styles.comment}>{review.comment}</p>}
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    {getInitials(review.user?.firstName || review.name, review.user?.lastName || '')}
                  </div>
                  <div>
                    <p className={styles.name}>
                      {review.user ? `${review.user.firstName} ${review.user.lastName}` : review.name}
                    </p>
                    {review.role && <p className={styles.role}>{review.role}</p>}
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
