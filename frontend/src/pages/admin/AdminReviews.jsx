import { useState } from 'react';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '../../hooks/useTestimonials';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const EMPTY_FORM = { name: '', role: '', rating: '5', comment: '' };

export default function AdminReviews() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { data, isLoading } = useTestimonials({ limit: 50 });
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const testimonials = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name || '',
      role: t.role || '',
      rating: t.rating?.toString() || '5',
      comment: t.comment || '',
    });
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
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await deleteTestimonial.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Reviews / Testimonials</h1>
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
              {editingId ? 'Update Testimonial' : 'Create Testimonial'}
            </Button>
          </form>
        </Card>
      )}

      <div className={styles.list}>
        {testimonials.map((t) => (
          <Card key={t.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div>
                <span className={styles.rowTitle}>{t.name}</span>
                {t.role && <span className={styles.rowMeta}> — {t.role}</span>}
                <p className={styles.rowMeta}>{t.comment?.length > 80 ? `${t.comment.slice(0, 80)}...` : t.comment}</p>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <HiStar key={i} style={{ color: i < t.rating ? '#FFB300' : '#2A2A4A' }} />
                ))}
              </div>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={t.isActive ? 'success' : 'neutral'}>
                {t.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(t)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
