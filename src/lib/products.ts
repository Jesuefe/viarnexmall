import { createClient } from "@/lib/supabase/server";
import { calculateFinalPrice, type RateConfig } from "@/lib/pricing";

// Shape of a product row joined with its supplier name, pricing tiers,
// and the minimum-qty tier price used for the "from ₦X" list price.
export interface ProductListItem {
  id: string;
  nameEn: string;
  images: string[];
  moq: number;
  basePriceYuan: number;
  category: string;
  rating: number;
  reviewCount: number;
  supplierName: string;
  displayPriceNaira: number;
}

export interface ProductDetail extends ProductListItem {
  nameZh: string | null;
  descriptionEn: string | null;
  supplierId: string;
  pricingTiers: { minQty: number; unitPriceYuan: number }[];
  variants: { id: string; attributes: Record<string, string>; stock: number }[];
  shipping: Record<string, unknown>;
}

async function getActiveRates(): Promise<RateConfig> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_config")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  // Sensible fallback so the storefront never breaks if config hasn't
  // been seeded yet — admin can override any time via platform_config.
  return {
    officialRateNgnPerYuan: data?.official_rate_ngn_per_yuan ?? 190,
    viarnexRateNgnPerYuan: data?.viarnex_rate_ngn_per_yuan ?? 210,
    platformFeePercent: data?.platform_fee_percent ?? 10,
    shippingMarkupPercent: data?.shipping_markup_percent ?? 0,
  };
}

// Flat estimate until the real shipping calculator (weight/volume based)
// is built — keeps the storefront price-complete in the meantime.
const PLACEHOLDER_SHIPPING_NAIRA = 15000;

export async function listApprovedProducts(): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const rates = await getActiveRates();

  const { data, error } = await supabase
    .from("products")
    .select("id, name_en, images, moq, base_price_yuan, category, rating, review_count, suppliers(company_name)")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const { finalPriceNaira } = calculateFinalPrice(
      row.base_price_yuan,
      row.moq,
      { baseCostNaira: PLACEHOLDER_SHIPPING_NAIRA },
      rates
    );
    return {
      id: row.id,
      nameEn: row.name_en,
      images: row.images ?? [],
      moq: row.moq,
      basePriceYuan: row.base_price_yuan,
      category: row.category,
      rating: row.rating,
      reviewCount: row.review_count,
      // Supabase types this as an array for the join; a product has one supplier.
      supplierName: (row.suppliers as unknown as { company_name: string }[])?.[0]?.company_name ?? "Verified Supplier",
      displayPriceNaira: finalPriceNaira,
    };
  });
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const rates = await getActiveRates();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name_en, name_zh, description_en, images, moq, base_price_yuan, category, rating, review_count, shipping, supplier_id, suppliers(company_name), product_pricing_tiers(min_qty, unit_price_yuan), product_variants(id, attributes, stock)"
    )
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();

  if (error || !data) return null;

  const { finalPriceNaira } = calculateFinalPrice(
    data.base_price_yuan,
    data.moq,
    { baseCostNaira: PLACEHOLDER_SHIPPING_NAIRA },
    rates
  );

  return {
    id: data.id,
    nameEn: data.name_en,
    nameZh: data.name_zh,
    descriptionEn: data.description_en,
    images: data.images ?? [],
    moq: data.moq,
    basePriceYuan: data.base_price_yuan,
    category: data.category,
    rating: data.rating,
    reviewCount: data.review_count,
    supplierId: data.supplier_id,
    supplierName: (data.suppliers as unknown as { company_name: string }[])?.[0]?.company_name ?? "Verified Supplier",
    displayPriceNaira: finalPriceNaira,
    shipping: data.shipping ?? {},
    pricingTiers: (data.product_pricing_tiers ?? []).map((t: { min_qty: number; unit_price_yuan: number }) => ({
      minQty: t.min_qty,
      unitPriceYuan: t.unit_price_yuan,
    })),
    variants: (data.product_variants ?? []).map((v: { id: string; attributes: Record<string, string>; stock: number }) => ({
      id: v.id,
      attributes: v.attributes,
      stock: v.stock,
    })),
  };
}
