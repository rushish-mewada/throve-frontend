import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        New season coming! Discount 10% for all product! <span className={styles.highlight}>Checkout Now!</span>
      </p>
    </div>
  );
}
