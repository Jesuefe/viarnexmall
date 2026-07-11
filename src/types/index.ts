// Core domain types for Viarnex Mall.
// These mirror the MVP spec's entities and are the shared contract
// between the customer, supplier, and admin portals.

export type UserRole = "customer" | "supplier" | "admin";

export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";

export interface Supplier {
  id: string;
  companyName: string;
  factoryName?: string;
  verificationStatus: VerificationStatus;
  performanceScore: number; // starts at 100, decays with penalties
  badges: SupplierBadge[];
  country: string;
  createdAt: string;
}

export type SupplierBadge =
  | "verified"
  | "factory"
  | "top-seller"
  | "fast-dispatch"
  | "trusted-supplier";

export interface SensitiveGoodsFlags {
  battery: boolean;
  liquid: boolean;
  magnetic: boolean;
  fragile: boolean;
}

export interface ShippingProfile {
  netWeightKg: number;
  grossWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  countryOfOrigin: string;
  sensitiveGoods: SensitiveGoodsFlags;
}

export interface PricingTier {
  minQty: number;
  unitPriceYuan: number;
}

export interface ProductVariant {
  id: string;
  attributes: Record<string, string>; // e.g. { color: "Black", size: "XL" }
  stock: number;
}

export type ProductApprovalStatus = "pending" | "approved" | "rejected";

export interface Product {
  id: string;
  supplierId: string;
  nameEn: string;
  nameZh: string;
  descriptionEn: string;
  descriptionZh: string;
  category: string;
  brand?: string;
  sku: string;
  images: string[];
  moq: number;
  basePriceYuan: number;
  pricingTiers: PricingTier[];
  variants: ProductVariant[];
  shipping: ShippingProfile;
  approvalStatus: ProductApprovalStatus;
  rating: number;
  reviewCount: number;
}

// Customer-facing price — Yuan is never exposed to buyers.
export interface DisplayPrice {
  nairaPrice: number;
  currencyMarginApplied: boolean;
}

export type OrderStatus =
  | "pending_payment"
  | "payment_received"
  | "supplier_notified"
  | "preparing"
  | "shipped_to_warehouse"
  | "warehouse_confirmed"
  | "supplier_paid"
  | "international_shipment"
  | "arrived_nigeria"
  | "out_for_delivery"
  | "delivered"
  | "completed";

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPriceNaira: number;
}

// A customer checkout can span multiple suppliers; each supplier
// becomes its own fulfillment order under one payment.
export interface FulfillmentOrder {
  id: string;
  supplierId: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  frozen: number;
  withdrawable: number;
}

export interface QuotationRequest {
  id: string;
  productId: string;
  customerId: string;
  requestedQty: number;
  status: "open" | "responded" | "accepted" | "rejected";
}

export interface QuotationResponse {
  id: string;
  quotationRequestId: string;
  discountedPriceYuan: number;
  customMoq: number;
  shippingEstimateNaira: number;
  leadTimeDays: number;
}
