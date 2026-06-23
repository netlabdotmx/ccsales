/**
 * Client-safe Odoo utilities (no server credentials).
 * Only use functions here in client components.
 */
export function odooImageUrl(path: string): string;
export function odooImageUrl(model: string, id: number, field?: string): string;
export function odooImageUrl(modelOrPath: string, id?: number, field = "image_1920"): string {
  const base = process.env.NEXT_PUBLIC_ODOO_API_URL ?? "https://ccsales.netlab.mx";
  if (id === undefined) {
    return modelOrPath.startsWith("http") ? modelOrPath : `${base}${modelOrPath}`;
  }
  return `${base}/web/image/${modelOrPath}/${id}/${field}`;
}
