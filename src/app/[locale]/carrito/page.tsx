"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/cart";
import { buildWhatsAppUrl, buildLeadDescription } from "@/lib/whatsapp";
import { Link } from "@/i18n/navigation";
import { Trash2, Plus, Minus, MessageCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import type { CustomerInfo } from "@/types";

const CustomerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  company: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.email("Correo inválido"),
  phone: z.string().min(8, "Teléfono inválido"),
  rfc: z.string().optional(),
  notes: z.string().optional(),
});
type CustomerForm = z.infer<typeof CustomerSchema>;

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CustomerForm>({
    resolver: zodResolver(CustomerSchema),
  });

  const onSubmit = async (data: CustomerForm) => {
    setSending(true);
    const customer: CustomerInfo = data;
    const description = buildLeadDescription(items, customer);
    const waUrl = buildWhatsAppUrl(items, customer);

    // Create lead in Odoo (fire and forget — don't block WA opening)
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, description }),
    }).catch(() => { /* silent — WA message is the primary channel */ });

    // Open WhatsApp
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setSent(true);
    setSending(false);
    clearCart();
  };

  if (items.length === 0 && !sent) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-gray flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-brand-navy mb-2">{t("empty")}</h1>
        <p className="text-slate-500 mb-8">{t("emptyDesc")}</p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-brand-navy font-semibold text-sm hover:bg-brand-green-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver productos
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-green/15 flex items-center justify-center mb-6">
          <MessageCircle className="w-10 h-10 text-brand-green" />
        </div>
        <h1 className="text-2xl font-bold text-brand-navy mb-2">{t("success")}</h1>
        <p className="text-slate-500 mb-8">{t("successDesc")}</p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-light transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pt-24">
      <h1 className="text-3xl font-bold text-brand-navy mb-10">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, selectedTier }) => (
            <div
              key={product.id}
              className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-colors"
            >
              {/* Product info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-brand-navy text-sm leading-tight">{product.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{product.sku}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-full">
                      {selectedTier.label}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                    aria-label={t("remove")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {/* Qty control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      ${selectedTier.price.toLocaleString("es-MX")} {t("pricePerUnit", { ns: "products" })}
                    </p>
                    <p className="font-bold text-brand-navy">
                      ${(quantity * selectedTier.price).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Price tiers info */}
          <div className="p-4 rounded-xl bg-brand-green/5 border border-brand-green/20">
            <p className="text-xs text-brand-navy font-medium">
              💡 Los precios se actualizan automáticamente según el volumen seleccionado.
            </p>
          </div>
        </div>

        {/* Order summary + form */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="p-6 rounded-2xl bg-brand-navy text-white">
            <h2 className="font-bold mb-5">{t("title")}</h2>
            {items.map(({ product, quantity, selectedTier }) => (
              <div key={product.id} className="flex justify-between text-sm mb-2 text-slate-300">
                <span className="truncate mr-2">{quantity}× {product.name.slice(0, 25)}…</span>
                <span className="flex-shrink-0 font-medium text-white">
                  ${(quantity * selectedTier.price).toLocaleString("es-MX")}
                </span>
              </div>
            ))}
            <div className="border-t border-white/20 mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>{t("total")}</span>
              <span className="text-brand-green">${totalPrice().toLocaleString("es-MX")}</span>
            </div>
          </div>

          {/* Customer form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-2xl border border-slate-100 bg-white space-y-4">
            <h2 className="font-bold text-brand-navy mb-2">{t("customerInfo")}</h2>

            {(
              [
                { name: "name" as const,    label: t("name"),    type: "text" },
                { name: "company" as const, label: t("company"), type: "text" },
                { name: "email" as const,   label: t("email"),   type: "email" },
                { name: "phone" as const,   label: t("phone"),   type: "tel" },
                { name: "rfc" as const,     label: t("rfc"),     type: "text" },
              ] as const
            ).map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                <input
                  {...register(name)}
                  type={type}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-colors"
                />
                {errors[name] && (
                  <p className="text-xs text-red-500 mt-1">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t("notes")}</label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white font-bold text-sm transition-colors disabled:opacity-60"
            >
              <MessageCircle className="w-5 h-5" />
              {sending ? t("sendingLead") : t("sendWhatsapp")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
