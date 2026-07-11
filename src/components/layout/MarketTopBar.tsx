import { Search, ScanLine, MessageCircle } from "lucide-react";
import Link from "next/link";

export function MarketTopBar() {
  return (
    <header className="sticky top-0 z-20 bg-market-orange">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <Link href="/" className="font-display font-bold text-white text-lg shrink-0">
          Viarnex
        </Link>
        <div className="flex-1 flex items-center bg-white rounded-full px-3 py-2 gap-2">
          <Search size={16} className="text-market-text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Search factory-direct products"
            className="flex-1 text-sm text-market-text placeholder:text-market-text-secondary outline-none bg-transparent min-w-0"
          />
          <ScanLine size={16} className="text-market-text-secondary shrink-0" />
        </div>
        <Link href="/messages" className="shrink-0 text-white">
          <MessageCircle size={22} />
        </Link>
      </div>

      {/* Category rail — horizontal scroll, thumb-friendly on mobile */}
      <div className="flex gap-4 px-3 pb-2 overflow-x-auto no-scrollbar text-xs text-white/90">
        {["All", "Electronics", "Apparel", "Home & Kitchen", "Beauty", "Toys", "Auto Parts", "Machinery"].map(
          (cat) => (
            <span key={cat} className="whitespace-nowrap py-0.5 first:font-semibold first:text-white">
              {cat}
            </span>
          )
        )}
      </div>
    </header>
  );
}
