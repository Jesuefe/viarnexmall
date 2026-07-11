// Currency + revenue engine.
// Supplier sets a Yuan price; the customer only ever sees a final Naira price.
// Chain: Supplier Price -> Currency Margin -> Shipping Margin -> Platform Fee -> Final Price

export interface RateConfig {
  officialRateNgnPerYuan: number; // e.g. 190
  viarnexRateNgnPerYuan: number; // e.g. 210 — the configured margin lives here
  platformFeePercent: number; // e.g. 10
  shippingMarkupPercent: number; // admin-configurable
}

export interface ShippingCost {
  baseCostNaira: number; // computed from weight/volume elsewhere
}

export function calculateFinalPrice(
  supplierPriceYuan: number,
  quantity: number,
  shipping: ShippingCost,
  rates: RateConfig
): { finalPriceNaira: number; breakdown: Record<string, number> } {
  const baseNaira = supplierPriceYuan * quantity * rates.viarnexRateNgnPerYuan;
  const currencyMargin =
    supplierPriceYuan * quantity * (rates.viarnexRateNgnPerYuan - rates.officialRateNgnPerYuan);
  const shippingWithMarkup =
    shipping.baseCostNaira * (1 + rates.shippingMarkupPercent / 100);
  const subtotal = baseNaira + shippingWithMarkup;
  const platformFee = subtotal * (rates.platformFeePercent / 100);
  const finalPriceNaira = Math.round(subtotal + platformFee);

  return {
    finalPriceNaira,
    breakdown: {
      supplierBaseNaira: Math.round(baseNaira),
      currencyMargin: Math.round(currencyMargin),
      shipping: Math.round(shippingWithMarkup),
      platformFee: Math.round(platformFee),
    },
  };
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
