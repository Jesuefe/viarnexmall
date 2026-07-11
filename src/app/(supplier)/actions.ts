"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSupplier } from "@/lib/suppliers";

export interface CreateProductResult {
  error?: string;
}

export async function createProduct(
  _prevState: CreateProductResult,
  formData: FormData
): Promise<CreateProductResult> {
  const supplier = await getCurrentSupplier();
  if (!supplier) {
    return { error: "You need a supplier account to list products." };
  }

  const supabase = await createClient();

  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim();
  const basePriceYuan = Number(formData.get("basePriceYuan"));
  const moq = Number(formData.get("moq"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  const netWeightKg = Number(formData.get("netWeightKg") ?? 0);
  const grossWeightKg = Number(formData.get("grossWeightKg") ?? 0);
  const lengthCm = Number(formData.get("lengthCm") ?? 0);
  const widthCm = Number(formData.get("widthCm") ?? 0);
  const heightCm = Number(formData.get("heightCm") ?? 0);
  const battery = formData.get("battery") === "on";
  const liquid = formData.get("liquid") === "on";
  const magnetic = formData.get("magnetic") === "on";
  const fragile = formData.get("fragile") === "on";

  if (!nameEn || !category || !sku || !basePriceYuan || !moq) {
    return { error: "Product name, category, SKU, price, and MOQ are required." };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      supplier_id: supplier.id,
      name_en: nameEn,
      category,
      sku,
      description_en: descriptionEn || null,
      base_price_yuan: basePriceYuan,
      moq,
      images: imageUrl ? [imageUrl] : [],
      shipping: {
        netWeightKg,
        grossWeightKg,
        lengthCm,
        widthCm,
        heightCm,
        countryOfOrigin: "China",
        sensitiveGoods: { battery, liquid, magnetic, fragile },
      },
      // New listings need admin approval before they're public — matches
      // the "Product Verification" rule in the spec.
      approval_status: "pending",
    })
    .select("id")
    .single();

  if (productError || !product) {
    return { error: productError?.message ?? "Could not create product." };
  }

  // Pricing tiers — parallel arrays from repeated form fields (tierMinQty[], tierPriceYuan[]).
  const tierMinQtys = formData.getAll("tierMinQty").map(Number).filter((n) => n > 0);
  const tierPrices = formData.getAll("tierPriceYuan").map(Number);
  const tierRows = tierMinQtys
    .map((minQty, i) => ({ product_id: product.id, min_qty: minQty, unit_price_yuan: tierPrices[i] }))
    .filter((row) => row.min_qty > 0 && row.unit_price_yuan > 0);

  if (tierRows.length > 0) {
    await supabase.from("product_pricing_tiers").insert(tierRows);
  }

  // Variants — parallel arrays (variantLabel[], variantStock[]).
  const variantLabels = formData.getAll("variantLabel").map(String);
  const variantStocks = formData.getAll("variantStock").map(Number);
  const variantRows = variantLabels
    .map((label, i) => ({
      product_id: product.id,
      attributes: { option: label },
      stock: variantStocks[i] ?? 0,
    }))
    .filter((row) => row.attributes.option.trim() !== "");

  if (variantRows.length > 0) {
    await supabase.from("product_variants").insert(variantRows);
  }

  redirect("/portal/products");
}
