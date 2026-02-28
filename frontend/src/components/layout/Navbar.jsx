import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS, ROLES } from '../../constants';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close mobile menu on route change (back/forward navigation)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>S</span>
          <span className={styles.logoText}>ShopifyPro</span>
        </Link>

        <div className={styles.desktopNav}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <Link
                to={user.role === ROLES.ADMIN ? '/admin' : '/dashboard'}
                className={styles.dashboardBtn}
              >
                {user.role === ROLES.ADMIN ? 'Admin' : 'Dashboard'}
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>Get Started</Link>
            </div>
          )}

          <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={styles.mobileNav}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.mobileLink} ${isActive(item.path) ? styles.mobileActive : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className={styles.mobileActions}>
              {user ? (
                <>
                  <Link
                    to={user.role === ROLES.ADMIN ? '/admin' : '/dashboard'}
                    className={styles.mobileActionPrimary}
                    onClick={() => setIsOpen(false)}
                  >
                    {user.role === ROLES.ADMIN ? 'Admin' : 'Dashboard'}
                  </Link>
                  <button
                    className={styles.mobileActionOutline}
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.mobileActionOutline} onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className={styles.mobileActionPrimary} onClick={() => setIsOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
