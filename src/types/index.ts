// ─── Raw Odoo shapes ─────────────────────────────────────────
/** Many2one from Odoo: [id, "Display Name"] | false */
export type OdooM2O = [number, string] | false;

export interface OdooRawProduct {
  id: number;
  name: string;
  default_code: string | false;
  description_sale: string | false;
  cc_short_description: string | false;
  list_price: number;
  cc_brand_id: OdooM2O;
  cc_store_ids: number[];
  cc_price_tier_ids: number[];
  cc_featured: boolean;
  cc_condition: "new" | "refurbished" | "used" | false;
  cc_specs: string | false; // JSON string
  qty_available: number;
}

export interface OdooRawPriceTier {
  id: number;
  min_qty: number;
  max_qty: number | false; // false = sin límite
  price: number;
  label: string;
}

export interface OdooRawBrand {
  id: number;
  name: string;
  slug: string;
  partner_level: string | false;
}

// ─── Domain types ────────────────────────────────────────────
export interface PriceTier {
  id: number;
  minQty: number;
  maxQty: number | null;
  price: number;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  brandId: number | null;
  brandName: string | null;
  brandSlug: string | null; // will be resolved from brands list
  listPrice: number;
  priceTiers: PriceTier[];
  imageUrl: string;         // image_512 — tarjetas y listados
  imageFullUrl: string;     // image_1920 — detalle y zoom
  condition: "new" | "refurbished" | "used";
  stock: number;
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

export interface OdooLead {
  name: string;
  contact_name: string;
  email_from: string;
  phone: string;
  description: string;
  partner_name: string;
}

