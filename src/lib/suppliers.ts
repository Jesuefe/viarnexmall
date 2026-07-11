import { createClient } from "@/lib/supabase/server";

export interface SupplierSummary {
  id: string;
  companyName: string;
  verificationStatus: string;
}

// Looks up the suppliers row owned by the currently logged-in user.
// Returns null if they're not logged in or aren't a supplier — callers
// should redirect in that case.
export async function getCurrentSupplier(): Promise<SupplierSummary | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("suppliers")
    .select("id, company_name, verification_status")
    .eq("owner_id", user.id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    companyName: data.company_name,
    verificationStatus: data.verification_status,
  };
}

export interface SupplierProduct {
  id: string;
  nameEn: string;
  category: string;
  basePriceYuan: number;
  moq: number;
  approvalStatus: string;
  images: string[];
}

export async function listSupplierProducts(supplierId: string): Promise<SupplierProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name_en, category, base_price_yuan, moq, approval_status, images")
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    nameEn: row.name_en,
    category: row.category,
    basePriceYuan: row.base_price_yuan,
    moq: row.moq,
    approvalStatus: row.approval_status,
    images: row.images ?? [],
  }));
}
