import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'All Collections | Throve Luxury Streetwear',
  description: 'Explore the full range of Throve seasonal drops, silhouettes, and streetwear collections in India.',
};

const COLLECTIONS = [
  {
    handle: 'jackets',
    title: 'Jackets & Outerwear',
    subtitle: 'Heavyweight bombers, utility jackets, and acid-wash outerwear.',
    itemCount: '14 Styles',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
  },
  {
    handle: 't-shirts',
    title: 'Heavyweight T-Shirts',
    subtitle: '280 GSM+ combed cotton, boxy drop-shoulder silhouettes.',
    itemCount: '22 Styles',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
  },
  {
    handle: 'shirts',
    title: 'Camp & Oversized Shirts',
    subtitle: 'Relaxed structured weaves, textured linens, and utilitarian cuts.',
    itemCount: '12 Styles',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
  },
  {
    handle: 'denim',
    title: 'Raw & Carpenter Denim',
    subtitle: 'Japanese selvedge inspired, wide-leg cuts with reinforced paneling.',
    itemCount: '9 Styles',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
  },
  {
    handle: 'cargo',
    title: 'Tactical Cargos',
    subtitle: 'Multi-pocket modular pants engineered for everyday utility.',
    itemCount: '11 Styles',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
  },
  {
    handle: 'trousers',
    title: 'Tailored Trousers',
    subtitle: 'Relaxed pleats, fluid draping, and elevated streetwear tailoring.',
    itemCount: '8 Styles',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=800',
  },
  {
    handle: 'women',
    title: 'Women’s Edit',
    subtitle: 'Curated boxy fits, cropped silhouettes, and oversized staples.',
    itemCount: '28 Styles',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
  },
  {
    handle: 'men',
    title: 'Men’s Edit',
    subtitle: 'Contemporary Indian streetwear tailoring with industrial finishings.',
    itemCount: '34 Styles',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
  },
];

export default function CollectionsPage() {
  return (
    <main className={styles.collectionsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>CATALOG ARCHIVE</span>
          <h1 className={styles.title}>All Collections</h1>
          <p className={styles.subtitle}>
            Explore every silhouette in the Throve ecosystem. Limited production runs crafted in India.
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
