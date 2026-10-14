import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// Dummy data for the Search Results
const dummyProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  image: `https://placehold.co/400x500/e0e0e0/666666.png?text=Search+Result+${i+1}`,
  title: 'Throve Essential Hoodie',
  rating: '4.9',
  price: '₹ 4,500',
  colors: ['#000000', '#333333']
}));

export default function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';
  const resultCount = query ? dummyProducts.length : 0;

  return (
    <main className={styles.searchLayout}>
      <div className={styles.header}>
        {query ? (
          <>
            <h1>Search Results for "{query}"</h1>
            <p>{resultCount} items found</p>
          </>
        ) : (
          <>
            <h1>Search Throve</h1>
            <p>Enter a keyword to search for products</p>
          </>
        )}
      </div>
      
      <div className={styles.mainContent}>
        {!query ? (
          <div className={styles.emptyState}>
            <form className={styles.searchForm}>
              <input type="text" name="q" placeholder="Search for jackets, shirts, etc..." className={styles.searchInput} />
              <button type="submit" className={styles.searchBtn}>Search</button>
            </form>
          </div>
        ) : resultCount === 0 ? (
          <div className={styles.emptyState}>
            <h2>No results found</h2>
            <p>We couldn't find any items matching "{query}". Try checking your spelling or using different keywords.</p>
            <Link href="/collections/all" className={styles.primaryBtn}>Shop All</Link>
          </div>
        ) : (
          <div className={styles.gridContainer}>
            <div className={styles.toolbar}>
              <div className={styles.filtersBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>Filter</span>
              </div>
              <div className={styles.sortDropdown}>
                <span>Sort by:</span>
                <select className={styles.select}>
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            
            <div className={styles.productGrid}>
              {dummyProducts.map((product) => (
                <Link href={`/product/search-item-${product.id}`} key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    <Image src={product.image} alt={product.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productTop}>
                      <h3>{product.title}</h3>
                      <div className={styles.rating}>
                        <span>★</span> {product.rating}
                      </div>
                    </div>
                    <div className={styles.productBottom}>
                      <span className={styles.price}>{product.price}</span>
                      <div className={styles.colorDots}>
                        {product.colors.map((color, idx) => (
                          <span key={idx} className={styles.dot} style={{ backgroundColor: color }}></span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
