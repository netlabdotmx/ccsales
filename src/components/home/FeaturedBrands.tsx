import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brands as staticBrands } from "@/lib/data";
import { getBrands } from "@/lib/odoo";
import { ArrowRight, BadgeCheck } from "lucide-react";

const ODOO_BASE = process.env.ODOO_API_URL ?? "https://ccsales.netlab.mx";

const brandColors: Record<string, string> = {
  cisco: "#00BCEB", meraki: "#00BCEB", fortinet: "#EE3124",
  aruba: "#FF6800", "aruba-hpe": "#FF6800", hpe: "#01A982",
  lenovo: "#E2231A", extreme: "#7B2D8B", zebra: "#1A1A1A",
};

export default async function FeaturedBrands() {
  const t = await getTranslations("brands");

  const odooBrands = await getBrands().catch(() => []);

  const featured = odooBrands.length > 0
    ? odooBrands.slice(0, 6).map((b) => ({
        slug:         b.slug,
        name:         b.name,
        logo:         `${ODOO_BASE}${b.logo_url}`,
        partnerLevel: b.partner_level ?? undefined,
        description:  staticBrands.find((s) => s.slug === b.slug)?.description ?? "",
        color:        brandColors[b.slug] ?? "#003845",
      }))
    : staticBrands.filter((b) => b.featured).slice(0, 6).map((b) => ({
        slug:         b.slug,
        name:         b.name,
        logo:         b.logo,
        partnerLevel: b.partnerLevel,
        description:  b.description,
        color:        brandColors[b.slug] ?? "#003845",
      }));

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-2">
              Partners certificados
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">{t("title")}</h2>
          </div>
          <Link
            href="/marcas"
            className="text-sm font-semibold text-brand-navy hover:text-brand-cyan transition-colors flex items-center gap-1"
          >
            {t("viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marcas/${brand.slug}` as never}
              className="group flex flex-col items-center p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 bg-white text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <div
                className="w-8 h-0.5 rounded-full mb-2 opacity-60 group-hover:opacity-100 group-hover:w-12 transition-all duration-300"
                style={{ backgroundColor: brand.color }}
              />

              <h3 className="text-sm font-bold text-brand-navy leading-tight">{brand.name}</h3>

              {brand.partnerLevel && (
                <div className="flex items-center gap-1 mt-1">
                  <BadgeCheck className="w-3 h-3 text-brand-green" />
                  <p className="text-[10px] font-medium text-brand-green uppercase tracking-wide">Partner</p>
                </div>
              )}

              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {brand.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
