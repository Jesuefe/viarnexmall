import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft, MessageCircle, Store } from "lucide-react";
import Link from "next/link";
import { formatNaira } from "@/lib/pricing";
import { getProductById } from "@/lib/products";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-market-bg max-w-md mx-auto pb-20">
      {/* Image with floating back button, like a 1688 product page */}
      <div className="relative aspect-square bg-market-card">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.nameEn} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-market-text-secondary text-xs">
            No image
          </div>
        )}
        <Link
          href="/products"
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white"
        >
          <ChevronLeft size={18} />
        </Link>
      </div>

      {/* Price block — red price on white, MOQ tag, matches the card */}
      <div className="bg-market-card px-3 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-market-price font-bold text-2xl">
            {formatNaira(product.displayPriceNaira)}
          </span>
          <span className="text-market-text-secondary text-xs">at MOQ {product.moq}</span>
        </div>
        <h1 className="text-market-text text-sm mt-2 leading-snug">{product.nameEn}</h1>
        {product.reviewCount > 0 && (
          <p className="text-market-gold text-xs mt-1">
            ★ {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </p>
        )}
      </div>

      {/* Pricing tiers — bulk discount table, core to the 1688 wholesale feel */}
      {product.pricingTiers.length > 0 && (
        <div className="bg-market-card mt-2 px-3 py-3">
          <p className="text-market-text text-xs font-semibold mb-2">Bulk pricing</p>
          <div className="border border-market-border rounded divide-y divide-market-border">
            {product.pricingTiers.map((tier) => (
              <div key={tier.minQty} className="flex justify-between px-3 py-2 text-xs">
                <span className="text-market-text-secondary">{tier.minQty}+ units</span>
                <span className="text-market-text font-medium">¥{tier.unitPriceYuan} / unit (factory price)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants */}
      {product.variants.length > 0 && (
        <div className="bg-market-card mt-2 px-3 py-3">
          <p className="text-market-text text-xs font-semibold mb-2">Options</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <span
                key={variant.id}
                className="text-xs border border-market-border rounded px-2 py-1 text-market-text"
              >
                {Object.values(variant.attributes).join(" / ")} · {variant.stock} in stock
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Supplier strip */}
      <div className="bg-market-card mt-2 px-3 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-market-orange-soft flex items-center justify-center text-market-orange">
          <Store size={16} />
        </div>
        <div>
          <p className="text-market-text text-xs font-medium">{product.supplierName}</p>
          <p className="text-market-text-secondary text-[10px]">Verified factory supplier</p>
        </div>
      </div>

      {product.descriptionEn && (
        <div className="bg-market-card mt-2 px-3 py-3">
          <p className="text-market-text text-xs font-semibold mb-2">Description</p>
          <p className="text-market-text-secondary text-xs leading-relaxed">{product.descriptionEn}</p>
        </div>
      )}

      {/* Fixed bottom action bar — the 1688 pattern: message + cart + buy */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-market-border flex items-stretch h-14">
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
