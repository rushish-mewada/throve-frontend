import CollectionHeader from './_components/CollectionHeader/CollectionHeader';
import Filters from './_components/Filters/Filters';
import CollectionGrid from './_components/CollectionGrid/CollectionGrid';
import CollectionSort from './_components/CollectionSort/CollectionSort';
import styles from './page.module.css';

// Dummy data for the Collection
const dummyCategory = {
  title: "Women's Collection",
  description: "Explore the latest trends in women's fashion. From elegant outerwear to everyday essentials.",
  count: 142
};

const dummyProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  image: `https://placehold.co/400x500/e0e0e0/666666.png?text=Item+${i+1}`,
  title: 'Classic Jacket',
  rating: '4.8',
  price: '₹ 139,600',
  colors: ['#5c4033', '#cbbda7', '#800000']
}));

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  return (
    <main className={styles.plpLayout}>
      <CollectionHeader category={dummyCategory} />
      
      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <Filters />
        </aside>
        
        <div className={styles.gridContainer}>
          <div className={styles.toolbar}>
            <span className={styles.productCount}>Showing 1-12 of {dummyCategory.count} results</span>
            <div className={styles.sortDropdown}>
              <span>Sort by:</span>
              <CollectionSort />
            </div>
          </div>
          
          <CollectionGrid products={dummyProducts} />
          
          <div className={styles.pagination}>
            <button className={styles.pageBtn}>Previous</button>
            <div className={styles.pageNumbers}>
              <span className={styles.activePage}>1</span>
              <span>2</span>
              <span>3</span>
              <span>...</span>
              <span>12</span>
            </div>
            <button className={styles.pageBtn}>Next</button>
          </div>
        </div>
      </div>
    </main>
  );
}
