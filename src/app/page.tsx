import { MarketTopBar } from "@/components/layout/MarketTopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeBanner } from "@/components/shared/HomeBanner";
import { FlashSaleStrip } from "@/components/shared/FlashSaleStrip";
import { CategoryGrid } from "@/components/shared/CategoryGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { listApprovedProducts } from "@/lib/products";

export const revalidate = 60;

export default async function LandingPage() {
  const products = await listApprovedProducts();

  return (
    <main className="min-h-screen bg-market-bg pb-16 md:pb-8">
      <MarketTopBar />
      <div className="max-w-6xl mx-auto">
        <HomeBanner />
        <FlashSaleStrip />
        <CategoryGrid />

        <section className="px-2 md:px-6 pt-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-market-text font-semibold text-sm md:text-base">Recommended for you</h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-market-card rounded-md p-8 text-center">
              <p className="text-market-text-secondary text-sm">
                No approved products yet — once suppliers list and admin
                approves items, they&apos;ll show up here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
