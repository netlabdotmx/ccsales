/**
 * Odoo REST API client — server-side only.
 * Base URL: https://ccsales.netlab.mx
 */

import type { Product, PriceTier, Category, Order } from "@/types";

const ODOO_API = process.env.ODOO_API_URL ?? "https://ccsales.netlab.mx";
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

export function odooImageUrl(path: string): string;
export function odooImageUrl(model: string, id: number, field?: string): string;
export function odooImageUrl(modelOrPath: string, id?: number, field = "image_1920"): string {
  if (id === undefined) {
    // Called with a relative path directly (e.g. from API response)
    return modelOrPath.startsWith("http") ? modelOrPath : `${ODOO_API}${modelOrPath}`;
  }
  return `${ODOO_API}/web/image/${modelOrPath}/${id}/${field}`;
}

// ─── Mappers ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(raw: any): Product {
  const base = ODOO_API;
  const imgMedium = raw.images?.medium
    ? `${base}${raw.images.medium}`
    : raw.image_url
      ? `${base}${raw.image_url}`
      : `${base}/web/image/product.template/${raw.id}/image_512`;
  const imgLarge = raw.images?.large
    ? `${base}${raw.images.large}`
    : `${base}/web/image/product.template/${raw.id}/image_1920`;
  const imgThumb = raw.images?.thumb
    ? `${base}${raw.images.thumb}`
    : raw.image_thumb
      ? `${base}${raw.image_thumb}`
      : `${base}/web/image/product.template/${raw.id}/image_128`;

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
    imageThumbUrl:    imgThumb,
    imageFullUrl:     imgLarge,
    condition:        raw.condition || "new",
    stock:            raw.stock_qty ?? (raw.in_stock ? 999 : 0),
    inStock:          raw.in_stock ?? (raw.stock_qty > 0),
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
  description:   string;
  product_count: number;
  logo_url:      string;
  logo_dark_url: string;
}

export async function getBrands(channel?: string): Promise<ApiBrand[]> {
  const q = `?channel=${channel ?? CHANNEL}`;
  const data = await apiFetch<{ brands: ApiBrand[] }>(`/api/brands${q}`);
  return data.brands ?? [];
}

export async function getBrandProducts(slug: string, params: SearchParams = {}): Promise<SearchResult> {
  const p = new URLSearchParams();
  if (params.q)         p.set("q", params.q);
  if (params.condition) p.set("condition", params.condition);
  if (params.sort)      p.set("sort", params.sort ?? "newest");
  p.set("channel", CHANNEL);
  p.set("limit", String(params.limit ?? 24));
  p.set("page",  String(params.page  ?? 1));

  const data = await apiFetch<{ products: unknown[]; pagination: { total: number; page: number; pages: number } }>(
    `/api/brands/${slug}/products?${p}`
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

// ─── Orders ──────────────────────────────────────────────────

export interface CreateOrderParams {
  partner: { email: string; name: string; phone?: string; company?: string };
  lines: Array<{ product_id: number; variant_id?: number; qty: number; note?: string }>;
  client_ref?: string;
  note?: string;
}

export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const data = await apiFetch<{ order: Order }>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      channel: CHANNEL,
      partner: params.partner,
      lines:   params.lines,
      client_ref: params.client_ref,
      note:       params.note,
      confirm:    false,
    }),
  });
  return data.order;
}

export async function getOrder(id: number, token: string): Promise<Order> {
  return apiFetch<{ order: Order }>(`/api/orders/${id}?token=${encodeURIComponent(token)}`)
    .then((d) => d.order);
}

export async function cancelOrder(id: number, token: string): Promise<Order> {
  const data = await apiFetch<{ order: Order }>(`/api/orders/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  return data.order;
}

export { ODOO_API };
