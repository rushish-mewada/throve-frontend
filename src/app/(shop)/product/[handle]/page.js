import ProductGallery from './_components/ProductGallery/ProductGallery';
import ProductInfo from './_components/ProductInfo/ProductInfo';
import ProductGrid from './_components/ProductGrid/ProductGrid';
import ProductReviews from './_components/ProductReviews/ProductReviews';
import styles from './page.module.css';

// Dummy data matching the visual design
const dummyProduct = {
  id: 'prod_1',
  title: 'Long Sleeve Jacket',
  collection: 'Spring summer collection',
  oldPrice: '₹4000.00',
  price: '₹2800.00',
  sold: '1,238',
  rating: '4.5',
  category: 'Women',
  subcategory: "Women's Shirts & Tops",
  description: 'Boba etiam ut bulla tea est potus dilectus singulari compositione saporum et textuum, quae in Taiwan annis 1980 orta sunt. Boba refert ad pilas masticas tapiocas in fundo potus inventas, quae typice lacte tea nigro sapiuntur. Boba phaenomenon.',
  images: [
    'https://placehold.co/800x1000/f5f5f5/666666.png?text=Main+Jacket',
    'https://placehold.co/800x1000/e0e0e0/666666.png?text=View+2',
    'https://placehold.co/800x1000/cccccc/666666.png?text=View+3',
    'https://placehold.co/800x1000/d5d5d5/666666.png?text=View+4',
    'https://placehold.co/800x1000/e5e5e5/666666.png?text=View+5',
  ],
  colors: [
    { id: 'c1', name: 'Peach', hex: '#b57b61' },
    { id: 'c2', name: 'Sand', hex: '#cbbda7' },
    { id: 'c3', name: 'Burgundy', hex: '#5f1e24' }
  ],
  variants: [
    { id: 'v1', name: '6' },
    { id: 'v2', name: '8' },
    { id: 'v3', name: '10' },
    { id: 'v4', name: '14' },
    { id: 'v5', name: '18' },
    { id: 'v6', name: '20' }
  ]
};

const dummyRelatedProducts = [
  { id: 1, image: 'https://placehold.co/400x500/e0e0e0/666666.png?text=Brown+Jacket', title: 'Brown Jacket', rating: '4.8', price: '₹ 139,600', colors: ['#5c4033', '#cbbda7', '#800000'] },
  { id: 2, image: 'https://placehold.co/400x500/d5d5d5/666666.png?text=Denim+Shirt', title: 'Brown Jacket', rating: '4.8', price: '₹ 139,600', colors: ['#5c4033', '#cbbda7', '#800000'] },
  { id: 3, image: 'https://placehold.co/400x500/e5e5e5/666666.png?text=Polo+Shirt', title: 'Brown Jacket', rating: '4.8', price: '₹ 139,600', colors: ['#5c4033', '#cbbda7', '#800000'] },
  { id: 4, image: 'https://placehold.co/400x500/cccccc/666666.png?text=Jeans', title: 'Brown Jacket', rating: '4.8', price: '₹ 139,600', colors: ['#5c4033', '#cbbda7', '#800000'] }
];

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = dummyProduct;

  return (
    <main className={styles.pdpLayout}>
      <div className={styles.breadcrumbs}>
        <span>Homepage</span> &gt; <span>{product.category}</span> &gt; <span>{product.subcategory}</span> &gt; <span>{product.title}</span>
      </div>
      
      <div className={styles.topSection}>
        <div className={styles.galleryColumn}>
          <ProductGallery images={product.images} />
        </div>
        <div className={styles.infoColumn}>
          <ProductInfo product={product} />
        </div>
      </div>
      
      <ProductGrid title="Related Product" products={dummyRelatedProducts} seeAllLink="#" />
      
      <ProductReviews />

      <ProductGrid title="Popular this week" products={dummyRelatedProducts} seeAllLink="#" />
    </main>
  );
}
