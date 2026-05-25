import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MessageCircle, ArrowRight } from "lucide-react";

const WA_URL = `https://wa.me/525618507997?text=${encodeURIComponent("Hola, quisiera solicitar una cotización.")}`;

export default function CTAStrip() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-navy" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-cyan/10" />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          ¿Listo para{" "}
          <span className="gradient-text">cotizar tu proyecto?</span>
        </h2>
        <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
          Habla con un especialista ahora. Precios por volumen, entregas express y soporte técnico incluido.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-green text-brand-navy font-bold text-sm hover:bg-brand-green-light transition-all hover:shadow-lg hover:shadow-brand-green/30"
          >
            <MessageCircle className="w-5 h-5" />
            Cotizar por WhatsApp
          </a>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Formulario de contacto
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
