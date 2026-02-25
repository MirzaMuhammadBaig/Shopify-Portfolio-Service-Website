import { useState, useRef } from 'react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const EMPTY_FORM = { title: '', category: '', description: '', tags: '', liveUrl: '', results: '' };

export default function AdminProjects() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { data, isLoading } = useProjects({ limit: 50 });
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const projects = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    clearImage();
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || '',
      category: p.category || '',
      description: p.description || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      liveUrl: p.liveUrl || '',
      results: Array.isArray(p.results) ? p.results.join(', ') : '',
    });
    clearImage();
    setImagePreview(p.image || null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      liveUrl: form.liveUrl || undefined,
      results: form.results.split(',').map((r) => r.trim()).filter(Boolean),
    };
    if (imageFile) payload.image = imageFile;
    try {
      if (editingId) {
        await updateProject.mutateAsync({ id: editingId, data: payload });
        toast.success('Project updated!');
      } else {
        await createProject.mutateAsync(payload);
        toast.success('Project created!');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      clearImage();
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null), clearImage()) : openCreate()}>
          {showForm ? 'Cancel' : 'Add Project'}
        </Button>
      </div>

      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Category" name="category" value={form.category} onChange={handleChange} required />
            <Input label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} required />
            <Input label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} />
            <Input label="Live URL" name="liveUrl" value={form.liveUrl} onChange={handleChange} />
            <Input label="Results (comma-separated)" name="results" value={form.results} onChange={handleChange} />

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Project Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageChange}
                style={{
                  display: 'block',
                  padding: '10px 14px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                  fontSize: '0.85rem',
                  width: '100%',
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: 12, position: 'relative', display: 'inline-block' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: 200,
                      maxHeight: 140,
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#FF5F57',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <Button type="submit" loading={editingId ? updateProject.isPending : createProject.isPending}>
              {editingId ? 'Update Project' : 'Create Project'}
            </Button>
          </form>
        </Card>
      )}

      <div className={styles.list}>
        {projects.map((p) => (
          <Card key={p.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--color-border)' }}
                  />
                )}
                <div>
                  <span className={styles.rowTitle}>{p.title}</span>
                  <span className={styles.rowMeta}> — {p.category}</span>
                </div>
              </div>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={p.isActive ? 'success' : 'neutral'}>
                {p.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
