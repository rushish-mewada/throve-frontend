import styles from './CollectionHeader.module.css';

export default function CollectionHeader({ category }) {
  return (
    <div className={styles.header}>
      <div className={styles.breadcrumbs}>
        <span>Homepage</span> &gt; <span>{category.title}</span>
      </div>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{category.title}</h1>
        <p className={styles.description}>{category.description}</p>
      </div>
    </div>
  );
}
