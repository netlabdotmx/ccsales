import { useTranslations } from "next-intl";
import { brands } from "@/lib/data";

// Brand name text displayed as text blocks since SVGs may not exist yet
const brandColors: Record<string, string> = {
  cisco:   "#00BCEB",
  meraki:  "#00BCEB",
  fortinet:"#EE3124",
  aruba:   "#FF6800",
  hpe:     "#01A982",
  lenovo:  "#E2231A",
  extreme: "#7B2D8B",
  zebra:   "#000000",
};

export default function BrandsStrip() {
  const t = useTranslations("brands");
  // Duplicate for infinite loop
  const doubled = [...brands, ...brands];

  return (
    <section className="bg-white py-14 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {t("title")}
        </p>
      </div>

      <div className="relative">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-0">
          {doubled.map((brand, idx) => (
            <div
              key={`${brand.slug}-${idx}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <div
                className="px-6 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-default"
                style={{ minWidth: "140px" }}
              >
                <span
                  className="text-sm font-bold tracking-tight"
                  style={{ color: brandColors[brand.slug] ?? "#64748b" }}
                >
                  {brand.name}
                </span>
                {brand.partnerLevel && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{t("partner")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
