import Link from "next/link";
import { RouteLine } from "@/components/shared/RouteLine";
import { formatNaira, calculateFinalPrice } from "@/lib/pricing";

const demoPrice = calculateFinalPrice(
  120,
  20,
  { baseCostNaira: 18000 },
  {
    officialRateNgnPerYuan: 190,
    viarnexRateNgnPerYuan: 210,
    platformFeePercent: 10,
    shippingMarkupPercent: 8,
  }
);

const steps = [
  { n: "01", label: "Order placed", detail: "One payment, even across multiple factories." },
  { n: "02", label: "Factory ships to Skyjet", detail: "Supplier prepares and hands off for export." },
  { n: "03", label: "Warehouse confirms", detail: "Supplier is paid only once the parcel is verified." },
  { n: "04", label: "Jumia delivers", detail: "Last mile inside Nigeria, tracked end to end." },
];

const badges = [
  { label: "Verified", detail: "Business registration, license, and ID checked" },
  { label: "Factory", detail: "Confirmed direct manufacturer, not a reseller" },
  { label: "Fast Dispatch", detail: "Consistently ships within stated lead time" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <p className="font-mono text-xs tracking-widest text-amber uppercase mb-6">
          Factory in Guangzhou → Doorstep in Lagos
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-porcelain max-w-2xl leading-[1.1]">
          Buy direct from verified Chinese factories.
          <span className="text-jade"> No middlemen, no guesswork.</span>
        </h1>
        <p className="text-slate-light text-lg max-w-xl mt-6">
          Viarnex verifies the supplier, converts the currency, ships the
          parcel, and protects the order — you just see one honest Naira
          price.
        </p>
        <Link
          href="/products"
          className="inline-block mt-8 bg-jade text-ink font-medium rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Browse products
        </Link>

        <div className="mt-12">
          <RouteLine />
        </div>
      </section>

      {/* Price transparency demo */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink-700">
        <h2 className="font-display text-2xl text-porcelain mb-2">
          One price. Nothing hidden.
        </h2>
        <p className="text-slate-light mb-8 max-w-lg">
          Customers never see a Yuan figure — only the final landed price,
          already covering currency conversion, shipping, and platform fee.
        </p>
        <div className="grid md:grid-cols-4 gap-px bg-ink-700 rounded-xl overflow-hidden max-w-2xl">
          <div className="bg-ink-800 p-5">
            <p className="font-mono text-xs text-slate-light uppercase">Supplier base</p>
            <p className="font-mono text-porcelain text-lg mt-1">
              {formatNaira(demoPrice.breakdown.supplierBaseNaira)}
            </p>
          </div>
          <div className="bg-ink-800 p-5">
            <p className="font-mono text-xs text-slate-light uppercase">Shipping</p>
            <p className="font-mono text-porcelain text-lg mt-1">
              {formatNaira(demoPrice.breakdown.shipping)}
            </p>
          </div>
          <div className="bg-ink-800 p-5">
            <p className="font-mono text-xs text-slate-light uppercase">Platform fee</p>
            <p className="font-mono text-porcelain text-lg mt-1">
              {formatNaira(demoPrice.breakdown.platformFee)}
            </p>
          </div>
          <div className="bg-jade p-5">
            <p className="font-mono text-xs text-ink uppercase">You pay</p>
            <p className="font-mono text-ink text-lg mt-1 font-bold">
              {formatNaira(demoPrice.finalPriceNaira)}
            </p>
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbering earns its place */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink-700">
        <h2 className="font-display text-2xl text-porcelain mb-8">
          From factory floor to your door
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.n}>
              <span className="font-mono text-amber text-sm">{step.n}</span>
              <h3 className="font-display text-porcelain mt-2">{step.label}</h3>
              <p className="text-slate-light text-sm mt-1">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink-700">
        <h2 className="font-display text-2xl text-porcelain mb-8">
          Suppliers earn trust, they don't buy it
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div key={badge.label} className="border border-ink-700 rounded-lg p-5">
              <span className="inline-block bg-jade-soft text-jade font-mono text-xs px-2 py-1 rounded">
                {badge.label}
              </span>
              <p className="text-slate-light text-sm mt-3">{badge.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
