import Image from 'next/image';
import Link from 'next/link';
import styles from './NewArrivalsSection.module.css';

const NEW_ARRIVALS = [
  {
    id: 'n1',
    title: 'Brown Jacket',
    price: '₹ 139,600',
    rating: '4.8',
    images: ['https://placehold.co/600x750/e0e0e0/666666.png?text=New+Arrival'],
    colors: ['#6e473b', '#d4b896', '#6b1d24'],
  },
  {
    id: 'n2',
    title: 'Brown Jacket',
    price: '₹ 139,600',
    rating: '4.8',
    images: ['https://placehold.co/600x750/e0e0e0/666666.png?text=New+Arrival'],
    colors: ['#1b2a4a', '#d4b896', '#6e473b'],
  },
  {
    id: 'n3',
    title: 'Brown Jacket',
    price: '₹ 139,600',
    rating: '4.8',
    images: ['https://placehold.co/600x750/e0e0e0/666666.png?text=New+Arrival'],
    colors: ['#556b2f', '#f5f5dc', '#1a1a1a'],
  },
  {
    id: 'n4',
    title: 'Brown Jacket',
    price: '₹ 139,600',
    rating: '4.8',
    images: ['https://placehold.co/600x750/e0e0e0/666666.png?text=New+Arrival'],
    colors: ['#2c3e50', '#ffffff', '#1a1a1a'],
  },
];

export default function NewArrivalsSection() {
  return (
    <section className={styles.newArrivalsSection}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>New Arrivals</h2>
          <Link href="/collections/new-arrivals" className={styles.seeAllLink}>
            See all
          </Link>
        </div>

        <div className={styles.grid}>
          {NEW_ARRIVALS.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <div className={styles.badge}>Virtual try-on</div>
                <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                
                {/* Arrow Controls Placeholder */}
                <button className={`${styles.imageNavBtn} ${styles.navLeft}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className={`${styles.imageNavBtn} ${styles.navRight}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Dots Placeholder */}
                <div className={styles.imageDots}>
                  <span className={`${styles.dot} ${styles.dotActive}`}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </div>

              <div className={styles.productInfo}>
                <div className={styles.infoTop}>
                  <span className={styles.productTitle}>{product.title}</span>
                  <span className={styles.productRating}>★ {product.rating}</span>
                </div>
                <div className={styles.infoBottom}>
                  <span className={styles.productPrice}>{product.price}</span>
                  <div className={styles.colorSwatches}>
                    {product.colors.map((color, i) => (
                      <span key={i} style={{ backgroundColor: color }} className={i === 0 ? styles.swatchActive : ''} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
