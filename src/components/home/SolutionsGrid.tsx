import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { solutions } from "@/lib/data";
import {
  ShieldCheck, Network, Wifi, Server, HardDrive, Monitor, ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, Network, Wifi, Server, HardDrive, Monitor,
};

const cardGradients = [
  "from-brand-navy to-brand-navy-light",
  "from-slate-800 to-slate-700",
  "from-brand-navy-dark to-brand-navy",
  "from-slate-700 to-slate-800",
  "from-brand-navy to-slate-800",
  "from-slate-800 to-brand-navy-dark",
];

export default function SolutionsGrid() {
  const t = useTranslations("solutions");

  return (
    <section className="bg-brand-gray py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-3">
            Soluciones
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mb-4">
            {t("title")}
          </h2>
          <p className="text-slate-600">{t("subtitle")}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((sol, idx) => {
            const Icon = iconMap[sol.icon] ?? ShieldCheck;
            const gradient = cardGradients[idx % cardGradients.length];
            return (
              <Link
                key={sol.slug}
                href={`/soluciones/${sol.slug}` as never}
                className={`group relative bg-gradient-to-br ${gradient} rounded-2xl p-6 overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl`}
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-green/20 transition-colors" />

                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-brand-green/15 border border-brand-green/30 flex items-center justify-center mb-5 group-hover:bg-brand-green/25 transition-colors">
                    <Icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{sol.name.es}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {sol.description.es}
                  </p>
                  <div className="mt-5 flex items-center gap-1 text-brand-green text-sm font-semibold">
                    {t("explore")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
