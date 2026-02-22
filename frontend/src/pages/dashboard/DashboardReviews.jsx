import { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { useCreateReview } from '../../hooks/useReviews';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import { HiStar } from 'react-icons/hi';
import styles from './DashboardReviews.module.css';

export default function DashboardReviews() {
  const [form, setForm] = useState({ serviceId: '', rating: 5, comment: '' });
  const { data: servicesData } = useServices({ active: 'true', limit: 100 });
  const createReview = useCreateReview();
  const services = servicesData?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceId) { toast.error('Please select a service'); return; }

    try {
      await createReview.mutateAsync(form);
      toast.success('Review submitted!');
      setForm({ serviceId: '', rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Leave a Review</h1>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Service</label>
            <select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} className={styles.select}>
              <option value="">Select a service</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Rating</label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={styles.starBtn}>
                  <HiStar className={n <= form.rating ? styles.starFilled : styles.starEmpty} />
                </button>
              ))}
            </div>
          </div>
          <Input label="Comment" type="textarea" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience..." />
          <Button type="submit" loading={createReview.isPending}>Submit Review</Button>
        </form>
      </Card>
    </div>
  );
}
