import Link from 'next/link';
import FaqAccordion from './_components/FaqAccordion/FaqAccordion';
import styles from './page.module.css';

export const metadata = {
  title: 'Frequently Asked Questions | Throve',
  description: 'Find answers regarding Throve shipping, COD policies, returns, sizing, and order tracking across India.',
};

export default function FaqPage() {
  return (
    <main className={styles.faqPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>CLIENT CARE & SUPPORT</span>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Everything you need to know about purchasing, shipping, sizing, and returns at Throve.
          </p>
        </div>

        <FaqAccordion />

        <div className={styles.contactBanner}>
          <div className={styles.bannerContent}>
            <h3>Still Have Questions?</h3>
            <p>Our dedicated support concierge is available Monday to Saturday, 10:00 AM – 7:00 PM IST.</p>
          </div>
          <div className={styles.bannerActions}>
            <Link href="/contact" className={styles.contactBtn}>
              Contact Concierge
            </Link>
            <Link href="/track" className={styles.trackBtn}>
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
