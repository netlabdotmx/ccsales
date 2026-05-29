/**
 * Odoo JSON-RPC client — server-side only.
 * Credentials are read from env vars and never exposed to the browser.
 */

const ODOO_URL = process.env.ODOO_URL ?? "";
const ODOO_DB = process.env.ODOO_DB ?? "";
const ODOO_API_KEY = process.env.ODOO_API_KEY ?? "";

interface JsonRpcPayload {
  method: string;
  params: Record<string, unknown>;
}

async function rpc<T>(endpoint: string, payload: JsonRpcPayload): Promise<T> {
  const response = await fetch(`${ODOO_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(ODOO_API_KEY ? { Authorization: `Bearer ${ODOO_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: 1,
      params: payload.params,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Odoo HTTP error: ${response.status}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(`Odoo RPC error: ${JSON.stringify(json.error)}`);
  }

  return json.result as T;
}

/** Campos base de producto para listados */
const PRODUCT_LIST_FIELDS = [
  "id", "name", "default_code", "description_sale",
  "list_price", "categ_id", "image_128",
  // Campos del módulo cc_store_channels
  "cc_store_ids", "cc_brand_id", "cc_price_tier_ids",
  "cc_featured", "cc_condition", "cc_short_description", "cc_specs",
  "qty_available",
] as const;

/** Campos completos de producto para detalle */
const PRODUCT_DETAIL_FIELDS = [
  "id", "name", "default_code", "description_sale",
  "list_price", "categ_id", "image_1920", "product_tag_ids",
  // Campos del módulo cc_store_channels
  "cc_store_ids", "cc_brand_id", "cc_price_tier_ids",
  "cc_featured", "cc_condition", "cc_short_description", "cc_specs",
  "qty_available",
] as const;

/** Search & read product.template records */
export async function searchProducts(params: {
  domain?: unknown[];
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
}) {
  return rpc("/web/dataset/call_kw", {
    method: "call",
    params: {
      model: "product.template",
      method: "search_read",
      args: [params.domain ?? []],
      kwargs: {
        fields: params.fields ?? [...PRODUCT_LIST_FIELDS],
        limit: params.limit ?? 20,
        offset: params.offset ?? 0,
        order: params.order ?? "id desc",
      },
    },
  });
}

/** Read a single product by id */
export async function getProduct(id: number) {
  return rpc("/web/dataset/call_kw", {
    method: "call",
    params: {
      model: "product.template",
      method: "read",
      args: [[id]],
      kwargs: {
        fields: [...PRODUCT_DETAIL_FIELDS],
      },
    },
  });
}

/** Fetch price tiers for a product (B2B / ccsales) */
export async function getProductPriceTiers(productId: number) {
  return rpc<Array<{
    id: number;
    min_qty: number;
    max_qty: number | false;
    price: number;
    label: string;
  }>>("/web/dataset/call_kw", {
    method: "call",
    params: {
      model: "product.price.tier",
      method: "search_read",
      args: [[["product_tmpl_id", "=", productId]]],
      kwargs: {
        fields: ["id", "min_qty", "max_qty", "price", "label"],
        order: "min_qty asc",
      },
    },
  });
}

/** Create a CRM lead */
export async function createLead(values: {
  name: string;
  contact_name: string;
  email_from: string;
  phone: string;
  partner_name: string;
  description: string;
}) {
  return rpc("/web/dataset/call_kw", {
    method: "call",
    params: {
      model: "crm.lead",
      method: "create",
      args: [{ ...values, type: "lead" }],
      kwargs: { context: { lang: "es_MX" } },
    },
  });
}

export { ODOO_DB };
