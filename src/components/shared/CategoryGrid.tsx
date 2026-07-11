import {
  Smartphone,
  Shirt,
  Sofa,
  Sparkles,
  Baby,
  Wrench,
  Package,
  Grid3x3,
} from "lucide-react";

const categories = [
  { label: "Electronics", icon: Smartphone },
  { label: "Apparel", icon: Shirt },
  { label: "Home", icon: Sofa },
  { label: "Beauty", icon: Sparkles },
  { label: "Toys", icon: Baby },
  { label: "Tools", icon: Wrench },
  { label: "Packaging", icon: Package },
  { label: "All", icon: Grid3x3 },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-y-3 px-2 md:px-6 py-3 bg-market-card mx-2 md:mx-6 mt-2 rounded-md">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <div key={cat.label} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-market-orange-soft flex items-center justify-center text-market-orange">
              <Icon size={18} />
            </div>
            <span className="text-[10px] text-market-text">{cat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
