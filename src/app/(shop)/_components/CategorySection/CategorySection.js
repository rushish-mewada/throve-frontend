import Image from 'next/image';
import Link from 'next/link';
import styles from './CategorySection.module.css';

const CATEGORIES = [
  { id: 'c1', name: 'Jacket', image: 'https://placehold.co/400x400/e0e0e0/666666.png?text=Jacket', href: '/collections/jackets' },
  { id: 'c2', name: 'T-Shirt', image: 'https://placehold.co/400x400/e0e0e0/666666.png?text=T-Shirt', href: '/collections/t-shirts' },
  { id: 'c3', name: 'Shirt', image: 'https://placehold.co/400x400/e0e0e0/666666.png?text=Shirt', href: '/collections/shirts' },
  { id: 'c4', name: 'Denim', image: 'https://placehold.co/400x400/e0e0e0/666666.png?text=Denim', href: '/collections/denim' },
  { id: 'c5', name: 'Cargo', image: 'https://placehold.co/400x400/e0e0e0/666666.png?text=Cargo', href: '/collections/cargo' },
  { id: 'c6', name: 'Trousers', image: 'https://placehold.co/400x400/e0e0e0/666666.png?text=Trousers', href: '/collections/trousers' },
];

export default function CategorySection() {
  return (
    <section className={styles.categorySection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {CATEGORIES.map((category) => (
            <Link key={category.id} href={category.href} className={styles.categoryCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
              </div>
              <span className={styles.categoryName}>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
