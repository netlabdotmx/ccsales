import type { CartItem, CustomerInfo } from "@/types";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525618507997";

/**
 * Builds the WhatsApp wa.me URL with a pre-filled message containing
 * the customer info and cart items with price tiers.
 */
export function buildWhatsAppUrl(
  items: CartItem[],
  customer: CustomerInfo
): string {
  const lines = items.map((item) => {
    const { product, quantity, selectedTier } = item;
    const subtotal = (quantity * selectedTier.price).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
    const unitPrice = selectedTier.price.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
    return `• ${quantity}x ${product.name} (${product.sku}) — ${unitPrice} c/u = ${subtotal}`;
  });

  const total = items
    .reduce((sum, i) => sum + i.quantity * i.selectedTier.price, 0)
    .toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });

  const message = [
    `Hola, mi nombre es *${customer.name}* de *${customer.company}*.`,
    ``,
    `Me interesa cotizar los siguientes productos:`,
    ...lines,
    ``,
    `*Total estimado: ${total}*`,
    ``,
    `Mis datos de contacto:`,
    `📧 ${customer.email}`,
    `📞 ${customer.phone}`,
    customer.rfc ? `RFC: ${customer.rfc}` : "",
    customer.notes ? `\nNotas: ${customer.notes}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Generates a plain-text summary for the Odoo CRM lead description */
export function buildLeadDescription(
  items: CartItem[],
  customer: CustomerInfo
): string {
  const lines = items.map((item) => {
    const { product, quantity, selectedTier } = item;
    return `- ${quantity}x ${product.name} (${product.sku}) @ $${selectedTier.price} c/u`;
  });

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.selectedTier.price,
    0
  );

  return [
    `Empresa: ${customer.company}`,
    customer.rfc ? `RFC: ${customer.rfc}` : "",
    ``,
    `Productos solicitados:`,
    ...lines,
    ``,
    `Total estimado: $${total.toFixed(2)} MXN`,
    customer.notes ? `\nNotas: ${customer.notes}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");
}
