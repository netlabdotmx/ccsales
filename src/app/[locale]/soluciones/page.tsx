import { solutions } from "@/lib/data";
import { Link } from "@/i18n/navigation";
import { ShieldCheck, Network, Wifi, Server, HardDrive, Monitor, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluciones",
  description: "Soluciones enterprise: seguridad, redes, WiFi, servidores, almacenamiento y cómputo para tu empresa.",
};

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, Network, Wifi, Server, HardDrive, Monitor,
};

export default function SolucionesPage() {
  return (
    <div className="pt-20">
      <div className="bg-brand-navy py-16 px-4 sm:px-6 text-center">
        <p className="text-xs font-semibold text-brand-cyan uppercase tracking-widest mb-3">Soluciones</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">¿Qué necesitas resolver?</h1>
        <p className="text-slate-300 text-lg max-w-xl mx-auto">
          Encuentra la tecnología adecuada para cada necesidad de tu empresa.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol) => {
            const Icon = iconMap[sol.icon] ?? ShieldCheck;
            return (
              <Link
                key={sol.slug}
                href={`/soluciones/${sol.slug}` as never}
                className="group flex flex-col p-6 rounded-2xl border border-slate-100 hover:border-brand-navy hover:shadow-lg bg-white transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-navy flex items-center justify-center mb-5 group-hover:bg-brand-green transition-colors">
                  <Icon className="w-6 h-6 text-brand-green group-hover:text-brand-navy transition-colors" />
                </div>
                <h2 className="text-lg font-bold text-brand-navy mb-2">{sol.name.es}</h2>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{sol.description.es}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-brand-navy group-hover:text-brand-cyan transition-colors">
                  Explorar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
