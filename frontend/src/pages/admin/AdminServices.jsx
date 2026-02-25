import { useState } from 'react';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../../hooks/useServices';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const EMPTY_FORM = { title: '', description: '', shortDesc: '', price: '', features: '' };

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { data, isLoading } = useServices({ limit: 50 });
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const services = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({
      title: s.title || '',
      description: s.description || '',
      shortDesc: s.shortDesc || '',
      price: s.price?.toString() || '',
      features: Array.isArray(s.features) ? s.features.join(', ') : '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await updateService.mutateAsync({ id: editingId, data: payload });
        toast.success('Service updated!');
      } else {
        await createService.mutateAsync(payload);
        toast.success('Service created!');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService.mutateAsync(id);
      toast.success('Service deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Services</h1>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null)) : openCreate()}>
          {showForm ? 'Cancel' : 'Add Service'}
        </Button>
      </div>

      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Short Description" name="shortDesc" value={form.shortDesc} onChange={handleChange} required />
            <Input label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} required />
            <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
            <Input label="Features (comma-separated)" name="features" value={form.features} onChange={handleChange} />
            <Button type="submit" loading={editingId ? updateService.isPending : createService.isPending}>
              {editingId ? 'Update Service' : 'Create Service'}
            </Button>
          </form>
        </Card>
      )}

      <div className={styles.list}>
        {services.map((s) => (
          <Card key={s.id} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.rowTitle}>{s.title}</span>
              <span className={styles.rowMeta}>{formatCurrency(s.price)}</span>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={s.isActive ? 'success' : 'neutral'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(s)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
