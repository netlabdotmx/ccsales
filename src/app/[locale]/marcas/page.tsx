import { getBrands, odooImageUrl, searchProducts } from "@/lib/odoo";
import { Link } from "@/i18n/navigation";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { brands as staticBrands } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Distribuidores certificados de Cisco, Fortinet, Aruba, HPE, Lenovo y más marcas líderes en tecnología enterprise.",
};

const brandColors: Record<string, string> = {
  cisco: "#00BCEB", meraki: "#00BCEB", fortinet: "#EE3124",
  aruba: "#FF6800", hpe: "#01A982", lenovo: "#E2231A",
  extreme: "#7B2D8B", zebra: "#1A1A1A",
};

export default async function MarcasPage() {
  let oodooBrands: { id: number; name: string; slug: string; partner_level: string | false }[] = [];
  try {
    oodooBrands = await getBrands();
  } catch {
    // use static fallback below
  }

  // Merge: prefer Odoo brands, fall back to static
  const mergedBrands = oodooBrands.length > 0
    ? oodooBrands.map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        logo: odooImageUrl("product.brand", b.id, "logo"),
        partnerLevel: b.partner_level || undefined,
        color: brandColors[b.slug] ?? "#003845",
        fromOdoo: true,
      }))
    : staticBrands.map((b, i) => ({
        id: i + 1,
        slug: b.slug,
        name: b.name,
        logo: b.logo,
        partnerLevel: b.partnerLevel,
        color: b.color,
        fromOdoo: false,
      }));

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-brand-navy py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-3">
            Partners certificados
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Marcas que distribuimos
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Somos distribuidores autorizados de las principales marcas de tecnología enterprise del mercado.
          </p>
        </div>
      </div>

      {/* Brands grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mergedBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marcas/${brand.slug}` as never}
              className="group flex flex-col p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Color accent */}
              <div
                className="h-1 rounded-full mb-5 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: brand.color }}
              />

              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-brand-navy group-hover:text-brand-cyan transition-colors">
                  {brand.name}
                </h2>
                {brand.partnerLevel && (
                  <BadgeCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
                )}
              </div>

              {brand.partnerLevel && (
                <p className="text-[11px] font-semibold text-brand-cyan uppercase tracking-wide mb-3">
                  {brand.partnerLevel}
                </p>
              )}

              {/* Static description from data.ts */}
              {(() => {
                const s = staticBrands.find((b) => b.slug === brand.slug);
                return s ? (
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                    {s.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                );
              })()}

              <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-brand-navy group-hover:text-brand-cyan transition-colors">
                Ver productos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
