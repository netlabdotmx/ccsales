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
        fields: params.fields ?? [
          "id", "name", "default_code", "description_sale",
          "list_price", "categ_id", "image_128",
        ],
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
        fields: [
          "id", "name", "default_code", "description_sale",
          "list_price", "categ_id", "image_1920", "product_tag_ids",
        ],
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
