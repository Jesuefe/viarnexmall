"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Plus, X } from "lucide-react";
import { createProduct } from "../../../actions";

const CATEGORIES = ["Electronics", "Apparel", "Home & Kitchen", "Beauty", "Toys", "Auto Parts", "Machinery"];

export default function NewProductPage() {
  const [state, formAction] = useFormState(createProduct, {});
  const [tiers, setTiers] = useState([{ id: 1 }]);
  const [variants, setVariants] = useState([{ id: 1 }]);

  return (
    <main className="min-h-screen bg-market-bg pb-16">
      <header className="bg-market-orange px-4 py-4">
        <h1 className="text-white font-display text-lg font-medium">List a new product</h1>
        <p className="text-white/90 text-xs mt-1">
          Submitted products need admin approval before they go live.
        </p>
      </header>

      <form action={formAction} className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {state.error && (
          <p className="bg-market-orange-soft text-market-price text-sm rounded-md px-3 py-2">
            {state.error}
          </p>
        )}

        {/* Basic info */}
        <section className="bg-market-card rounded-md p-4 space-y-3">
          <p className="text-market-text text-sm font-semibold">Basic information</p>

          <div>
            <label className="block text-xs text-market-text-secondary mb-1">Product name</label>
            <input
              name="nameEn"
              required
              className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">Category</label>
              <select
                name="category"
                required
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">SKU</label>
              <input
                name="sku"
                required
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-market-text-secondary mb-1">Description</label>
            <textarea
              name="descriptionEn"
              rows={3}
              className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
            />
          </div>

          <div>
            <label className="block text-xs text-market-text-secondary mb-1">
              Image URL (Bunny.net upload coming later — paste a hosted image link for now)
            </label>
            <input
              name="imageUrl"
              type="url"
              placeholder="https://..."
              className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
            />
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-market-card rounded-md p-4 space-y-3">
          <p className="text-market-text text-sm font-semibold">Pricing</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">Base price (¥ / unit)</label>
              <input
                name="basePriceYuan"
                type="number"
                step="0.01"
                required
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">MOQ</label>
              <input
                name="moq"
                type="number"
                required
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-market-text-secondary mb-2">
              Bulk pricing tiers (optional)
            </label>
            <div className="space-y-2">
              {tiers.map((tier, i) => (
                <div key={tier.id} className="flex gap-2 items-center">
                  <input
                    name="tierMinQty"
                    type="number"
                    placeholder="Min qty"
                    className="flex-1 border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
                  />
                  <input
                    name="tierPriceYuan"
                    type="number"
                    step="0.01"
                    placeholder="¥ / unit"
                    className="flex-1 border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
                  />
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTiers(tiers.filter((t) => t.id !== tier.id))}
                      className="text-market-text-secondary"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTiers([...tiers, { id: Date.now() }])}
              className="flex items-center gap-1 text-market-orange text-xs font-medium mt-2"
            >
              <Plus size={14} /> Add tier
            </button>
          </div>
        </section>

        {/* Variants */}
        <section className="bg-market-card rounded-md p-4 space-y-3">
          <p className="text-market-text text-sm font-semibold">Variants (optional)</p>
          <div className="space-y-2">
            {variants.map((variant, i) => (
              <div key={variant.id} className="flex gap-2 items-center">
                <input
                  name="variantLabel"
                  placeholder="e.g. Black, XL, 220V"
                  className="flex-1 border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
                />
                <input
                  name="variantStock"
                  type="number"
                  placeholder="Stock"
                  className="w-28 border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setVariants(variants.filter((v) => v.id !== variant.id))}
                    className="text-market-text-secondary"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setVariants([...variants, { id: Date.now() }])}
            className="flex items-center gap-1 text-market-orange text-xs font-medium"
          >
            <Plus size={14} /> Add variant
          </button>
        </section>

        {/* Shipping */}
        <section className="bg-market-card rounded-md p-4 space-y-3">
          <p className="text-market-text text-sm font-semibold">Shipping</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">Net weight (kg)</label>
              <input
                name="netWeightKg"
                type="number"
                step="0.01"
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">Gross weight (kg)</label>
              <input
                name="grossWeightKg"
                type="number"
                step="0.01"
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">Length (cm)</label>
              <input
                name="lengthCm"
                type="number"
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">Width (cm)</label>
              <input
                name="widthCm"
                type="number"
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
            <div>
              <label className="block text-xs text-market-text-secondary mb-1">Height (cm)</label>
              <input
                name="heightCm"
                type="number"
                className="w-full border border-market-border rounded-md px-3 py-2 text-sm outline-none focus:border-market-orange"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            {[
              { name: "battery", label: "Contains battery" },
              { name: "liquid", label: "Contains liquid" },
              { name: "magnetic", label: "Magnetic" },
              { name: "fragile", label: "Fragile" },
            ].map((flag) => (
              <label key={flag.name} className="flex items-center gap-1.5 text-xs text-market-text">
                <input type="checkbox" name={flag.name} className="accent-market-orange" />
                {flag.label}
              </label>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-market-orange text-white font-medium rounded-md py-3 text-sm"
        >
          Submit for approval
        </button>
      </form>
    </main>
  );
}
