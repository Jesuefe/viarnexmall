import { MarketTopBar } from "@/components/layout/MarketTopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCard } from "@/components/product/ProductCard";
import { listApprovedProducts } from "@/lib/products";

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await listApprovedProducts();

  return (
    <main className="min-h-screen bg-market-bg max-w-md mx-auto pb-16">
      <MarketTopBar />

      <section className="px-2 py-3">
        {products.length === 0 ? (
          <div className="bg-market-card rounded-md p-8 text-center mt-2">
            <p className="text-market-text-secondary text-sm">
              No approved products yet. Once a supplier lists a product and
              admin approves it, it'll show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
