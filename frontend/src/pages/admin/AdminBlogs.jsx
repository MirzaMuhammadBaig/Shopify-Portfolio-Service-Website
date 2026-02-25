import { useState } from 'react';
import { useBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from '../../hooks/useBlogs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const EMPTY_FORM = { title: '', content: '', excerpt: '', metaTitle: '', metaDesc: '', isPublished: false };

export default function AdminBlogs() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { data, isLoading } = useBlogs({ limit: 50 });
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();
  const posts = data?.data || [];

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || '',
      content: p.content || '',
      excerpt: p.excerpt || '',
      metaTitle: p.metaTitle || '',
      metaDesc: p.metaDesc || '',
      isPublished: p.isPublished || false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBlog.mutateAsync({ id: editingId, data: form });
        toast.success('Blog post updated!');
      } else {
        await createBlog.mutateAsync(form);
        toast.success('Blog post created!');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try { await deleteBlog.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog Posts</h1>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null)) : openCreate()}>
          {showForm ? 'Cancel' : 'New Post'}
        </Button>
      </div>
      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} />
            <Input label="Content" name="content" type="textarea" value={form.content} onChange={handleChange} required />
            <Input label="Meta Title" name="metaTitle" value={form.metaTitle} onChange={handleChange} />
            <Input label="Meta Description" name="metaDesc" value={form.metaDesc} onChange={handleChange} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} /> Publish immediately
            </label>
            <Button type="submit" loading={editingId ? updateBlog.isPending : createBlog.isPending}>
              {editingId ? 'Update Post' : 'Create Post'}
            </Button>
          </form>
        </Card>
      )}
      <div className={styles.list}>
        {posts.map((p) => (
          <Card key={p.id} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.rowTitle}>{p.title}</span>
              <span className={styles.rowMeta}>{formatDate(p.createdAt)}</span>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={p.isPublished ? 'success' : 'warning'}>{p.isPublished ? 'Published' : 'Draft'}</Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
