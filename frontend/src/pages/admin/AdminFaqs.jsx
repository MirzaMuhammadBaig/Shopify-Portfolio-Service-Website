import { useState } from 'react';
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '../../hooks/useFaqs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const EMPTY_FORM = { question: '', answer: '' };

export default function AdminFaqs() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { data, isLoading } = useFaqs({ limit: 50 });
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();
  const faqs = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (f) => {
    setEditingId(f.id);
    setForm({
      question: f.question || '',
      answer: f.answer || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFaq.mutateAsync({ id: editingId, data: form });
        toast.success('FAQ updated!');
      } else {
        await createFaq.mutateAsync(form);
        toast.success('FAQ created!');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try { await deleteFaq.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>FAQs</h1>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null)) : openCreate()}>
          {showForm ? 'Cancel' : 'Add FAQ'}
        </Button>
      </div>

      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Question" name="question" value={form.question} onChange={handleChange} required />
            <Input label="Answer" name="answer" type="textarea" value={form.answer} onChange={handleChange} required />
            <Button type="submit" loading={editingId ? updateFaq.isPending : createFaq.isPending}>
              {editingId ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </form>
        </Card>
      )}

      <div className={styles.list}>
        {faqs.map((f) => (
          <Card key={f.id} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.rowTitle}>{f.question}</span>
              <span className={styles.rowMeta}>
                {f.answer.length > 80 ? `${f.answer.slice(0, 80)}...` : f.answer}
              </span>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={f.isActive ? 'success' : 'neutral'}>
                {f.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(f)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(f.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
