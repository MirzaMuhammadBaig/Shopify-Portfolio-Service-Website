import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { HiCheckCircle, HiAcademicCap, HiArrowRight } from 'react-icons/hi';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAboutData } from '../../hooks/useAbout';
import { ABOUT_STATS, ABOUT_TEAM, ABOUT_CERTIFICATES, ABOUT_EXPERIENCE } from '../../constants/static-data';
import styles from './AboutPage.module.css';

const VALUES = [
  {
    icon: '🎯',
    title: 'Results-Driven',
    desc: 'Every line of code we write is focused on one thing — growing your revenue. We measure success by the impact on your bottom line, not just deliverables.',
  },
  {
    icon: '⚡',
    title: 'Performance First',
    desc: 'Sub-3-second load times, 90+ Lighthouse scores, and Core Web Vitals compliance are our baseline. Speed is revenue in e-commerce.',
  },
  {
    icon: '🤝',
    title: 'Transparent Partnership',
    desc: 'No surprises. Fixed pricing, weekly updates, staging previews, and direct communication. You always know where your project stands.',
  },
  {
    icon: '🔒',
    title: 'Quality Guaranteed',
    desc: 'Every project includes revision rounds, cross-device QA, and 30-60 days of post-launch support. We stand behind every build.',
  },
  {
    icon: '📈',
    title: 'Data-Informed',
    desc: 'We use analytics, heatmaps, and A/B testing data to drive decisions — not guesswork. Every recommendation is backed by real numbers.',
  },
  {
    icon: '🌍',
    title: 'Global Reach',
    desc: 'Serving clients across 25+ countries with timezone-flexible communication and multi-currency, multi-language store expertise.',
  },
];

function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest) + suffix;
      }
    });
    return unsubscribe;
  }, [spring, suffix]);

  return <span ref={ref} className={styles.statValue}>0{suffix}</span>;
}

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

const counterVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const STATIC_STORY = {
  title: 'Our Story',
  content: 'ShopifyPro started with a simple belief: every brand deserves a world-class online store, regardless of size or budget. What began as a solo freelance operation has grown into a full-service Shopify agency trusted by clients worldwide.\n\nWith 150+ projects delivered across 25+ countries, we bring deep expertise in Shopify development, custom theme design, SEO, app development, and conversion rate optimization. Our process is battle-tested, our code is clean, and our results speak for themselves.',
  highlights: [
    'Certified Shopify Partner',
    '100% project completion rate',
    'Average 3.2% conversion rate (vs 1.4% industry avg)',
    '90+ average Lighthouse performance score',
  ],
};

