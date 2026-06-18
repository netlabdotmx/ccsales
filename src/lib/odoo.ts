/**
 * Odoo REST API client — server-side only.
 * Consumes the custom /api/* endpoints from cc_store_channels controller.
 * Base URL: https://odoo.ccsales.com.mx
 */

import type { Product, PriceTier, Category } from "@/types";

const ODOO_API = process.env.ODOO_API_URL ?? "https://odoo.ccsales.com.mx";
const CHANNEL  = process.env.ODOO_CHANNEL  ?? "ccsales";

// ─── Core fetch ──────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${ODOO_API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Odoo API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─── Image URL helper ─────────────────────────────────────────

export function odooImageUrl(model: string, id: number, field = "image_1920") {
  return `${ODOO_API}/web/image/${model}/${id}/${field}`;
}

// ─── Mappers ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(raw: any): Product {
  const base = ODOO_API;
  // List endpoint: image_url (relative path). Detail endpoint: images.medium/large
  const imgMedium = raw.images?.medium
    ? `${base}${raw.images.medium}`
    : raw.image_url
      ? `${base}${raw.image_url}`
      : odooImageUrl("product.template", raw.id, "image_512");
  const imgLarge = raw.images?.large
    ? `${base}${raw.images.large}`
    : odooImageUrl("product.template", raw.id, "image_1920");

  return {
    id:               raw.id,
    name:             raw.name,
    sku:              raw.reference ?? raw.sku ?? "",
    description:      raw.description ?? "",
    shortDescription: raw.short_description ?? "",
    brandId:          raw.brand?.id ?? null,
    brandName:        raw.brand?.name ?? null,
    brandSlug:        raw.brand?.slug ?? null,
    listPrice:        raw.price ?? raw.list_price ?? 0,
    priceTiers:       (raw.price_tiers ?? []).map(mapPriceTier),
    imageUrl:         imgMedium,
    imageFullUrl:     imgLarge,
    condition:        raw.condition || "new",
    stock:            raw.stock_qty ?? (raw.in_stock ? 999 : 0),
    featured:         raw.featured ?? false,
    specs:            raw.specs ?? {},
    categoryId:       raw.category?.id   ?? null,
    categoryName:     raw.category?.name ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPriceTier(raw: any): PriceTier {
  return {
    id:     raw.id,
    minQty: raw.min_qty,
    maxQty: raw.max_qty ?? null,
    price:  raw.price,
    label:  raw.label,
  };
}

// ─── Products ────────────────────────────────────────────────

export interface SearchParams {
  q?:         string;
  brand?:     string;
  categ?:     number;
  condition?: string;
  featured?:  boolean;
  sort?:      "name" | "price_asc" | "price_desc" | "newest";
  limit?:     number;
  page?:      number;
}

export interface SearchResult {
  products: Product[];
  total:    number;
  page:     number;
  pages:    number;
}

export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  const p = new URLSearchParams();
  if (params.q)         p.set("q", params.q);
  if (params.brand)     p.set("brand", params.brand);
  if (params.categ)     p.set("categ", String(params.categ));
  if (params.condition) p.set("condition", params.condition);
  if (params.featured)  p.set("featured", "1");
  if (params.sort)      p.set("sort", params.sort);
  p.set("limit", String(params.limit ?? 24));
  p.set("page",  String(params.page  ?? 1));

  const data = await apiFetch<{ products: unknown[]; pagination: { total: number; page: number; pages: number } }>(
    `/api/channels/${CHANNEL}/products?${p}`
  );

  return {
    products: data.products.map(mapProduct),
    total:    data.pagination.total,
    page:     data.pagination.page,
    pages:    data.pagination.pages,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    // The endpoint returns the product object directly (no wrapper key)
    const data = await apiFetch<Record<string, unknown>>(`/api/products/${id}`);
    return data.id ? mapProduct(data) : null;
  } catch {
    return null;
  }
}

// ─── Brands ──────────────────────────────────────────────────

export interface ApiBrand {
  id:            number;
  name:          string;
  slug:          string;
  partner_level: string | null;
  logo:          string;
}

export async function getBrands(channel?: string): Promise<ApiBrand[]> {
  const q = channel ? `?channel=${channel}` : `?channel=${CHANNEL}`;
  const data = await apiFetch<{ brands: ApiBrand[] }>(`/api/brands${q}`);
  return data.brands ?? [];
}

export async function getBrandProducts(slug: string, params: SearchParams = {}): Promise<SearchResult> {
  const p = new URLSearchParams();
  if (params.q)         p.set("q", params.q);
  if (params.condition) p.set("condition", params.condition);
  if (params.sort)      p.set("sort", params.sort ?? "newest");
  p.set("limit", String(params.limit ?? 24));
  p.set("page",  String(params.page  ?? 1));

  const data = await apiFetch<{ products: unknown[]; pagination: { total: number; page: number; pages: number } }>(
    `/api/brands/${slug}/products?channel=${CHANNEL}&${p}`
  );

  return {
    products: data.products.map(mapProduct),
    total:    data.pagination.total,
    page:     data.pagination.page,
    pages:    data.pagination.pages,
  };
}

// ─── Categories ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const data = await apiFetch<{ categories: Category[] }>(`/api/categories?channel=${CHANNEL}`);
  return data.categories ?? [];
}

// ─── CRM Lead (still via JSON-RPC — no REST endpoint yet) ────

const ODOO_URL     = process.env.ODOO_URL     ?? "https://ccsales.netlab.mx";
const ODOO_DB      = process.env.ODOO_DB      ?? "";
const ODOO_UID     = Number(process.env.ODOO_UID     ?? "2");
const ODOO_API_KEY = process.env.ODOO_API_KEY ?? "";

export async function createLead(values: {
  name: string;
  contact_name: string;
  email_from: string;
  phone: string;
  partner_name: string;
  description: string;
}): Promise<number> {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", method: "call", id: 1,
      params: {
        service: "object", method: "execute_kw",
        args: [ODOO_DB, ODOO_UID, ODOO_API_KEY, "crm.lead", "create", [{ ...values, type: "lead" }]],
      },
    }),
    cache: "no-store",
  });
  const json = await res.json();
  if (json.error) throw new Error(`Odoo RPC: ${JSON.stringify(json.error)}`);
  return json.result as number;
}

export { ODOO_URL, ODOO_API };

