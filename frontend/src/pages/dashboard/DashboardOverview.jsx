import { useMyOrders } from '../../hooks/useOrders';
import { useConversations } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../constants';
import styles from './DashboardOverview.module.css';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders({ limit: 5 });
  const { data: chatsData } = useConversations();
  const orders = ordersData?.data || [];
  const conversations = chatsData?.data || [];

  if (ordersLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.greeting}>Welcome, {user?.firstName}!</h1>
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <span className={styles.statValue}>{ordersData?.meta?.total || 0}</span>
          <span className={styles.statLabel}>Total Orders</span>
        </Card>
        <Card className={styles.statCard}>
          <span className={styles.statValue}>{conversations.length}</span>
          <span className={styles.statLabel}>Conversations</span>
        </Card>
        <Card className={styles.statCard}>
          <span className={styles.statValue}>
            {orders.filter((o) => o.status === 'IN_PROGRESS').length}
          </span>
          <span className={styles.statLabel}>In Progress</span>
        </Card>
      </div>

      <h2 className={styles.sectionTitle}>Recent Orders</h2>
      {orders.length === 0 ? (
        <p className={styles.empty}>No orders yet</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <Card key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderNumber}>{order.orderNumber}</span>
                <span
                  className={styles.status}
                  style={{ color: ORDER_STATUS_COLORS[order.status] }}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              <p className={styles.orderService}>{order.service?.title || 'Custom Order'}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
