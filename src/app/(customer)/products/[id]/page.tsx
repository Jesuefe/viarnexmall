import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft, MessageCircle, Store } from "lucide-react";
import Link from "next/link";
import { formatNaira } from "@/lib/pricing";
import { getProductById } from "@/lib/products";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-market-bg pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto md:grid md:grid-cols-2 md:gap-8 md:px-6 md:pt-6">
        {/* Image with floating back button, like a 1688 product page */}
        <div className="relative aspect-square bg-market-card md:rounded-md md:overflow-hidden">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.nameEn} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-market-text-secondary text-xs">
              No image
            </div>
          )}
          <Link
            href="/products"
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white md:hidden"
          >
            <ChevronLeft size={18} />
          </Link>
        </div>

        <div>
          {/* Price block — red price on white, MOQ tag, matches the card */}
          <div className="bg-market-card px-3 md:px-0 py-3 md:rounded-md">
            <div className="flex items-baseline gap-2">
              <span className="text-market-price font-bold text-2xl md:text-3xl">
                {formatNaira(product.displayPriceNaira)}
              </span>
              <span className="text-market-text-secondary text-xs md:text-sm">at MOQ {product.moq}</span>
            </div>
            <h1 className="text-market-text text-sm md:text-lg mt-2 leading-snug">{product.nameEn}</h1>
            {product.reviewCount > 0 && (
              <p className="text-market-gold text-xs md:text-sm mt-1">
                ★ {product.rating.toFixed(1)} · {product.reviewCount} reviews
              </p>
            )}

            {/* Desktop-only inline action buttons — mobile uses the fixed bottom bar instead */}
            <div className="hidden md:flex gap-3 mt-5">
              <button className="flex-1 bg-market-orange-soft text-market-orange font-medium text-sm rounded-md py-3">
                Add to cart
              </button>
              <button className="flex-1 bg-market-orange text-white font-medium text-sm rounded-md py-3">
                Buy now
              </button>
              <button className="w-12 flex items-center justify-center text-market-text-secondary border border-market-border rounded-md">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>

          {/* Pricing tiers — bulk discount table, core to the 1688 wholesale feel */}
          {product.pricingTiers.length > 0 && (
            <div className="bg-market-card mt-2 px-3 md:px-0 py-3">
              <p className="text-market-text text-xs md:text-sm font-semibold mb-2">Bulk pricing</p>
              <div className="border border-market-border rounded divide-y divide-market-border">
                {product.pricingTiers.map((tier) => (
                  <div key={tier.minQty} className="flex justify-between px-3 py-2 text-xs md:text-sm">
                    <span className="text-market-text-secondary">{tier.minQty}+ units</span>
                    <span className="text-market-text font-medium">¥{tier.unitPriceYuan} / unit (factory price)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="bg-market-card mt-2 px-3 md:px-0 py-3">
              <p className="text-market-text text-xs md:text-sm font-semibold mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <span
                    key={variant.id}
                    className="text-xs md:text-sm border border-market-border rounded px-2 py-1 text-market-text"
                  >
                    {Object.values(variant.attributes).join(" / ")} · {variant.stock} in stock
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Supplier strip */}
          <div className="bg-market-card mt-2 px-3 md:px-0 py-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-market-orange-soft flex items-center justify-center text-market-orange">
              <Store size={16} />
            </div>
            <div>
              <p className="text-market-text text-xs md:text-sm font-medium">{product.supplierName}</p>
              <p className="text-market-text-secondary text-[10px] md:text-xs">Verified factory supplier</p>
            </div>
          </div>

          {product.descriptionEn && (
            <div className="bg-market-card mt-2 px-3 md:px-0 py-3">
              <p className="text-market-text text-xs md:text-sm font-semibold mb-2">Description</p>
              <p className="text-market-text-secondary text-xs md:text-sm leading-relaxed">{product.descriptionEn}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom action bar — mobile only, matches the 1688 pattern */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-market-border flex items-stretch h-14 md:hidden">
        <button className="w-14 flex flex-col items-center justify-center text-market-text-secondary gap-0.5">
          <MessageCircle size={18} />
          <span className="text-[9px]">Chat</span>
        </button>
        <button className="flex-1 bg-market-orange-soft text-market-orange font-medium text-sm">
          Add to cart
        </button>
        <button className="flex-1 bg-market-orange text-white font-medium text-sm">
          Buy now
        </button>
      </div>
    </main>
  );
}
