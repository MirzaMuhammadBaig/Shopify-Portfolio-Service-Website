import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS, ROLES } from '../../constants';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <Link key={item.path} to={item.path} className={styles.navLink}>
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
            className={styles.mobileNav}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.mobileLink}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={user.role === ROLES.ADMIN ? '/admin' : '/dashboard'}
                  className={styles.mobileLink}
                  onClick={() => setIsOpen(false)}
                >
                  {user.role === ROLES.ADMIN ? 'Admin' : 'Dashboard'}
                </Link>
                <button
                  className={styles.mobileLink}
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
