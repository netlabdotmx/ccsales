import { getBrands } from "@/lib/odoo";
import { brands as staticBrands } from "@/lib/data";
import { Link } from "@/i18n/navigation";

const ODOO_BASE = process.env.ODOO_API_URL ?? "https://ccsales.netlab.mx";

const brandColors: Record<string, string> = {
  cisco: "#00BCEB", meraki: "#00BCEB", fortinet: "#EE3124",
  aruba: "#FF6800", "aruba-hpe": "#FF6800", hpe: "#01A982",
  lenovo: "#E2231A", extreme: "#7B2D8B", zebra: "#1A1A1A",
};

export default async function BrandsStrip() {
  const odooBrands = await getBrands().catch(() => []);

  const items = odooBrands.length > 0
    ? odooBrands.map((b) => ({
        slug:  b.slug,
        name:  b.name,
        logo:  `${ODOO_BASE}${b.logo_url}`,
        color: brandColors[b.slug] ?? "#003845",
      }))
    : staticBrands.map((b) => ({
        slug:  b.slug,
        name:  b.name,
        logo:  b.logo,
        color: brandColors[b.slug] ?? "#003845",
      }));

  const doubled = [...items, ...items];

  return (
    <section className="bg-white py-12 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-7 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Distribuidores autorizados
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-0">
          {doubled.map((brand, idx) => (
            <Link
              key={`${brand.slug}-${idx}`}
              href={`/marcas/${brand.slug}` as never}
              className="shrink-0 mx-4"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-md transition-all duration-200 group" style={{ minWidth: "160px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-8 h-8 object-contain shrink-0"
                />
                <span
                  className="text-sm font-bold tracking-tight group-hover:opacity-80 transition-opacity"
                  style={{ color: brand.color }}
                >
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
