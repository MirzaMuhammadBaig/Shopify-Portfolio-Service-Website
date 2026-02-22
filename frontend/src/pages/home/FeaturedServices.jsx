import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import { useFeaturedServices } from '../../hooks/useServices';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { SERVICES_DATA } from '../../constants/static-data';
import styles from './FeaturedServices.module.css';

export default function FeaturedServices() {
  const { data, isLoading } = useFeaturedServices();
  const services = data?.data?.length ? data.data : (isLoading ? [] : SERVICES_DATA.filter(s => s.isFeatured));

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          tag="Our Services"
          title="What We Offer"
          description="From store setup to advanced customization, we provide end-to-end Shopify solutions."
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.grid}>
            {services.map((service, index) => (
              <ScrollReveal key={service.id || index} delay={index * 0.1}>
                <Card glow className={styles.card}>
                  {service.icon && <div className={styles.icon}>{service.icon}</div>}
                  <h3 className={styles.title}>{service.title}</h3>
                  <p className={styles.desc}>{service.shortDesc}</p>
                  <ul className={styles.features}>
                    {(service.features || []).slice(0, 4).map((feature, i) => (
                      <li key={i} className={styles.feature}>
                        <HiCheckCircle className={styles.checkIcon} /> {feature}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.footer}>
                    <span className={styles.price}>From {formatCurrency(service.price)}</span>
                    <Link to={`/services/${service.slug}`} className={styles.link}>
                      Learn More <HiArrowRight />
                    </Link>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className={styles.viewAll}>
          <Link to="/services" className={styles.viewAllLink}>
            View All Services <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
