import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD_NAV_ITEMS, ADMIN_NAV_ITEMS, ROLES } from '../../constants';
import Navbar from './Navbar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  const { user } = useAuth();
  const navItems = user?.role === ROLES.ADMIN ? ADMIN_NAV_ITEMS : DASHBOARD_NAV_ITEMS;

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
