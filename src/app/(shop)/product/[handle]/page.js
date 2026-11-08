import ProductGallery from './_components/ProductGallery/ProductGallery';
import ProductInfo from './_components/ProductInfo/ProductInfo';
import ProductGrid from './_components/ProductGrid/ProductGrid';
import ProductReviews from './_components/ProductReviews/ProductReviews';
import { getProductByHandle, LAUNCH_PRODUCTS } from '@/lib/catalog';
import styles from './page.module.css';

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = getProductByHandle(resolvedParams?.handle);

  const relatedProducts = LAUNCH_PRODUCTS
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      rating: p.rating,
      image: p.images[0],
      colors: p.colorHexes,
      handle: p.handle,
    }));

  return (
    <main className={styles.pdpLayout}>
      <div className={styles.breadcrumbs}>
        <span>Homepage</span> &gt; <span>{product.category}</span> &gt; <span>{product.subcategory}</span> &gt; <span>{product.title}</span>
      </div>
      
      <div className={styles.topSection}>
        <div className={styles.galleryColumn}>
          <ProductGallery images={product.images} product={product} />
        </div>
        <div className={styles.infoColumn}>
          <ProductInfo product={product} />
        </div>
      </div>
      
      <ProductGrid
        title="Related Products"
        products={relatedProducts}
        seeAllLink={`/collections/${product.category.toLowerCase() === 'men' ? 'men' : 'women'}`}
      />
      
      <ProductReviews />

      <ProductGrid
        title="Popular This Week"
        products={relatedProducts}
        seeAllLink="/collections/new-arrivals"
      />
    </main>
  );
}
