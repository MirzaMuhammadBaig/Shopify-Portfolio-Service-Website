import { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { useCreateReview, useMyReviews, useUpdateReview } from '../../hooks/useReviews';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { HiStar } from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';
import styles from './DashboardReviews.module.css';

export default function DashboardReviews() {
  const [form, setForm] = useState({ serviceId: '', rating: 5, comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const { data: servicesData } = useServices({ active: 'true', limit: 100 });
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const { data: myData } = useMyReviews({ limit: 50 });
  const services = servicesData?.data || [];
  const myReviews = myData?.data || [];

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

  const openEdit = (r) => {
    setEditingId(r.id);
    setEditForm({ rating: r.rating, comment: r.comment || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReview.mutateAsync({ id: editingId, data: editForm });
      toast.success('Review updated!');
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
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

      {myReviews.length > 0 && (
        <>
          <h2 className={styles.subtitle}>My Reviews</h2>
          <div className={styles.reviewList}>
            {myReviews.map((r) => (
              <Card key={r.id} className={styles.reviewCard}>
                {editingId === r.id ? (
                  <form onSubmit={handleEditSubmit} className={styles.form}>
                    <div className={styles.field}>
                      <label className={styles.label}>Rating</label>
                      <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} type="button" onClick={() => setEditForm({ ...editForm, rating: n })} className={styles.starBtn}>
                            <HiStar className={n <= editForm.rating ? styles.starFilled : styles.starEmpty} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input label="Comment" type="textarea" value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type="submit" size="sm" loading={updateReview.isPending}>Save</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewService}>{r.service?.title}</span>
                      <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <HiStar key={n} style={{ color: n <= r.rating ? '#FFB300' : '#2A2A4A', fontSize: '1rem' }} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
                    <div className={styles.reviewFooter}>
                      <span className={styles.reviewDate}>{formatDate(r.createdAt)}</span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {r.editCount >= 1 ? (
                          <Badge variant="neutral">Already edited</Badge>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
