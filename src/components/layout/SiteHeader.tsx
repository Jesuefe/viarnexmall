import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-ink-700">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-porcelain font-bold text-lg">
          Viarnex<span className="text-jade">Mall</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm">
          <Link href="/products" className="text-slate-light hover:text-porcelain transition-colors">
            Products
          </Link>
          <Link href="/cart" className="text-slate-light hover:text-porcelain transition-colors">
            Cart
          </Link>
          <Link href="/dashboard" className="text-slate-light hover:text-porcelain transition-colors">
            My Orders
          </Link>
        </nav>
      </div>
    </header>
  );
}
