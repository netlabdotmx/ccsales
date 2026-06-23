// ─── Domain types ────────────────────────────────────────────
export interface PriceTier {
  id: number;
  minQty: number;
  maxQty: number | null;
  price: number;
  label: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  product_count: number;
  children: Category[];
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  brandId: number | null;
  brandName: string | null;
  brandSlug: string | null;
  categoryId: number | null;
  categoryName: string | null;
  listPrice: number;
  priceTiers: PriceTier[];
  imageUrl: string;         // image_512 — tarjetas y listados
  imageThumbUrl: string;    // image_128 — thumbnails
  imageFullUrl: string;     // image_1920 — detalle y zoom
  condition: "new" | "refurbished" | "used";
  stock: number;
  inStock: boolean;
  featured: boolean;
  specs: Record<string, string>;
}

export interface Brand {
  id?: number;
  slug: string;
  name: string;
  logo: string;
  logoDark: string;
  description: string;
  partnerLevel?: string;
  solutionSlugs: string[];
  featured: boolean;
  color: string;
}

export interface Solution {
  slug: string;
  icon: string;
  name: Record<"es" | "en", string>;
  description: Record<"es" | "en", string>;
  brandSlugs: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTier: PriceTier;
}

export interface CustomerInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  rfc?: string;
  notes?: string;
}

// ─── Orders ──────────────────────────────────────────────────

export type OrderState = "quotation" | "quotation_sent" | "confirmed" | "done" | "cancelled";

export interface OrderLine {
  id: number;
  product_id: number;
  variant_id: number | null;
  name: string;
  reference: string;
  qty: number;
  price_unit: number;
  subtotal: number;
  image_thumb: string;
}

export interface Order {
  id: number;
  name: string;
  state: OrderState;
  access_token: string;
  date_order: string;
  client_ref: string | null;
  partner: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  lines: OrderLine[];
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  currency: string;
}
