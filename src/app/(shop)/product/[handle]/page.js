import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGallery from './_components/ProductGallery/ProductGallery';
import ProductInfo from './_components/ProductInfo/ProductInfo';
import ProductGrid from './_components/ProductGrid/ProductGrid';
import ProductReviews from './_components/ProductReviews/ProductReviews';
import { getProductByHandle, LAUNCH_PRODUCTS } from '@/lib/catalog';
import { getProduct, getProducts } from '@/lib/storefront/products';
import styles from './page.module.css';

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle;

  let product = null;
  let catalogPool = [];
  try {
    const [liveProd, liveList] = await Promise.all([
      getProduct(handle).catch(() => null),
      getProducts().catch(() => []),
    ]);
    product = liveProd;
    catalogPool = liveList;
  } catch {
    product = null;
  }

  if (!product) {
    product = getProductByHandle(handle);
  }

  if (!product) {
    notFound();
  }
  const sourcePool = catalogPool.length > 0 ? catalogPool : LAUNCH_PRODUCTS;

  const relatedProducts = sourcePool
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  const popularProducts = [...sourcePool]
    .reverse()
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  return (
    <main className={styles.pdpLayout}>
      {/* Semantic Breadcrumbs with Deduplication and Clean Mobile Touch Scroll */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <ol className={styles.breadcrumbList}>
          <li className={styles.breadcrumbItem}>
            <Link href="/" className={styles.breadcrumbLink}>
              Home
            </Link>
          </li>
          <li className={styles.breadcrumbSeparator} aria-hidden="true">
            /
          </li>
          {product.category && (
            <>
              <li className={styles.breadcrumbItem}>
                <Link
                  href={`/collections/${product.category.toLowerCase() === 'men' ? 'men' : 'women'}`}
                  className={styles.breadcrumbLink}
                >
                  {product.category}
                </Link>
              </li>
              {product.subcategory &&
                product.subcategory.trim().toLowerCase() !== product.category.trim().toLowerCase() && (
                  <>
                    <li className={styles.breadcrumbSeparator} aria-hidden="true">
                      /
                    </li>
                    <li className={styles.breadcrumbItem}>
                      <span className={styles.breadcrumbText}>{product.subcategory}</span>
                    </li>
                  </>
                )}
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </li>
            </>
          )}
          <li className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`} aria-current="page">
            <span className={styles.breadcrumbCurrent} title={product.title}>
              {product.title}
            </span>
          </li>
        </ol>
      </nav>
      
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
      
      <ProductReviews productHandle={product?.handle} productTitle={product?.title} />

      <ProductGrid
        title="Popular This Week"
        products={popularProducts}
        seeAllLink="/collections/new-arrivals"
      />
    </main>
  );
}