export default function AboutPage() {
  const { data: apiData } = useAboutData();
  const api = apiData?.data;

  const stats = api?.stats?.length ? api.stats : ABOUT_STATS;
  const story = api?.story || STATIC_STORY;
  const experiences = api?.experiences?.length ? api.experiences : ABOUT_EXPERIENCE;
  const team = api?.members?.length ? api.members : ABOUT_TEAM;
  const certificates = api?.certificates?.length ? api.certificates : ABOUT_CERTIFICATES;
  const storyHighlights = Array.isArray(story.highlights) ? story.highlights : STATIC_STORY.highlights;

  return (
    <section className={`section ${styles.pageWrapper}`}>
      <div className={styles.bgOrb + ' ' + styles.bgOrb1} />
      <div className={styles.bgOrb + ' ' + styles.bgOrb2} />
      <div className={styles.bgOrb + ' ' + styles.bgOrb3} />
      <div className="container">
        {/* Hero */}
        <ScrollReveal>
          <div className={styles.hero}>
            <motion.span
              className={styles.heroTag}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Us
            </motion.span>
            <h1 className={styles.heroTitle}>
              We Build Shopify Stores That{' '}
              <span className={styles.heroTitleAccent}>Drive Revenue</span>
            </h1>
            <p className={styles.heroDesc}>
              A team of passionate Shopify experts dedicated to building high-converting,
              beautifully designed e-commerce experiences. From startups to established brands,
              we turn your vision into a store that sells.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <motion.div
          className={styles.statsBar}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className={styles.statItem}
              variants={counterVariants}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Story */}
        <div className={styles.storySection}>
          <ScrollReveal>
            <div className={styles.storyContent}>
              <h2>{story.title || 'Our Story'}</h2>
              {(story.content || '').split('\n').filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className={styles.storyHighlights}>
                {storyHighlights.map((text, i) => (
                  <motion.div
                    key={i}
                    className={styles.storyHighlight}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  >
                    <HiCheckCircle /> {text}
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Experience Timeline */}
        <div className={styles.timelineSection}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>Experience & Journey</h2>
            <p className={styles.sectionSubtitle}>
              A track record of continuous growth, learning, and delivering exceptional results.
            </p>
          </ScrollReveal>
          <div className={styles.timeline}>
            {experiences.map((exp, i) => (
              <ScrollReveal key={exp.id} delay={i * 0.12} variant="fadeLeft">
                <div className={styles.timelineItem}>
                  <motion.div
                    className={styles.timelineDot}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
                  />
                  <span className={styles.timelineYear}>{exp.year}</span>
                  <h3 className={styles.timelineTitle}>{exp.title}</h3>
                  <p className={styles.timelineDesc}>{exp.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className={styles.teamSection}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <p className={styles.sectionSubtitle}>
              Skilled professionals who are passionate about Shopify and committed to your success.
            </p>
          </ScrollReveal>
          <motion.div
            className={styles.teamGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {team.map((member) => (
              <motion.div key={member.id} variants={staggerItem}>
                <Card className={styles.teamCard}>
                  <div className={styles.teamImageWrap}>
                    <div className={styles.teamImageInner}>
                      {member.image ? (
                        <img src={member.image} alt={member.name} />
                      ) : (
                        <span className={styles.teamInitials}>{getInitials(member.name)}</span>
                      )}
                    </div>
                  </div>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <span className={styles.teamRole}>{member.role}</span>
                  <p className={styles.teamSpecialty}>{member.specialty}</p>
                  <p className={styles.teamExperience}>{member.experience}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Certificates */}
        <div className={styles.certSection}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>Certifications & Credentials</h2>
            <p className={styles.sectionSubtitle}>
              Industry-recognized certifications that validate our expertise and commitment to excellence.
            </p>
          </ScrollReveal>
          <motion.div
            className={styles.certGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {certificates.slice(0, 6).map((cert) => (
              <motion.div key={cert.id} variants={staggerItem}>
                <Card glow className={styles.certCard}>
                  <div className={styles.certBadge}>
                    <div className={styles.certImageWrap}>
                      {cert.image ? (
                        <img src={cert.image} alt={cert.title} />
                      ) : (
                        <HiAcademicCap className={styles.certIcon} />
                      )}
                    </div>
                  </div>
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  <span className={styles.certIssuer}>{cert.issuer}</span>
                  <span className={styles.certYear}>{cert.year}</span>
                  <span className={styles.certViewLabel}>Click to view details</span>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {certificates.length > 6 && (
            <ScrollReveal>
              <div className={styles.certViewAll}>
                <Link to="/certificates" className={styles.certViewAllBtn}>
                  View All Certificates <HiArrowRight />
                </Link>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Values */}
        <div className={styles.valuesSection}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>What We Stand For</h2>
            <p className={styles.sectionSubtitle}>
              The principles that guide every project, every decision, and every line of code.
            </p>
          </ScrollReveal>
          <motion.div
            className={styles.valuesGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {VALUES.map((v) => (
              <motion.div key={v.title} variants={staggerItem}>
                <Card className={styles.valueCard}>
                  <span className={styles.valueIcon}>{v.icon}</span>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <ScrollReveal variant="scale">
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Ready to Work with Us?</h2>
            <p className={styles.ctaDesc}>
              Let's discuss your project and find the perfect solution for your brand.
              Book a free 30-minute discovery call today.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact"><Button>Get a Free Consultation</Button></Link>
              <Link to="/services"><Button variant="outline">View Our Services</Button></Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
