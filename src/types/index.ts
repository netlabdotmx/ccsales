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
  slug: string;
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

