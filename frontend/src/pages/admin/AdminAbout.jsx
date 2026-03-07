import { useState, useRef } from 'react';
import {
  useAboutStats, useCreateStat, useUpdateStat, useDeleteStat,
  useAboutStory, useUpsertStory,
  useAboutExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience,
  useAboutMembers, useCreateMember, useUpdateMember, useDeleteMember,
  useAboutCertificates, useCreateCertificate, useUpdateCertificate, useDeleteCertificate,
} from '../../hooks/useAbout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const TABS = ['Stats', 'Story', 'Experience', 'Team', 'Certificates'];

// ═══════════════════════════════════════════════════════════
// Stats Section
// ═══════════════════════════════════════════════════════════
function StatsSection() {
  const EMPTY = { label: '', value: '', suffix: '+', sortOrder: '0' };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const { data, isLoading } = useAboutStats();
  const create = useCreateStat();
  const update = useUpdateStat();
  const del = useDeleteStat();
  const stats = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setEditingId(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (s) => { setEditingId(s.id); setForm({ label: s.label, value: String(s.value), suffix: s.suffix || '+', sortOrder: String(s.sortOrder || 0) }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { label: form.label, value: parseInt(form.value), suffix: form.suffix, sortOrder: parseInt(form.sortOrder) };
    try {
      if (editingId) { await update.mutateAsync({ id: editingId, data: payload }); toast.success('Stat updated!'); }
      else { await create.mutateAsync(payload); toast.success('Stat created!'); }
      setForm(EMPTY); setEditingId(null); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stat?')) return;
    try { await del.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Dashboard Stats</h2>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null)) : openCreate()}>
          {showForm ? 'Cancel' : 'Add Stat'}
        </Button>
      </div>
      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Label (e.g., Projects Delivered)" name="label" value={form.label} onChange={handleChange} required />
            <Input label="Value (number)" name="value" type="number" value={form.value} onChange={handleChange} required />
            <Input label="Suffix (e.g., +)" name="suffix" value={form.suffix} onChange={handleChange} />
            <Input label="Sort Order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} />
            <Button type="submit" loading={create.isPending || update.isPending}>{editingId ? 'Update' : 'Create'}</Button>
          </form>
        </Card>
      )}
      <div className={styles.list}>
        {stats.map((s) => (
          <Card key={s.id} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.rowTitle}>{s.value}{s.suffix}</span>
              <span className={styles.rowMeta}> — {s.label}</span>
            </div>
            <div className={styles.rowActions}>
              <Button size="sm" variant="outline" onClick={() => openEdit(s)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {stats.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 20 }}>No stats yet. Add your first stat.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Story Section
// ═══════════════════════════════════════════════════════════
function StorySection() {
  const { data, isLoading } = useAboutStory();
  const upsert = useUpsertStory();
  const [form, setForm] = useState({ title: '', content: '', highlights: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const story = data?.data;
  if (story && !loaded) {
    setForm({
      title: story.title || 'Our Story',
      content: story.content || '',
      highlights: Array.isArray(story.highlights) ? story.highlights.join('\n') : '',
    });
    if (story.teamImage) setImagePreview(story.teamImage);
    setLoaded(true);
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      content: form.content,
      highlights: form.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
    };
    if (imageFile) payload.image = imageFile;
    try {
      await upsert.mutateAsync(payload);
      toast.success('Story saved!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className={styles.title}>Our Story</h2>
      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Title" name="title" value={form.title} onChange={handleChange} />
          <Input label="Content" name="content" type="textarea" value={form.content} onChange={handleChange} required />
          <Input label="Highlights (one per line)" name="highlights" type="textarea" value={form.highlights} onChange={handleChange} />
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Team Photo</label>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImageChange}
              style={{ display: 'block', padding: '10px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)', fontSize: '0.85rem', width: '100%' }}
            />
            {imagePreview && (
              <div style={{ marginTop: 12 }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, maxHeight: 140, borderRadius: 8, border: '1px solid var(--color-border)', objectFit: 'cover' }} />
              </div>
            )}
          </div>
          <Button type="submit" loading={upsert.isPending}>Save Story</Button>
        </form>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Experience Section
// ═══════════════════════════════════════════════════════════
function ExperienceSection() {
  const EMPTY = { year: '', title: '', description: '', sortOrder: '0' };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const { data, isLoading } = useAboutExperiences();
  const create = useCreateExperience();
  const update = useUpdateExperience();
  const del = useDeleteExperience();
  const items = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openCreate = () => { setEditingId(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (item) => { setEditingId(item.id); setForm({ year: item.year, title: item.title, description: item.description, sortOrder: String(item.sortOrder || 0) }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, sortOrder: parseInt(form.sortOrder) };
    try {
      if (editingId) { await update.mutateAsync({ id: editingId, data: payload }); toast.success('Updated!'); }
      else { await create.mutateAsync(payload); toast.success('Created!'); }
      setForm(EMPTY); setEditingId(null); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try { await del.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Experience & Journey</h2>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null)) : openCreate()}>
          {showForm ? 'Cancel' : 'Add Experience'}
        </Button>
      </div>
      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Year (e.g., 2024 - Present)" name="year" value={form.year} onChange={handleChange} required />
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} required />
            <Input label="Sort Order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} />
            <Button type="submit" loading={create.isPending || update.isPending}>{editingId ? 'Update' : 'Create'}</Button>
          </form>
        </Card>
      )}
      <div className={styles.list}>
        {items.map((item) => (
          <Card key={item.id} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.rowTitle}>{item.title}</span>
              <span className={styles.rowMeta}> — {item.year}</span>
            </div>
            <div className={styles.rowActions}>
              <Button size="sm" variant="outline" onClick={() => openEdit(item)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 20 }}>No experience entries yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Team Section
// ═══════════════════════════════════════════════════════════
function TeamSection() {
  const EMPTY = { name: '', role: '', specialty: '', experience: '', sortOrder: '0' };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const { data, isLoading } = useAboutMembers();
  const create = useCreateMember();
  const update = useUpdateMember();
  const del = useDeleteMember();
  const members = data?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; };

  const openCreate = () => { setEditingId(null); setForm(EMPTY); clearImage(); setShowForm(true); };
  const openEdit = (m) => {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, specialty: m.specialty, experience: m.experience, sortOrder: String(m.sortOrder || 0) });
    clearImage();
    setImagePreview(m.image || null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, sortOrder: parseInt(form.sortOrder) };
    if (imageFile) payload.image = imageFile;
    try {
      if (editingId) { await update.mutateAsync({ id: editingId, data: payload }); toast.success('Member updated!'); }
      else { await create.mutateAsync(payload); toast.success('Member created!'); }
      setForm(EMPTY); setEditingId(null); clearImage(); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member? This will also delete their certificates.')) return;
    try { await del.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Team Members</h2>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null), clearImage()) : openCreate()}>
          {showForm ? 'Cancel' : 'Add Member'}
        </Button>
      </div>
      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Role" name="role" value={form.role} onChange={handleChange} required />
            <Input label="Specialty" name="specialty" value={form.specialty} onChange={handleChange} required />
            <Input label="Experience" name="experience" type="textarea" value={form.experience} onChange={handleChange} required />
            <Input label="Sort Order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} />
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Photo</label>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImageChange}
                style={{ display: 'block', padding: '10px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)', fontSize: '0.85rem', width: '100%' }}
              />
              {imagePreview && (
                <div style={{ marginTop: 12, position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: '50%', border: '1px solid var(--color-border)', objectFit: 'cover' }} />
                  <button type="button" onClick={clearImage} style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: '#FF5F57', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
                </div>
              )}
            </div>
            <Button type="submit" loading={create.isPending || update.isPending}>{editingId ? 'Update' : 'Create'}</Button>
          </form>
        </Card>
      )}
      <div className={styles.list}>
        {members.map((m) => (
          <Card key={m.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {m.image && <img src={m.image} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} />}
                <div>
                  <span className={styles.rowTitle}>{m.name}</span>
                  <span className={styles.rowMeta}> — {m.role}</span>
                </div>
              </div>
            </div>
            <div className={styles.rowActions}>
              <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(m.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {members.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 20 }}>No team members yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Certificates Section
// ═══════════════════════════════════════════════════════════
function CertificatesSection() {
  const EMPTY = { title: '', issuer: '', year: '', description: '', memberId: '', sortOrder: '0' };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const { data, isLoading } = useAboutCertificates();
  const { data: membersData } = useAboutMembers();
  const create = useCreateCertificate();
  const update = useUpdateCertificate();
  const del = useDeleteCertificate();
  const certs = data?.data || [];
  const members = membersData?.data || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; };

  const openCreate = () => { setEditingId(null); setForm(EMPTY); clearImage(); setShowForm(true); };
  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ title: c.title, issuer: c.issuer, year: c.year, description: c.description || '', memberId: c.memberId, sortOrder: String(c.sortOrder || 0) });
    clearImage();
    setImagePreview(c.image || null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, sortOrder: parseInt(form.sortOrder) };
    if (imageFile) payload.image = imageFile;
    try {
      if (editingId) { await update.mutateAsync({ id: editingId, data: payload }); toast.success('Certificate updated!'); }
      else { await create.mutateAsync(payload); toast.success('Certificate created!'); }
      setForm(EMPTY); setEditingId(null); clearImage(); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try { await del.mutateAsync(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Certificates</h2>
        <Button size="sm" onClick={() => showForm ? (setShowForm(false), setEditingId(null), clearImage()) : openCreate()}>
          {showForm ? 'Cancel' : 'Add Certificate'}
        </Button>
      </div>
      {showForm && (
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Issuer" name="issuer" value={form.issuer} onChange={handleChange} required />
            <Input label="Year" name="year" value={form.year} onChange={handleChange} required />
            <Input label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} />
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Team Member</label>
              <select name="memberId" value={form.memberId} onChange={handleChange} required
                className={styles.select}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)', fontSize: '0.85rem' }}
              >
                <option value="">Select team member...</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
              </select>
            </div>
            <Input label="Sort Order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} />
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Certificate Image</label>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImageChange}
                style={{ display: 'block', padding: '10px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)', fontSize: '0.85rem', width: '100%' }}
              />
              {imagePreview && (
                <div style={{ marginTop: 12, position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, maxHeight: 140, borderRadius: 8, border: '1px solid var(--color-border)', objectFit: 'cover' }} />
                  <button type="button" onClick={clearImage} style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: '#FF5F57', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
                </div>
              )}
            </div>
            <Button type="submit" loading={create.isPending || update.isPending}>{editingId ? 'Update' : 'Create'}</Button>
          </form>
        </Card>
      )}
      <div className={styles.list}>
        {certs.map((c) => (
          <Card key={c.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {c.image && <img src={c.image} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--color-border)' }} />}
                <div>
                  <span className={styles.rowTitle}>{c.title}</span>
                  <span className={styles.rowMeta}> — {c.issuer} ({c.year})</span>
                  {c.member && <span className={styles.rowMeta} style={{ display: 'block', fontSize: '0.75rem' }}>{c.member.name}</span>}
                </div>
              </div>
            </div>
            <div className={styles.rowActions}>
              <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {certs.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 20 }}>No certificates yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Main AdminAbout Page
// ═══════════════════════════════════════════════════════════
export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState('Stats');

  return (
    <div>
      <h1 className={styles.title} style={{ marginBottom: 20 }}>About Us Management</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: activeTab === tab ? 'none' : '1px solid var(--color-border)',
              background: activeTab === tab ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Stats' && <StatsSection />}
      {activeTab === 'Story' && <StorySection />}
      {activeTab === 'Experience' && <ExperienceSection />}
      {activeTab === 'Team' && <TeamSection />}
      {activeTab === 'Certificates' && <CertificatesSection />}
    </div>
  );
}
