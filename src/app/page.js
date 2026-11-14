import HeroSection from "./(shop)/_components/HeroSection/HeroSection";
import CategorySection from "./(shop)/_components/CategorySection/CategorySection";
import NewArrivalsSection from "./(shop)/_components/NewArrivalsSection/NewArrivalsSection";
import ShopTheLookSection from "./(shop)/_components/ShopTheLookSection/ShopTheLookSection";
import { getProducts } from "@/lib/storefront/products";
import { getStorefrontConfig } from "@/lib/storefront/config";

export default async function Home() {
  const [products, config] = await Promise.all([
    getProducts().catch(() => []),
    getStorefrontConfig().catch(() => ({})),
  ]);

  return (
    <main>
      <HeroSection title={config?.home?.heroTitle} products={products} />
      <CategorySection />
      <NewArrivalsSection products={products} />
      <ShopTheLookSection />
    </main>
  );
}
