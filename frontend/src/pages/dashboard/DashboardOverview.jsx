import { useNavigate } from 'react-router-dom';
import { useMyOrders } from '../../hooks/useOrders';
import { useConversations, useUnreadCount } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../constants';
import { HiChat, HiArrowRight } from 'react-icons/hi';
import styles from './DashboardOverview.module.css';

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders({ limit: 5 });
  const { data: chatsData } = useConversations();
  const { data: unreadData } = useUnreadCount({ enabled: !!user });
  const orders = ordersData?.data || [];
  const conversations = chatsData?.data || [];
  const unreadCount = unreadData?.data?.count || 0;

  // Find conversations with unread messages
  const unreadConversations = conversations.filter((c) => (c._count?.messages || 0) > 0);

  if (ordersLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.greeting}>Welcome, {user?.firstName}!</h1>

      {unreadCount > 0 && (
        <button className={styles.chatAlert} onClick={() => navigate('/dashboard/chat')}>
          <div className={styles.chatAlertDot} />
          <HiChat className={styles.chatAlertIcon} />
          <div className={styles.chatAlertText}>
            <strong>
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}!
            </strong>
            <span>
              {unreadConversations.length > 0
                ? `${unreadConversations.length} conversation${unreadConversations.length !== 1 ? 's' : ''} need${unreadConversations.length === 1 ? 's' : ''} your attention`
                : 'Check your messages to stay updated on your orders'}
            </span>
          </div>
          <HiArrowRight className={styles.chatAlertArrow} />
        </button>
      )}

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <span className={styles.statValue}>{ordersData?.meta?.total || 0}</span>
          <span className={styles.statLabel}>Total Orders</span>
        </Card>
        <button className={styles.statCardBtn} onClick={() => navigate('/dashboard/chat')}>
          <Card className={styles.statCard}>
            <span className={styles.statValue}>
              {unreadCount > 0 ? unreadCount : conversations.length}
            </span>
            <span className={styles.statLabel}>
              {unreadCount > 0 ? 'Unread Messages' : 'Conversations'}
            </span>
            {unreadCount > 0 && <span className={styles.statBadge}>New</span>}
          </Card>
        </button>
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
