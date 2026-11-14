import Link from 'next/link';
import styles from './CollectionHeader.module.css';

export default function CollectionHeader({ category }) {
  return (
    <div className={styles.header}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <ol className={styles.breadcrumbList}>
          <li className={styles.breadcrumbItem}>
            <Link href="/" className={styles.breadcrumbLink}>
              Home
            </Link>
          </li>
          <li className={styles.breadcrumbSeparator} aria-hidden="true">
            /
          </li>
          <li className={styles.breadcrumbItem} aria-current="page">
            <span className={styles.breadcrumbCurrent}>{category.title}</span>
          </li>
        </ol>
      </nav>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{category.title}</h1>
        <p className={styles.description}>{category.description}</p>
      </div>
    </div>
  );
}
