import Image from 'next/image';
import Link from 'next/link';
import styles from './CategorySection.module.css';

const CATEGORIES = [
  {
    id: 'c1',
    name: 'Dresses',
    image: '/products/navy-tailored-mini-dress/front.jpg',
    href: '/collections/women',
  },
  {
    id: 'c2',
    name: 'Tailored Shirts',
    image: '/products/asymmetric-mandarin-shirt/front.jpg',
    href: '/collections/men',
  },
  {
    id: 'c3',
    name: 'Formal Trousers',
    image: '/products/pleated-formal-pants/front.jpg',
    href: '/collections/men',
  },
  {
    id: 'c4',
    name: 'Sweetheart Tops',
    image: '/products/scalloped-sweetheart-top/front.jpg',
    href: '/collections/women',
  },
  {
    id: 'c5',
    name: 'Flare Pants',
    image: '/products/high-waisted-flare-pants/front.jpg',
    href: '/collections/women',
  },
  {
    id: 'c6',
    name: 'Sheath Dresses',
    image: '/products/sleeveless-princess-sheath-dress/front.jpg',
    href: '/collections/women',
  },
];

export default function CategorySection() {
  return (
    <section id="explore" className={styles.categorySection}>
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
