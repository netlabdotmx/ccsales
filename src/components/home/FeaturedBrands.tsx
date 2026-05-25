import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { brands } from "@/lib/data";
import { ArrowRight, BadgeCheck } from "lucide-react";

const brandColors: Record<string, string> = {
  cisco: "#00BCEB", meraki: "#00BCEB", fortinet: "#EE3124",
  aruba: "#FF6800", hpe: "#01A982",
};

export default function FeaturedBrands() {
  const t = useTranslations("brands");
  const featured = brands.filter((b) => b.featured).slice(0, 4);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marcas/${brand.slug}` as never}
              className="group flex flex-col p-6 rounded-2xl border border-slate-100 hover:border-brand-gray-dark hover:shadow-lg transition-all duration-300 bg-white"
            >
              {/* Color accent top bar */}
              <div
                className="h-1 rounded-full mb-5 opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: brandColors[brand.slug] ?? "#8EE000" }}
              />

              {/* Brand name + partner badge */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-brand-navy">{brand.name}</h3>
                {brand.partnerLevel && (
                  <BadgeCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
                )}
              </div>

              {brand.partnerLevel && (
                <p className="text-[11px] font-medium text-brand-cyan uppercase tracking-wide mb-3">
                  {brand.partnerLevel}
                </p>
              )}

              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                {brand.description}
              </p>

              <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-brand-navy group-hover:text-brand-cyan transition-colors">
                {t("viewProducts")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
