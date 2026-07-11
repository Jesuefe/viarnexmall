import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { formatNaira } from "@/lib/pricing";
import { getProductById } from "@/lib/products";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-ink-800 rounded-lg relative overflow-hidden">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.nameEn} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate text-xs font-mono">
              No image
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs text-slate-light uppercase mb-2">{product.category}</p>
          <h1 className="font-display text-3xl text-porcelain leading-tight">{product.nameEn}</h1>
          <p className="text-slate-light text-sm mt-2">{product.supplierName}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono text-amber text-3xl">
              {formatNaira(product.displayPriceNaira)}
            </span>
            <span className="text-slate-light text-sm">at MOQ {product.moq}</span>
          </div>

          {product.pricingTiers.length > 0 && (
            <div className="mt-6 border border-ink-700 rounded-lg divide-y divide-ink-700">
              {product.pricingTiers.map((tier) => (
                <div key={tier.minQty} className="flex justify-between px-4 py-2 text-sm">
                  <span className="text-slate-light">{tier.minQty}+ units</span>
                  <span className="font-mono text-porcelain">¥{tier.unitPriceYuan} / unit (factory price)</span>
                </div>
              ))}
            </div>
          )}

          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-slate-light mb-2">Available variants</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <span
                    key={variant.id}
                    className="font-mono text-xs border border-ink-700 rounded px-2 py-1 text-porcelain"
                  >
                    {Object.values(variant.attributes).join(" / ")} · {variant.stock} in stock
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.descriptionEn && (
            <p className="text-slate-light text-sm mt-8 leading-relaxed">{product.descriptionEn}</p>
          )}

          <button className="mt-8 w-full bg-jade text-ink font-medium rounded-lg py-3 hover:opacity-90 transition-opacity">
            Add to cart
          </button>
        </div>
      </section>
    </main>
  );
}
