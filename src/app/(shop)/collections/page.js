import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'All Collections | Throve Official',
  description: 'Explore the S/S 25 inaugural drops, tailored silhouettes, and architectural pieces crafted in India.',
};

const COLLECTIONS = [
  {
    handle: 'women',
    title: "Women's Collection",
    subtitle: 'Contoured princess seams, architectural sheath lines, and sculptured silhouettes.',
    itemCount: '4 Styles',
    image: '/products/navy-tailored-mini-dress/main.jpg?v=3',
  },
  {
    handle: 'men',
    title: "Men's Collection",
    subtitle: 'Sharp silhouettes, architectural collars, and tailored cuts engineered for modern men.',
    itemCount: '2 Styles',
    image: '/products/asymmetric-mandarin-shirt/main.jpg?v=3',
  },
  {
    handle: 'new-arrivals',
    title: 'New Arrivals · S/S 25',
    subtitle: 'First launch edition. Six debut pieces defined by precision tech-pack tailoring and bespoke details.',
    itemCount: '6 Styles',
    image: '/products/scalloped-sweetheart-top/main.jpg?v=3',
  },
  {
    handle: 'dresses',
    title: 'Architectural Dresses',
    subtitle: 'Precision tailored mini and princess sheath silhouettes crafted for contemporary luxury occasions.',
    itemCount: '2 Styles',
    image: '/products/sleeveless-princess-sheath-dress/main.jpg?v=3',
  },
  {
    handle: 'shirts',
    title: 'Tailored Shirts & Tops',
    subtitle: 'Overlapping mandarin plackets, bespoke geometric buttons, and sculpted sweetheart tops.',
    itemCount: '2 Styles',
    image: '/products/asymmetric-mandarin-shirt/front.jpg?v=3',
  },
  {
    handle: 'trousers',
    title: 'Tailored Trousers & Pants',
    subtitle: 'Italian Riviera double-pleat formal trousers and sweeping high-waisted circular flare tailoring.',
    itemCount: '2 Styles',
    image: '/products/pleated-formal-pants/main.jpg?v=3',
  },
];

export default function CollectionsPage() {
  return (
    <main className={styles.collectionsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>INAUGURAL EDITION</span>
          <h1 className={styles.title}>All Collections</h1>
          <p className={styles.subtitle}>
            Explore the S/S 25 inaugural drops and tailored silhouettes in the Throve ecosystem.
          </p>
        </div>

        <div className={styles.grid}>
          {COLLECTIONS.map((col) => (
            <Link
              key={col.handle}
              href={`/collections/${col.handle}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.overlay} />
                <span className={styles.badge}>{col.itemCount}</span>
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.colTitle}>{col.title}</h2>
                <p className={styles.colSubtitle}>{col.subtitle}</p>
                <span className={styles.cta}>
                  Explore Drop
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
