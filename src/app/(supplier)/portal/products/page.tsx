import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getCurrentSupplier, listSupplierProducts } from "@/lib/suppliers";

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-jade-soft text-jade",
  pending: "bg-market-orange-soft text-market-orange",
  rejected: "bg-market-orange-soft text-market-price",
};

export default async function SupplierProductsPage() {
  const supplier = await getCurrentSupplier();
  if (!supplier) redirect("/login");

  const products = await listSupplierProducts(supplier.id);

  return (
    <main className="min-h-screen bg-market-bg pb-16">
      <header className="bg-market-orange px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-display text-lg font-medium">{supplier.companyName}</h1>
          <p className="text-white/90 text-xs mt-1 capitalize">{supplier.verificationStatus} supplier</p>
        </div>
        <Link
          href="/portal/products/new"
          className="bg-white text-market-orange text-sm font-medium rounded-md px-3 py-2 flex items-center gap-1"
        >
          <Plus size={16} /> Add product
        </Link>
      </header>

      <section className="max-w-2xl mx-auto px-4 py-4">
        {products.length === 0 ? (
          <div className="bg-market-card rounded-md p-8 text-center">
            <p className="text-market-text-secondary text-sm mb-3">
              You haven&apos;t listed any products yet.
            </p>
            <Link href="/portal/products/new" className="text-market-orange text-sm font-medium">
              List your first product
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="bg-market-card rounded-md p-3 flex gap-3 items-center">
                <div className="w-14 h-14 bg-market-bg rounded shrink-0 relative overflow-hidden">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.nameEn} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-market-text text-sm truncate">{product.nameEn}</p>
                  <p className="text-market-text-secondary text-xs">
                    ¥{product.basePriceYuan} · MOQ {product.moq} · {product.category}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-1 rounded capitalize shrink-0 ${
                    STATUS_STYLES[product.approvalStatus] ?? "bg-market-bg text-market-text-secondary"
                  }`}
                >
                  {product.approvalStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
