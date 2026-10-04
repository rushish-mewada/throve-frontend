import { sdk } from "@/lib/medusa";
import styles from "./page.module.css";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

// Revalidate this page occasionally (or use dynamic)
export const revalidate = 60;

export default async function Home() {
  // 1. Fetch data strictly on the server
  let products = [];
  try {
    const { products: fetchedProducts } = await sdk.store.product.list({
      fields: "*variants,*variants.prices",
    });
    products = fetchedProducts;
  } catch (e) {
    console.error("Failed to fetch products:", e.message);
  }

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Discover <span className={styles.highlight}>Throve</span>
          </h1>
          <p className={styles.subtitle}>
            Premium lifestyle goods, curated exclusively for India. Zero-API Architecture natively powered by Medusa v2.
          </p>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Latest Arrivals</h2>
        
        <div className={styles.grid}>
          {products.length === 0 ? (
            <p className={styles.emptyState}>No products found. Add some in your Medusa Admin!</p>
          ) : (
            products.map((product) => {
              // Extract the first variant and price if available
              const variant = product.variants?.[0];
              const price = variant?.calculated_price?.calculated_amount 
                ? `₹${variant.calculated_price.calculated_amount}`
                : "View details";

              return (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    {product.thumbnail ? (
                      <Image 
                        src={product.thumbnail} 
                        alt={product.title} 
                        fill
                        className={styles.productImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={styles.placeholderImage}>No Image</div>
                    )}
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <p className={styles.productPrice}>{price}</p>
                    
                    {variant?.id ? (
                      <AddToCartButton variantId={variant.id} />
                    ) : (
                      <button className={styles.addToCartButton} disabled>
                        Sold Out
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Floating Checkout Button */}
      <div className={styles.floatingCart}>
        <a href="/checkout" className={styles.checkoutLink}>
          Secure Checkout ➔
        </a>
      </div>
    </main>
  );
}
