import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUnreadCount } from '../../hooks/useChat';
import { DASHBOARD_NAV_ITEMS, ADMIN_NAV_ITEMS, ROLES } from '../../constants';
import Navbar from './Navbar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  const { user } = useAuth();
  const navItems = user?.role === ROLES.ADMIN ? ADMIN_NAV_ITEMS : DASHBOARD_NAV_ITEMS;
  const { data: unreadData } = useUnreadCount({ enabled: !!user });
  const unreadCount = unreadData?.data?.count || 0;

  const chatPath = user?.role === ROLES.ADMIN ? '/admin/chat' : '/dashboard/chat';

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard' || item.path === '/admin'}
                className={({ isActive }) =>
                  `${styles.sidebarLink} ${isActive ? styles.active : ''}`
                }
              >
                {item.label}
                {item.path === chatPath && unreadCount > 0 && (
                  <span className={styles.notifDot}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
