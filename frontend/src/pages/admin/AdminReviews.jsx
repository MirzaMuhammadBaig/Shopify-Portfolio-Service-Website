import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../../services/review.service';
import { useDeleteReview } from '../../hooks/useReviews';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

export default function AdminReviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: () => reviewService.getAll({ limit: 50 }).then((r) => r.data),
  });
  const deleteReview = useDeleteReview();
  const reviews = data?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await deleteReview.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.title}>Reviews</h1>
      <div className={styles.list}>
        {reviews.map((r) => (
          <Card key={r.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div>
                <span className={styles.rowTitle}>{r.user.firstName} {r.user.lastName}</span>
                <p className={styles.rowMeta}>{r.service?.title} - {r.comment?.slice(0, 80)}</p>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <HiStar key={i} style={{ color: i < r.rating ? '#FFB300' : '#2A2A4A' }} />
                ))}
              </div>
            </div>
            <div className={styles.rowActions}>
              <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
