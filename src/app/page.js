import HeroSection from "./(shop)/_components/HeroSection/HeroSection";
import CategorySection from "./(shop)/_components/CategorySection/CategorySection";
import NewArrivalsSection from "./(shop)/_components/NewArrivalsSection/NewArrivalsSection";
import ShopTheLookSection from "./(shop)/_components/ShopTheLookSection/ShopTheLookSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <NewArrivalsSection />
      <ShopTheLookSection />
    </main>
  );
}
