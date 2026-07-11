import Link from "next/link";
import { Zap } from "lucide-react";

// Static countdown for now — swap for a real client-side ticking timer
// once an actual flash-sale end time is coming from the database.
export function FlashSaleStrip() {
  return (
    <Link
      href="/products"
      className="mx-2 mt-2 bg-white rounded-md px-3 py-2.5 flex items-center justify-between"
    >
      <div className="flex items-center gap-1.5">
        <Zap size={16} className="text-market-price" fill="currentColor" />
        <span className="text-market-text text-xs font-medium">Flash sale</span>
        <span className="text-market-price text-[10px] bg-market-orange-soft rounded px-1.5 py-0.5">
          ends 02:14:33
        </span>
      </div>
      <span className="text-market-text-secondary text-[11px]">See all</span>
    </Link>
  );
}
