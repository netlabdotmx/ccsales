/**
 * Client-safe Odoo utilities (no server credentials).
 * Only use functions here in client components.
 */
export function odooImageUrl(model: string, id: number, field = "image_1920") {
  const base = process.env.NEXT_PUBLIC_ODOO_URL ?? "https://ccsales.netlab.mx";
  return `${base}/web/image/${model}/${id}/${field}`;
}
