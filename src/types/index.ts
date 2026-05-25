export interface PriceTier {
  minQty: number;
  maxQty: number | null; // null = sin límite superior
  price: number;
  label: string; // e.g. "1–5 piezas"
}

export interface Product {
  id: number;
  slug: string;
  sku: string;
  name: string;
  description: string;
  shortDescription: string;
  brandSlug: string;
  solutionSlugs: string[];
  listPrice: number;
  priceTiers: PriceTier[];
  images: string[];
  condition: "new" | "refurbished" | "used";
  stock: number;
  featured: boolean;
  specs: Record<string, string>;
}

export interface Brand {
  slug: string;
  name: string;
  logo: string;          // path in /public/brands/
  logoDark: string;      // white version for dark backgrounds
  description: string;
  partnerLevel?: string; // e.g. "Gold Partner", "Certified Reseller"
  solutionSlugs: string[];
  featured: boolean;
  color: string;         // brand primary color for accents
}

export interface Solution {
  slug: string;
  icon: string;          // lucide icon name
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
