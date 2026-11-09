import CollectionHeader from './_components/CollectionHeader/CollectionHeader';
import CollectionClient from './_components/CollectionClient/CollectionClient';
import { LAUNCH_PRODUCTS } from '@/lib/catalog';
import styles from './page.module.css';

const COLLECTIONS_CONFIG = {
  men: {
    category: {
      title: "Men's Collection",
      description: "Sharp silhouettes, architectural collars, and tailored cuts engineered for modern men.",
      count: 2,
    },
    filterCategories: ['Tailored Shirts', 'Trousers'],
    products: LAUNCH_PRODUCTS.filter((p) => p.category === 'Men').map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      category: p.filterCategory,
      image: p.images[0],
      colors: p.colorHexes,
      sizes: p.sizes,
      handle: p.handle,
    })),
  },
  women: {
    category: {
      title: "Women's Collection",
      description: "Contoured princess seams, architectural sheath lines, and sculptured silhouettes.",
      count: 4,
    },
    filterCategories: ['Dresses', 'Shirts & Tops', 'Bottoms'],
    products: LAUNCH_PRODUCTS.filter((p) => p.category === 'Women').map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      category: p.filterCategory,
      image: p.images[0],
      colors: p.colorHexes,
      sizes: p.sizes,
      handle: p.handle,
    })),
  },
  'new-arrivals': {
    category: {
      title: "New Arrivals",
      description: "First launch edition. Six debut pieces defined by precision tech-pack tailoring and bespoke details.",
      count: 6,
    },
    filterCategories: ['Dresses', 'Tailored Shirts', 'Shirts & Tops', 'Trousers', 'Bottoms'],
    products: LAUNCH_PRODUCTS.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      category: p.filterCategory,
      image: p.images[0],
      colors: p.colorHexes,
      sizes: p.sizes,
      handle: p.handle,
    })),
  },
  sale: {
    category: {
      title: "Privilege Launch Archive",
      description: "Exclusive launch privilege pricing on our inaugural collection.",
      count: 6,
    },
    filterCategories: ['Dresses', 'Tailored Shirts', 'Shirts & Tops', 'Trousers', 'Bottoms'],
    products: LAUNCH_PRODUCTS.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      category: p.filterCategory,
      image: p.images[0],
      colors: p.colorHexes,
      sizes: p.sizes,
      handle: p.handle,
    })),
  },
  dresses: {
    category: {
      title: "Architectural Dresses",
      description: "Precision tailored mini & princess sheath silhouettes crafted for contemporary luxury occasions.",
      count: 2,
    },
    filterCategories: ['Dresses'],
    products: LAUNCH_PRODUCTS.filter((p) => p.subcategory === 'Dresses').map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      category: p.filterCategory,
      image: p.images[0],
      colors: p.colorHexes,
      sizes: p.sizes,
      handle: p.handle,
    })),
  },
  shirts: {
    category: {
      title: "Tailored Shirts & Tops",
      description: "Architectural overlapping collars, bespoke buttons, and sculpted sweetheart tailoring.",
      count: 2,
    },
    filterCategories: ['Tailored Shirts', 'Shirts & Tops'],
    products: LAUNCH_PRODUCTS.filter((p) => p.filterCategory === 'Tailored Shirts' || p.filterCategory === 'Shirts & Tops').map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      category: p.filterCategory,
      image: p.images[0],
      colors: p.colorHexes,
      sizes: p.sizes,
      handle: p.handle,
    })),
  },
  trousers: {
    category: {
      title: "Tailored Trousers & Pants",
      description: "Italian Riviera double-pleat formal trousers and sweeping high-waisted circular flare tailoring.",
      count: 2,
    },
    filterCategories: ['Trousers', 'Bottoms'],
    products: LAUNCH_PRODUCTS.filter((p) => p.filterCategory === 'Trousers' || p.filterCategory === 'Bottoms').map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      category: p.filterCategory,
      image: p.images[0],
      colors: p.colorHexes,
      sizes: p.sizes,
      handle: p.handle,
    })),
  },
};

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const rawHandle = (resolvedParams?.handle || 'women').toLowerCase();
  
  // Resolve matched data, or fallback to women
  const collectionData = COLLECTIONS_CONFIG[rawHandle] || COLLECTIONS_CONFIG.women;

  return (
    <main className={styles.plpLayout}>
      <CollectionHeader category={collectionData.category} />
      <CollectionClient
        initialCategory={collectionData.category}
        initialProducts={collectionData.products}
        filterCategories={collectionData.filterCategories}
      />
    </main>
  );
}
