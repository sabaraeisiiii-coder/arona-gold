import { StoreShell } from "./components/StoreShell";
import { HomeHero } from "./components/home/HomeHero";
import { GoldPriceStrip } from "./components/home/GoldPriceStrip";
import { ProductSection } from "./components/home/ProductSection";
import { TrustSection } from "./components/home/TrustSection";
import { goldPriceSnapshot } from "./data/mock/market";
import { getFeaturedProducts } from "./services/product.service";
export default async function HomePage() {
  const products = await getFeaturedProducts();
  return (
    <StoreShell>
      <HomeHero />
      <GoldPriceStrip {...goldPriceSnapshot} />
      <ProductSection title="محصولات ویژه" products={products} />
      <TrustSection />
    </StoreShell>
  );
}
