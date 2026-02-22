import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import { useServices } from '../../hooks/useServices';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { SERVICES_DATA } from '../../constants/static-data';
import styles from './ServicesPage.module.css';

export default function ServicesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useServices({ page, limit: 12, active: 'true' });
  const services = data?.data?.length ? data.data : (isLoading ? [] : SERVICES_DATA);
  const meta = data?.meta;

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          tag="Services"
          title="Our Shopify Services"
          description="Choose from our range of professional services or request a custom solution."
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className={styles.grid}>
              {services.map((service, index) => (
                <ScrollReveal key={service.id || index} delay={index * 0.05}>
                  <Card glow className={styles.card}>
                    <div className={styles.iconWrap}>{service.icon}</div>
                    <h3 className={styles.title}>{service.title}</h3>
                    <p className={styles.desc}>{service.shortDesc}</p>
                    <ul className={styles.features}>
                      {(service.features || []).slice(0, 5).map((f, i) => (
                        <li key={i} className={styles.feature}>
                          <HiCheckCircle className={styles.check} /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.footer}>
                      <span className={styles.price}>{formatCurrency(service.price)}</span>
                      <Link to={`/services/${service.slug}`} className={styles.link}>
                        Details <HiArrowRight />
                      </Link>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: meta.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
