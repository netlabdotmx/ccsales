"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, MessageCircle, Package } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

const conditionLabel: Record<string, string> = {
  new: "Nuevo",
  refurbished: "Seminuevo",
  used: "Usado",
};
const conditionColor: Record<string, string> = {
  new: "bg-brand-green/15 text-brand-green-dark",
  refurbished: "bg-amber-100 text-amber-700",
  used: "bg-slate-100 text-slate-600",
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  // Best tier for qty=1 (lowest minQty)
  const bestTier = product.priceTiers.length
    ? product.priceTiers.reduce((a, b) => (a.minQty < b.minQty ? a : b))
    : null;

  const displayPrice = bestTier?.price ?? product.listPrice;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, 1);
  }

  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525618507997"}?text=${encodeURIComponent(
    `Hola, me interesa cotizar: ${product.name} (${product.sku})`
  )}`;

  return (
    <Link
      href={`/productos/${product.id}` as never}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-white overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.innerHTML =
              `<div class="w-full h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>`;
          }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${conditionColor[product.condition] ?? conditionColor.new}`}>
            {conditionLabel[product.condition] ?? "Nuevo"}
          </span>
          {product.featured && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan-dark">
              Destacado
            </span>
          )}
        </div>
        {/* Stock indicator */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        {product.brandName && (
          <p className="text-[11px] font-semibold text-brand-cyan uppercase tracking-wide mb-1">
            {product.brandName}
          </p>
        )}
        <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mb-1 group-hover:text-brand-navy transition-colors">
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-[11px] text-slate-400 mb-2">SKU: {product.sku}</p>
        )}
        {product.shortDescription && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="mb-3">
          {product.priceTiers.length > 0 ? (
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">Desde</p>
              <p className="text-lg font-bold text-brand-navy">
                ${displayPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-brand-cyan font-medium">
                +{product.priceTiers.length} tiers de precio
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-brand-navy">
              ${displayPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Agregar
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
            aria-label="Cotizar por WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </Link>
  );
}
