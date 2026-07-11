import Link from "next/link";

export function HomeBanner() {
  return (
    <div className="px-2 md:px-6 pt-2">
      <Link
        href="/products"
        className="block rounded-md bg-market-orange px-4 md:px-10 py-4 md:py-10"
      >
        <p className="text-white font-display font-medium text-base md:text-2xl leading-tight">
          Factory direct, no markup games
        </p>
        <p className="text-white/90 text-[11px] md:text-sm mt-1">
          Verified Chinese suppliers, one honest price
        </p>
        <span className="inline-block bg-white text-market-orange text-[11px] md:text-sm font-medium px-3 py-1 rounded-full mt-2.5">
          Shop now
        </span>
      </Link>
    </div>
  );
}
