import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/pricing";
import type { ProductListItem } from "@/lib/products";

// Dense, price-forward card in the 1688 mold: image fills most of the
// card, price is bold and red with "from" framing (wholesale MOQ pricing),
// badges and MOQ sit as small tags rather than prose.
export function ProductCard({ product }: { product: ProductListItem }) {
  const image = product.images[0];
  // Alternates until a real "shippingIncluded" / "isFactory" field exists on the product.
  const badge = product.id.charCodeAt(0) % 2 === 0 ? "Free shipping" : "Factory direct";

  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-market-card rounded-md overflow-hidden active:opacity-80"
    >
      <div className="aspect-square bg-market-bg relative">
        {image ? (
          <Image
            src={image}
            alt={product.nameEn}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-market-text-secondary text-xs">
            No image
          </div>
        )}
        <span className="absolute top-1.5 left-1.5 bg-market-orange text-white text-[9px] px-1.5 py-0.5 rounded">
          {badge}
        </span>
      </div>

      <div className="px-2 py-2">
        <h3 className="text-market-text text-[11px] leading-snug line-clamp-2 h-7">
          {product.nameEn}
        </h3>

        <p className="text-market-price font-medium text-[15px] mt-1.5">
          from {formatNaira(product.displayPriceNaira)}
        </p>

        <div className="flex items-center gap-1 mt-1 flex-wrap">
          <span className="text-[9px] text-market-text-secondary border border-market-border rounded px-1 py-px">
            MOQ {product.moq}
          </span>
          {product.reviewCount > 0 && (
            <span className="text-[9px] text-market-gold">
              ★ {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          )}
        </div>

        <p className="text-[9px] text-market-text-secondary mt-1 truncate">
          {product.supplierName}
        </p>
      </div>
    </Link>
  );
}
