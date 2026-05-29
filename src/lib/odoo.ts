/**
 * Odoo JSON-RPC client — server-side only.
 * Credentials are read from env vars and never exposed to the browser.
 *
 * Uses the /jsonrpc endpoint (service=object, method=execute_kw) which
 * accepts UID + API key directly — no session cookie needed.
 */

import type {
  OdooRawProduct,
  OdooRawPriceTier,
  OdooRawBrand,
  Product,
  PriceTier,
} from "@/types";

const ODOO_URL = process.env.ODOO_URL ?? "";
const ODOO_DB  = process.env.ODOO_DB  ?? "";
const ODOO_UID = Number(process.env.ODOO_UID ?? "2");
const ODOO_API_KEY = process.env.ODOO_API_KEY ?? "";

// ─── Core RPC ────────────────────────────────────────────────

async function rpc<T>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: 1,
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          ODOO_DB,
          ODOO_UID,
          ODOO_API_KEY,
          model,
          method,
          args,
          { ...kwargs, context: { lang: "es_MX" } },
        ],
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Odoo HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`Odoo RPC: ${JSON.stringify(json.error)}`);
  return json.result as T;
}

// ─── Mappers ─────────────────────────────────────────────────

export function odooImageUrl(model: string, id: number, field = "image_1920") {
  return `${ODOO_URL}/web/image/${model}/${id}/${field}`;
}

function mapPriceTier(raw: OdooRawPriceTier): PriceTier {
  return {
    id:      raw.id,
    minQty:  raw.min_qty,
    maxQty:  raw.max_qty === false || raw.max_qty === 0 ? null : raw.max_qty,
    price:   raw.price,
    label:   raw.label,
  };
}

function mapProduct(raw: OdooRawProduct): Product {
  let specs: Record<string, string> = {};
  if (raw.cc_specs) {
    try { specs = JSON.parse(raw.cc_specs); } catch { /* ignore */ }
  }

  return {
    id:               raw.id,
    name:             raw.name,
    sku:              raw.default_code || "",
    description:      raw.description_sale || "",
    shortDescription: raw.cc_short_description || "",
    brandId:          raw.cc_brand_id ? raw.cc_brand_id[0] : null,
    brandName:        raw.cc_brand_id ? raw.cc_brand_id[1] : null,
    brandSlug:        null, // resolved by caller if needed
    listPrice:        raw.list_price,
    priceTiers:       [],   // fetched separately via getProductPriceTiers
    imageUrl:         odooImageUrl("product.template", raw.id, "image_1920"),
    condition:        raw.cc_condition || "new",
    stock:            999,  // qty_available not available via jsonrpc on product.template
    featured:         raw.cc_featured,
    specs,
  };
}

// ─── Product fields to request ────────────────────────────────

const PRODUCT_FIELDS = [
  "id", "name", "default_code", "description_sale",
  "cc_short_description", "list_price",
  "cc_brand_id", "cc_store_ids", "cc_price_tier_ids",
  "cc_featured", "cc_condition", "cc_specs",
];

// ─── Public API ───────────────────────────────────────────────

/** Fetch paginated products filtered to the ccsales B2B store */
export async function searchProducts(params: {
  domain?: unknown[];
  limit?: number;
  offset?: number;
  order?: string;
}): Promise<Product[]> {
  const baseDomain: unknown[] = [
    ["cc_store_ids.slug", "=", "ccsales"],
    ["sale_ok", "=", true],
  ];
  const domain = [...baseDomain, ...(params.domain ?? [])];

  const raw = await rpc<OdooRawProduct[]>(
    "product.template",
    "search_read",
    [domain],
    {
      fields: PRODUCT_FIELDS,
      limit:  params.limit  ?? 24,
      offset: params.offset ?? 0,
      order:  params.order  ?? "id desc",
    }
  );

  return raw.map(mapProduct);
}

/** Count products matching a domain */
export async function countProducts(domain: unknown[] = []): Promise<number> {
  const baseDomain: unknown[] = [
    ["cc_store_ids.slug", "=", "ccsales"],
    ["sale_ok", "=", true],
  ];
  return rpc<number>(
    "product.template",
    "search_count",
    [[...baseDomain, ...domain]],
  );
}

/** Fetch a single product by id */
export async function getProduct(id: number): Promise<Product | null> {
  const raw = await rpc<OdooRawProduct[]>(
    "product.template",
    "read",
    [[id]],
    { fields: PRODUCT_FIELDS }
  );
  return raw.length ? mapProduct(raw[0]) : null;
}

/** Fetch price tiers for a product */
export async function getProductPriceTiers(productId: number): Promise<PriceTier[]> {
  const raw = await rpc<OdooRawPriceTier[]>(
    "product.price.tier",
    "search_read",
    [[["product_tmpl_id", "=", productId]]],
    { fields: ["id", "min_qty", "max_qty", "price", "label"], order: "min_qty asc" }
  );
  return raw.map(mapPriceTier);
}

/** Fetch all brands from Odoo */
export async function getBrands(): Promise<OdooRawBrand[]> {
  return rpc<OdooRawBrand[]>(
    "product.brand",
    "search_read",
    [[]],
    { fields: ["id", "name", "slug", "partner_level"], order: "name asc" }
  );
}

/** Create a CRM lead */
export async function createLead(values: {
  name: string;
  contact_name: string;
  email_from: string;
  phone: string;
  partner_name: string;
  description: string;
}): Promise<number> {
  return rpc<number>(
    "crm.lead",
    "create",
    [{ ...values, type: "lead" }],
  );
}

export { ODOO_DB, ODOO_URL };
