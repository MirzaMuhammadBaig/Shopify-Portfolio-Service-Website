import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => userService.getAll({ page, limit: 20 }).then((r) => r.data),
  });
  const users = data?.data || [];
  const meta = data?.meta;

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userService.delete(id);
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.title}>Users</h1>
      <div className={styles.list}>
        {users.map((user) => (
          <Card key={user.id} className={styles.row}>
            <div className={styles.rowMain}>
              <div>
                <span className={styles.rowTitle}>{user.firstName} {user.lastName}</span>
                <p className={styles.rowMeta}>{user.email}</p>
              </div>
              <span className={styles.rowMeta}>{formatDate(user.createdAt)}</span>
            </div>
            <div className={styles.rowActions}>
              <Badge variant={user.role === 'ADMIN' ? 'primary' : 'neutral'}>{user.role}</Badge>
              <Badge variant={user.isActive ? 'success' : 'error'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
              <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
      {meta && meta.totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
