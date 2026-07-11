import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { listApprovedProducts } from "@/lib/products";

export const revalidate = 60; // re-fetch approved products at most once a minute

export default async function ProductsPage() {
  const products = await listApprovedProducts();

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-porcelain mb-2">Products</h1>
        <p className="text-slate-light mb-8">
          Verified suppliers, one landed price — nothing else to negotiate.
        </p>

        {products.length === 0 ? (
          <div className="border border-dashed border-ink-700 rounded-lg p-12 text-center">
            <p className="text-slate-light">
              No approved products yet. Once a supplier lists a product and
              admin approves it, it'll show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
