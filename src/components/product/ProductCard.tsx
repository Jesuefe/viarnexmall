import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/pricing";
import type { ProductListItem } from "@/lib/products";

export function ProductCard({ product }: { product: ProductListItem }) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block border border-ink-700 rounded-lg overflow-hidden hover:border-jade transition-colors"
    >
      <div className="aspect-square bg-ink-800 relative">
        {image ? (
          <Image
            src={image}
            alt={product.nameEn}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate text-xs font-mono">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-mono text-xs text-slate-light uppercase mb-1">{product.category}</p>
        <h3 className="text-porcelain text-sm leading-snug line-clamp-2 group-hover:text-jade transition-colors">
          {product.nameEn}
        </h3>
        <p className="font-mono text-amber text-base mt-2">
          from {formatNaira(product.displayPriceNaira)}
        </p>
        <p className="text-slate-light text-xs mt-1">
          MOQ {product.moq} · {product.supplierName}
        </p>
      </div>
    </Link>
  );
}
