import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";

const WA_URL = `https://wa.me/525618507997?text=${encodeURIComponent("Hola, me interesa cotizar productos.")}`;

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center bg-brand-navy overflow-hidden">
      {/* Background mesh gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/15 border border-brand-green/30 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-brand-green text-xs font-semibold tracking-wide uppercase">
              {t("badge")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            {t("title")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-10">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/marcas"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-green text-brand-navy font-semibold text-sm hover:bg-brand-green-light transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/30"
            >
              {t("ctaPrimary")}
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
          <div className="mt-14 flex flex-wrap gap-8">
            {[
              { value: "+10", label: t("statsYears") },
              { value: "8", label: t("statsBrands") },
              { value: "CDMX", label: t("statsDelivery") },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-3xl font-bold gradient-text">{value}</span>
                <span className="text-sm text-slate-400 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent" />
    </section>
  );
}
