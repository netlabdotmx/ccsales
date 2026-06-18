import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle, Zap } from "lucide-react";
import { searchProducts } from "@/lib/odoo";
import Image from "next/image";

const WA_URL = `https://wa.me/525618507997?text=${encodeURIComponent("Hola, me interesa cotizar productos.")}`;

export default async function Hero() {
  const t = await getTranslations("hero");

  // Fetch a handful of products to showcase in the visual panel
  const showcase = await searchProducts({ limit: 6, sort: "price_desc" })
    .then((r) => r.products.filter((p) => p.imageUrl))
    .catch(() => []);

  return (
    <section className="relative min-h-screen flex items-center bg-brand-navy overflow-hidden">
      {/* Background mesh gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-cyan/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/15 border border-brand-green/30 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-xs font-semibold tracking-wide uppercase">
                {t("badge")}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              {t("title")}{" "}
              <span className="gradient-text">{t("titleHighlight")}</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-10">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-green text-brand-navy font-semibold text-sm hover:bg-brand-green-light transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/30"
              >
                Ver catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                {t("ctaSecondary")}
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: "+1,178", label: "Productos en catálogo" },
                { value: "12+",    label: "Marcas enterprise" },
                { value: "+15",    label: "Años de experiencia" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-3xl font-bold gradient-text">{value}</span>
                  <span className="text-sm text-slate-400 mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product showcase grid */}
          {showcase.length >= 4 && (
            <div className="hidden lg:block relative">
              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 z-20 flex items-center gap-2 bg-brand-green text-brand-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                <Zap className="w-3 h-3" />
                Stock disponible hoy
              </div>

              <div className="grid grid-cols-2 gap-3">
                {showcase.slice(0, 4).map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/productos/${p.id}` as never}
                    className={`group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-brand-green/40 transition-all duration-300 ${i === 0 ? "row-span-1" : ""}`}
                  >
                    <div className="aspect-square bg-white rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={120}
                        height={120}
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-white text-xs font-semibold line-clamp-2 leading-snug mb-1">
                      {p.name}
                    </p>
                    <p className="text-brand-green text-sm font-bold">
                      ${p.listPrice.toLocaleString("es-MX", { minimumFractionDigits: 0 })}
                    </p>
                  </Link>
                ))}
              </div>

              {/* View more pill */}
              <div className="mt-3 text-center">
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-green transition-colors"
                >
                  Ver los 1,178+ productos <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent" />
    </section>
  );
}
