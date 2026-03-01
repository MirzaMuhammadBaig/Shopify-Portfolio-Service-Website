import { useState } from 'react';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '../../hooks/useTestimonials';
import { useAdminReviews, useAdminUpdateReview, useAdminDeleteReview, useToggleReviewVisibility } from '../../hooks/useReviews';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiStar } from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const EMPTY_FORM = { name: '', role: '', rating: '5', comment: '' };
const REVIEW_FORM = { rating: '5', comment: '' };

export default function AdminReviews() {
  const [activeTab, setActiveTab] = useState('reviews');

  // Testimonials state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { data: tData, isLoading: tLoading } = useTestimonials({ limit: 50 });
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const testimonials = tData?.data || [];

  // User Reviews state
  const [reviewPage, setReviewPage] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState(REVIEW_FORM);
  const { data: rData, isLoading: rLoading } = useAdminReviews({ page: reviewPage, limit: 20 });
  const adminUpdate = useAdminUpdateReview();
  const adminDelete = useAdminDeleteReview();
  const toggleVisibility = useToggleReviewVisibility();
  const reviews = rData?.data || [];
  const reviewMeta = rData?.meta;

  // Testimonial handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({ name: t.name || '', role: t.role || '', rating: t.rating?.toString() || '5', comment: t.comment || '' });
    setShowForm(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, rating: parseInt(form.rating, 10) };
    try {
      if (editingId) {
        await updateTestimonial.mutateAsync({ id: editingId, data: payload });
        toast.success('Testimonial updated!');
      } else {
        await createTestimonial.mutateAsync(payload);
        toast.success('Testimonial created!');
      }
      setForm(EMPTY_FORM); setEditingId(null); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await deleteTestimonial.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  // Review handlers
  const openReviewEdit = (r) => {
    setEditingReview(r.id);
    setReviewForm({ rating: r.rating?.toString() || '5', comment: r.comment || '' });
  };
  const handleReviewUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminUpdate.mutateAsync({ id: editingReview, data: { rating: parseInt(reviewForm.rating, 10), comment: reviewForm.comment } });
      toast.success('Review updated');
      setEditingReview(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleReviewDelete = async (id) => {
    if (!window.confirm('Delete this user review?')) return;
    try { await adminDelete.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };
  const handleToggleVisibility = async (id) => {
    try { await toggleVisibility.mutateAsync(id); toast.success('Visibility toggled'); } catch { toast.error('Failed'); }
  };

  const Stars = ({ rating }) => (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <HiStar key={i} style={{ color: i < rating ? '#FFB300' : '#2A2A4A' }} />
      ))}
    </div>
  );

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Reviews & Testimonials</h1>
      </div>

      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${activeTab === 'reviews' ? styles.filterActive : ''}`} onClick={() => setActiveTab('reviews')}>
          User Reviews
        </button>
        <button className={`${styles.filterBtn} ${activeTab === 'testimonials' ? styles.filterActive : ''}`} onClick={() => setActiveTab('testimonials')}>
          Testimonials
        </button>
      </div>

      {activeTab === 'testimonials' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null)) : openCreate()}>
              {showForm ? 'Cancel' : 'Add Testimonial'}
            </Button>
          </div>
          {showForm && (
            <Card className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
                <Input label="Role / Company" name="role" value={form.role} onChange={handleChange} />
                <Input label="Rating (1-5)" name="rating" type="number" value={form.rating} onChange={handleChange} required />
                <Input label="Comment" name="comment" type="textarea" value={form.comment} onChange={handleChange} required />
                <Button type="submit" loading={editingId ? updateTestimonial.isPending : createTestimonial.isPending}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </form>
            </Card>
          )}
          {tLoading ? <LoadingSpinner /> : (
            <div className={styles.list}>
              {testimonials.map((t) => (
                <Card key={t.id} className={styles.row}>
                  <div className={styles.rowMain}>
                    <div>
                      <span className={styles.rowTitle}>{t.name}</span>
                      {t.role && <span className={styles.rowMeta}> — {t.role}</span>}
                      <p className={styles.rowMeta}>{t.comment?.length > 80 ? `${t.comment.slice(0, 80)}...` : t.comment}</p>
                    </div>
                    <Stars rating={t.rating} />
                  </div>
                  <div className={styles.rowActions}>
                    <Badge variant={t.isActive ? 'success' : 'neutral'}>{t.isActive ? 'Active' : 'Inactive'}</Badge>
                    <Button size="sm" variant="outline" onClick={() => openEdit(t)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteTestimonial(t.id)}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'reviews' && (
        <>
          {rLoading ? <LoadingSpinner /> : (
            <div className={styles.list}>
              {reviews.map((r) => (
                <Card key={r.id} className={styles.row}>
                  {editingReview === r.id ? (
                    <form onSubmit={handleReviewUpdate} className={styles.form}>
                      <Input label="Rating (1-5)" name="rating" type="number" value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} required />
                      <Input label="Comment" name="comment" type="textarea" value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button type="submit" size="sm" loading={adminUpdate.isPending}>Save</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditingReview(null)}>Cancel</Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className={styles.rowMain}>
                        <div>
                          <span className={styles.rowTitle}>{r.user?.firstName} {r.user?.lastName}</span>
                          <span className={styles.rowMeta}> — {r.user?.email}</span>
                          <p className={styles.rowMeta}>{r.service?.title} · {formatDate(r.createdAt)}</p>
                          {r.comment && <p className={styles.rowMeta} style={{ marginTop: 4 }}>{r.comment.length > 120 ? `${r.comment.slice(0, 120)}...` : r.comment}</p>}
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      <div className={styles.rowActions}>
                        <Badge variant={r.isVisible ? 'success' : 'neutral'}>{r.isVisible ? 'Visible' : 'Hidden'}</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleToggleVisibility(r.id)}>
                          {r.isVisible ? 'Hide' : 'Show'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openReviewEdit(r)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleReviewDelete(r.id)}>Delete</Button>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
          {reviewMeta && reviewMeta.totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: reviewMeta.totalPages }, (_, i) => (
                <button key={i} onClick={() => setReviewPage(i + 1)} className={`${styles.pageBtn} ${reviewPage === i + 1 ? styles.active : ''}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
