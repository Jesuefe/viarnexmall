import Link from "next/link";
import { Home, Grid3x3, ShoppingCart, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Categories", icon: Grid3x3 },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/dashboard", label: "Mine", icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-market-border flex justify-around items-center h-14 max-w-md mx-auto md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-0.5 text-market-text-secondary flex-1 h-full"
          >
            <Icon size={20} />
            <span className="text-[10px]">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
