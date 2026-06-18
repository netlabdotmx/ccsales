import { searchProducts } from "@/lib/odoo";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";

const conditionLabel: Record<string, string> = {
  new: "Nuevo", refurbished: "Seminuevo", used: "Usado",
};
const conditionColor: Record<string, string> = {
  new: "bg-brand-green/15 text-brand-green-dark",
  refurbished: "bg-amber-100 text-amber-700",
  used: "bg-slate-100 text-slate-600",
};

export default async function FeaturedProducts() {
  // Use newest in-stock products as "featured" until cc_featured is set in Odoo
  const result = await searchProducts({ sort: "newest", limit: 8 }).catch(() => ({
    products: [], total: 0, page: 1, pages: 0,
  }));
  const products = result.products;

  if (products.length === 0) return null;

  return (
    <section className="bg-brand-gray py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/15 border border-brand-green/30 mb-3">
              <Zap className="w-3 h-3 text-brand-green" />
              <span className="text-brand-green text-xs font-semibold uppercase tracking-wide">Recién llegados</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">
              Productos disponibles
            </h2>
            <p className="text-slate-500 mt-1.5">Stock real, entrega inmediata en CDMX</p>
          </div>
          <Link
            href="/productos"
            className="text-sm font-semibold text-brand-navy hover:text-brand-cyan transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            Ver catálogo completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/productos/${p.id}` as never}
              className="group flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square bg-white overflow-hidden">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Condition badge */}
                <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${conditionColor[p.condition] ?? conditionColor.new}`}>
                  {conditionLabel[p.condition] ?? "Nuevo"}
                </span>
                {/* Stock badge */}
                {p.stock > 0 && p.stock <= 5 && (
                  <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                    Últimas {Math.floor(p.stock)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-4">
                {p.brandName && (
                  <p className="text-[11px] font-semibold text-brand-cyan uppercase tracking-wide mb-1">{p.brandName}</p>
                )}
                <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mb-auto group-hover:text-brand-navy transition-colors">
                  {p.name}
                </h3>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400">Precio lista</p>
                    <p className="text-base font-bold text-brand-navy">
                      ${p.listPrice.toLocaleString("es-MX", { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-brand-navy/5 group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center transition-all duration-200 text-brand-navy">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-light transition-all hover:shadow-lg"
          >
            Ver los {result.total.toLocaleString()} productos disponibles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
