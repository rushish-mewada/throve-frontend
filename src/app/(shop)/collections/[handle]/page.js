import CollectionHeader from './_components/CollectionHeader/CollectionHeader';
import CollectionClient from './_components/CollectionClient/CollectionClient';
import { LAUNCH_PRODUCTS } from '@/lib/catalog';
import { getProducts } from '@/lib/storefront/products';
import styles from './page.module.css';

function buildCollectionsConfig(sourceProducts) {
  const mapCard = (p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    priceNum: p.priceNum,
    rating: p.rating,
    category: p.filterCategory,
    image: p.images[0] || '/products/asymmetric-mandarin-shirt/main.jpg',
    colors: p.colorHexes,
    sizes: p.sizes,
    handle: p.handle,
  });

  const men = sourceProducts.filter((p) => String(p.category).toLowerCase() === 'men').map(mapCard);
  const women = sourceProducts.filter((p) => String(p.category).toLowerCase() === 'women').map(mapCard);
  const all = sourceProducts.map(mapCard);
  const dresses = sourceProducts.filter((p) => String(p.subcategory).toLowerCase() === 'dresses').map(mapCard);
  const shirts = sourceProducts
    .filter((p) => ['tailored shirts', 'shirts & tops', 'shirts'].includes(String(p.filterCategory).toLowerCase()))
    .map(mapCard);
  const trousers = sourceProducts
    .filter((p) => ['trousers', 'bottoms'].includes(String(p.filterCategory).toLowerCase()))
    .map(mapCard);

  return {
    men: {
      category: {
        title: "Men's Collection",
        description: "Sharp silhouettes, architectural collars, and tailored cuts engineered for modern men.",
        count: men.length,
      },
      filterCategories: ['Tailored Shirts', 'Trousers'],
      products: men,
    },
    women: {
      category: {
        title: "Women's Collection",
        description: "Contoured princess seams, architectural sheath lines, and sculptured silhouettes.",
        count: women.length,
      },
      filterCategories: ['Dresses', 'Shirts & Tops', 'Bottoms'],
      products: women,
    },
    'new-arrivals': {
      category: {
        title: "New Arrivals",
        description: "First launch edition. Debut pieces defined by precision tech-pack tailoring and bespoke details.",
        count: all.length,
      },
      filterCategories: ['Dresses', 'Tailored Shirts', 'Shirts & Tops', 'Trousers', 'Bottoms'],
      products: all,
    },
    sale: {
      category: {
        title: "Privilege Launch Archive",
        description: "Exclusive launch privilege pricing on our inaugural collection.",
        count: all.length,
      },
      filterCategories: ['Dresses', 'Tailored Shirts', 'Shirts & Tops', 'Trousers', 'Bottoms'],
      products: all,
    },
    dresses: {
      category: {
        title: "Architectural Dresses",
        description: "Precision tailored mini & princess sheath silhouettes crafted for contemporary luxury occasions.",
        count: dresses.length,
      },
      filterCategories: ['Dresses'],
      products: dresses,
    },
    shirts: {
      category: {
        title: "Tailored Shirts & Tops",
        description: "Architectural overlapping collars, bespoke buttons, and sculpted sweetheart tailoring.",
        count: shirts.length,
      },
      filterCategories: ['Tailored Shirts', 'Shirts & Tops'],
      products: shirts,
    },
    trousers: {
      category: {
        title: "Tailored Trousers & Pants",
        description: "Italian Riviera double-pleat formal trousers and sweeping high-waisted circular flare tailoring.",
        count: trousers.length,
      },
      filterCategories: ['Trousers', 'Bottoms'],
      products: trousers,
    },
  };
}

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const rawHandle = (resolvedParams?.handle || 'women').toLowerCase();

  let liveProducts = [];
  try {
    liveProducts = await getProducts();
  } catch {
    liveProducts = [];
  }

  const sourceProducts = liveProducts.length > 0 ? liveProducts : LAUNCH_PRODUCTS;
  const configs = buildCollectionsConfig(sourceProducts);
  const collectionData = configs[rawHandle] || configs.women;

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
