"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, MessageCircle, ChevronLeft, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";
import PriceTierTable from "@/components/products/PriceTierTable";
import type { Product } from "@/types";

const conditionLabel: Record<string, string> = {
  new: "Nuevo", refurbished: "Seminuevo", used: "Usado",
};
const conditionColor: Record<string, string> = {
  new: "text-brand-green bg-brand-green/10",
  refurbished: "text-amber-600 bg-amber-50",
  used: "text-slate-500 bg-slate-100",
};

function getBestTier(product: Product, qty: number) {
  const applicable = product.priceTiers.filter((t) => qty >= t.minQty);
  if (!applicable.length) return null;
  return applicable.reduce((a, b) => (a.minQty > b.minQty ? a : b));
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const activeTier = getBestTier(product, qty);
  const unitPrice  = activeTier?.price ?? product.listPrice;
  const subtotal   = unitPrice * qty;

  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525618507997"}?text=${encodeURIComponent(
    `Hola, quiero cotizar:\n• ${qty}x ${product.name} (${product.sku})\n  Precio unitario: $${unitPrice.toLocaleString("es-MX")}\n  Total estimado: $${subtotal.toLocaleString("es-MX")}`
  )}`;

  function handleAddToCart() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  let specs: Record<string, string> = {};
  try {
    specs = typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs;
  } catch { /* ignore */ }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pt-24">
      {/* Back */}
      <Link
        href="/productos"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-navy transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
          <Image
            src={product.imageFullUrl}
            alt={product.name}
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          {/* No image fallback */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: -1 }}>
            <Package className="w-24 h-24 text-slate-200" />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Brand + condition */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.brandName && (
              <span className="text-xs font-semibold text-brand-cyan uppercase tracking-widest">
                {product.brandName}
              </span>
            )}
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${conditionColor[product.condition] ?? conditionColor.new}`}>
              {conditionLabel[product.condition]}
            </span>
            {product.featured && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan-dark">
                Destacado
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy leading-tight">
            {product.name}
          </h1>

          {product.sku && (
            <p className="text-sm text-slate-400">SKU: <span className="font-mono">{product.sku}</span></p>
          )}

          {product.shortDescription && (
            <p className="text-slate-600 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <><CheckCircle2 className="w-4 h-4 text-brand-green" /><span className="text-sm font-medium text-brand-green">En stock ({product.stock} disponibles)</span></>
            ) : (
              <><AlertCircle className="w-4 h-4 text-amber-500" /><span className="text-sm font-medium text-amber-600">Sin stock disponible</span></>
            )}
          </div>

          {/* Price tiers */}
          <PriceTierTable tiers={product.priceTiers} listPrice={product.listPrice} selectedQty={qty} />

          {/* Qty selector + live price */}
          <div className="p-4 rounded-2xl bg-brand-navy text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-300">Cantidad</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold transition-colors"
                >−</button>
                <span className="w-10 text-center font-bold text-lg">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold transition-colors"
                >+</button>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400">Precio unitario</p>
                <p className="text-xl font-bold text-brand-green">
                  ${unitPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
                {activeTier && <p className="text-xs text-slate-400">{activeTier.label}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Subtotal</p>
                <p className="text-2xl font-bold">
                  ${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-all ${
                added
                  ? "bg-brand-green text-brand-navy"
                  : "bg-brand-navy text-white hover:bg-brand-navy-light"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? "¡Agregado!" : "Agregar al carrito"}
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20BD5C] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {product.description && (
          <div>
            <h2 className="text-xl font-bold text-brand-navy mb-4">Descripción</h2>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {Object.keys(specs).length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-brand-navy mb-4">Especificaciones técnicas</h2>
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              {Object.entries(specs).map(([key, val], i) => (
                <div
                  key={key}
                  className={`flex gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
                >
                  <span className="font-medium text-slate-600 min-w-[140px] flex-shrink-0">{key}</span>
                  <span className="text-slate-800">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
