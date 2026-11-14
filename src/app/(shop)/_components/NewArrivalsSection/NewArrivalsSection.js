"use client";

import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import styles from './NewArrivalsSection.module.css';

const NEW_ARRIVALS = [
  {
    id: 'throve_lp_01',
    title: 'Sleeveless Tailored Mini Dress',
    price: '₹ 4,800',
    rating: null,
    images: [
      '/products/navy-tailored-mini-dress/main.jpg?v=3',
      '/products/navy-tailored-mini-dress/front.jpg?v=3',
      '/products/navy-tailored-mini-dress/right tilted.jpg?v=3',
      '/products/navy-tailored-mini-dress/left.jpg?v=3',
    ],
    colors: ['#1C2841'],
    handle: 'navy-tailored-mini-dress',
  },
  {
    id: 'throve_lp_02',
    title: 'Overlapping Mandarin Shirt',
    price: '₹ 3,900',
    rating: null,
    images: [
      '/products/asymmetric-mandarin-shirt/main.jpg?v=3',
      '/products/asymmetric-mandarin-shirt/front.jpg?v=3',
      '/products/asymmetric-mandarin-shirt/right tilted.jpg?v=3',
      '/products/asymmetric-mandarin-shirt/left tilted.jpg?v=3',
    ],
    colors: ['#4A2E18'],
    handle: 'asymmetric-mandarin-shirt',
  },
  {
    id: 'throve_lp_05',
    title: 'Sleeveless Princess Line Dress',
    price: '₹ 4,900',
    rating: '5.0',
    images: [
      '/products/sleeveless-princess-sheath-dress/main.jpg?v=3',
      '/products/sleeveless-princess-sheath-dress/front.jpg?v=3',
      '/products/sleeveless-princess-sheath-dress/right.jpg?v=3',
      '/products/sleeveless-princess-sheath-dress/back.jpg?v=3',
    ],
    colors: ['#FAF7F2'],
    handle: 'sleeveless-princess-sheath-dress',
  },
  {
    id: 'throve_lp_03',
    title: 'Pleated Straight Formal Pants',
    price: '₹ 4,200',
    rating: null,
    images: [
      '/products/pleated-formal-pants/main.jpg?v=3',
      '/products/pleated-formal-pants/front.jpg?v=3',
      '/products/pleated-formal-pants/right.jpg?v=3',
      '/products/pleated-formal-pants/back.jpg?v=3',
    ],
    colors: ['#F5F2EB'],
    handle: 'pleated-formal-pants',
  },
];

export default function NewArrivalsSection({ products }) {
  const displayProducts = Array.isArray(products) && products.length > 0 ? products : NEW_ARRIVALS;

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
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id || product.handle}
              product={product}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
