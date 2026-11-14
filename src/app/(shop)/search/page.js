import Link from 'next/link';
import Image from 'next/image';
import { LAUNCH_PRODUCTS } from '@/lib/catalog';
import { searchProducts } from '@/lib/storefront/products';
import styles from './page.module.css';

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = (resolvedSearchParams?.q || '').trim();
  const queryLower = rawQuery.toLowerCase();
  const tokens = queryLower.split(/\s+/).filter(Boolean);

  let matchedProducts = [];
  if (rawQuery) {
    try {
      const liveMatches = await searchProducts(rawQuery);
      if (liveMatches.length > 0) {
        matchedProducts = liveMatches;
      }
    } catch {
      // Fallback below when storefront-api is unavailable
    }
    if (matchedProducts.length === 0) {
      const scored = LAUNCH_PRODUCTS.map((product) => {
        const title = (product.title || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        const subcategory = (product.subcategory || '').toLowerCase();
        const handle = (product.handle || '').toLowerCase();
        const collection = (product.collection || '').toLowerCase();
        const colors = (product.colors || []).map((c) => c.name || '').join(' ').toLowerCase();
        const desc = (product.description || '').toLowerCase();

        const matchesWord = (text, token) => {
          if (token === 'men') return category === 'men' || new RegExp('\\bmen\\b', 'i').test(text);
          if (token === 'women') return category === 'women' || new RegExp('\\bwomen\\b', 'i').test(text);
          return new RegExp(`\\b${token}`, 'i').test(text);
        };

        let score = 0;
        if (title.includes(queryLower)) {
          score = 100;
        } else if (tokens.every((t) => matchesWord(title, t))) {
          score = 90;
        } else if (tokens.every((t) => matchesWord(`${category} ${subcategory} ${handle} ${collection}`, t))) {
          score = 80;
        } else if (tokens.every((t) => matchesWord(`${title} ${category} ${subcategory}`, t))) {
          score = 75;
        } else if (tokens.every((t) => matchesWord(colors, t))) {
          score = 70;
        } else {
          const descMatch = tokens.every((t) => matchesWord(desc, t));
          if (descMatch) score = 40;
        }
        return { product, score };
      });

      const validMatches = scored.filter((item) => item.score > 0);
      const hasHighConfidence = validMatches.some((item) => item.score >= 70);
      const filtered = hasHighConfidence
        ? validMatches.filter((item) => item.score >= 70)
        : validMatches;

      matchedProducts = filtered
        .sort((a, b) => b.score - a.score)
        .map((item) => item.product);
    }
  }

  const resultCount = matchedProducts.length;

  return (
    <main className={styles.searchLayout}>
      <div className={styles.header}>
        {rawQuery ? (
          <>
            <h1>Search Results for "{rawQuery}"</h1>
            <p>{resultCount} {resultCount === 1 ? 'item' : 'items'} found</p>
          </>
        ) : (
          <>
            <h1>Search Throve</h1>
            <p>Enter a keyword to search for products</p>
          </>
        )}
      </div>
      
      <div className={styles.mainContent}>
        {!rawQuery ? (
          <div className={styles.emptyState}>
            <form className={styles.searchForm}>
              <input type="text" name="q" placeholder="Search for jackets, shirts, etc..." className={styles.searchInput} />
              <button type="submit" className={styles.searchBtn}>Search</button>
            </form>
          </div>
        ) : resultCount === 0 ? (
          <div className={styles.emptyState}>
            <h2>No results found</h2>
            <p>We couldn't find any items matching "{rawQuery}". Try checking your spelling or using different keywords.</p>
            <Link href="/collections" className={styles.primaryBtn}>Shop All</Link>
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
              {matchedProducts.map((product) => {
                const img = product.images?.[0] || product.image || '/products/asymmetric-mandarin-shirt/main.jpg';
                const colors = product.colorHexes || ['#000000'];
                return (
                  <Link href={`/product/${product.handle}`} key={product.id} className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                      <Image src={img} alt={product.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productTop}>
                        <h3>{product.title}</h3>
                        {Number(product.rating) > 0 && (
                          <div className={styles.rating}>
                            <span>★</span> {product.rating}
                          </div>
                        )}
                      </div>
                      <div className={styles.productBottom}>
                        <span className={styles.price}>{product.price}</span>
                        <div className={styles.colorDots}>
                          {colors.map((color, idx) => (
                            <span key={idx} className={styles.dot} style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
