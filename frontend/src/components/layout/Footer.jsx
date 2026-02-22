import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'Services',
    links: [
      { label: 'Store Setup', path: '/services' },
      { label: 'Theme Development', path: '/services' },
      { label: 'App Integration', path: '/services' },
      { label: 'SEO Optimization', path: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/' },
      { label: 'Blog', path: '/blog' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Chat', path: '/dashboard/chat' },
      { label: 'FAQs', path: '/' },
    ],
  },
];

const SOCIALS = [
  { icon: FaGithub, href: '#' },
  { icon: FaTwitter, href: '#' },
  { icon: FaLinkedin, href: '#' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>S</span>
            <span className={styles.logoText}>ShopifyPro</span>
          </div>
          <p className={styles.desc}>
            Professional Shopify development services to help your business grow online.
          </p>
          <div className={styles.socials}>
            {SOCIALS.map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.title} className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>{group.title}</h4>
            {group.links.map((link) => (
              <Link key={link.label} to={link.path} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} ShopifyPro Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
