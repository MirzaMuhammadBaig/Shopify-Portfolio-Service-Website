import { useState } from 'react';
import { useServices, useCreateService, useDeleteService } from '../../hooks/useServices';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', shortDesc: '', price: '', features: '' });
  const { data, isLoading } = useServices({ limit: 50 });
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const services = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createService.mutateAsync({
        ...form,
        price: parseFloat(form.price),
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      });
      toast.success('Service created!');
      setForm({ title: '', description: '', shortDesc: '', price: '', features: '' });
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
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
        <Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add Service'}</Button>
      </div>

      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Short Description" name="shortDesc" value={form.shortDesc} onChange={handleChange} required />
            <Input label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} required />
            <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
            <Input label="Features (comma-separated)" name="features" value={form.features} onChange={handleChange} />
            <Button type="submit" loading={createService.isPending}>Create Service</Button>
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
              <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
