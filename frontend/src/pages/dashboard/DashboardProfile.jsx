import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import { getInitials } from '../../utils/formatters';
import styles from './DashboardProfile.module.css';

export default function DashboardProfile() {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateProfile(form);
      await loadUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Profile Settings</h1>
      <Card className={styles.card}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{getInitials(user?.firstName, user?.lastName)}</div>
          <div>
            <p className={styles.name}>{user?.firstName} {user?.lastName}</p>
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          </div>
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
