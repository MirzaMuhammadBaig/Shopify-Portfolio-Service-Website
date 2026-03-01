import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs, useBlogTags } from '../../hooks/useBlogs';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { formatDate, truncateText } from '../../utils/formatters';
import { BLOG_DATA } from '../../constants/static-data';
import { HiSearch } from 'react-icons/hi';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const debounceRef = useRef(null);

  const { data: tagsData } = useBlogTags();
  const tags = tagsData?.data || [];

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const params = {
    page,
    limit: 9,
    published: 'true',
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeTag && { tag: activeTag }),
  };
  const { data, isLoading } = useBlogs(params);
  const posts = data?.data?.length ? data.data : (isLoading ? [] : BLOG_DATA);
  const meta = data?.meta;

  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setPage(1);
  };

  return (
    <section className="section">
      <div className="container">
        <SectionHeader tag="Blog" title="Insights & Updates" description="Tips, tutorials, and news about Shopify development." />

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <HiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by title, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {tags.length > 0 && (
          <div className={styles.tagFilters}>
            <button
              className={`${styles.tagBtn} ${!activeTag ? styles.tagActive : ''}`}
              onClick={() => handleTagChange(null)}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tagBtn} ${activeTag === tag ? styles.tagActive : ''}`}
                onClick={() => handleTagChange(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {isLoading ? <LoadingSpinner /> : !posts.length ? (
          <EmptyState title="No articles found" description="Try a different search or filter." />
        ) : (
          <>
            <div className={styles.grid}>
              {posts.map((post, i) => (
                <ScrollReveal key={post.id || i} delay={i * 0.05}>
                  <Link to={`/blog/${post.slug}`}>
                    <Card glow className={styles.card}>
                      {post.coverImage && (
                        <div className={styles.imageWrap}>
                          <img src={post.coverImage} alt={post.title} className={styles.image} />
                        </div>
                      )}
                      <div className={styles.body}>
                        <div className={styles.tags}>
                          {(post.tags || []).slice(0, 2).map((tag, idx) => (
                            <span key={idx} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                        <h3 className={styles.title}>{post.title}</h3>
                        <p className={styles.excerpt}>{truncateText(post.excerpt || post.content, 150)}</p>
                        <span className={styles.date}>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            {meta && meta.totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: meta.totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
