import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useBlogBySlug } from '../../hooks/useBlogs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import styles from './BlogDetailPage.module.css';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data, isLoading } = useBlogBySlug(slug);
  const post = data?.data;

  if (isLoading) return <LoadingSpinner />;
  if (!post) return <div className="container section"><p>Post not found</p></div>;

  return (
    <section className="section">
      <div className="container">
        <Link to="/blog" className={styles.backLink}><HiArrowLeft /> Back to Blog</Link>
        <article className={styles.article}>
          {post.coverImage && <img src={post.coverImage} alt={post.title} className={styles.cover} />}
          <span className={styles.date}>{formatDate(post.publishedAt || post.createdAt)}</span>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.tags?.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag, i) => <span key={i} className={styles.tag}>{tag}</span>)}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
