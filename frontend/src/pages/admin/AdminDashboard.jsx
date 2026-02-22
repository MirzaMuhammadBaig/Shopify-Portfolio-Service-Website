import { useDashboardStats } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../constants';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { data, isLoading } = useDashboardStats();
  const stats = data?.data;

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <div>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.statsGrid}>
        {[
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Total Orders', value: stats.totalOrders },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue) },
          { label: 'Pending Orders', value: stats.pendingOrders },
        ].map((s) => (
          <Card key={s.label} className={styles.statCard}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </Card>
        ))}
      </div>

      <div className={styles.grid}>
        <div>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          <div className={styles.list}>
            {stats.recentOrders.map((order) => (
              <Card key={order.id} className={styles.listItem}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{order.user.firstName} {order.user.lastName}</span>
                  <span style={{ color: ORDER_STATUS_COLORS[order.status], fontSize: '0.8rem', fontWeight: 600 }}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className={styles.itemSub}>{order.service?.title || 'Custom Order'}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>New Users</h2>
          <div className={styles.list}>
            {stats.recentUsers.map((user) => (
              <Card key={user.id} className={styles.listItem}>
                <span className={styles.itemTitle}>{user.firstName} {user.lastName}</span>
                <p className={styles.itemSub}>{user.email}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
