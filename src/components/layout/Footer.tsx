import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { brands, solutions } from "@/lib/data";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const t = useTranslations();
  const featuredBrands = brands.filter((b) => b.featured);

  return (
    <footer className="bg-brand-navy-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/logos/logo con texto blanco.png"
                alt="CCS"
                width={140}
                height={44}
                className="h-10 w-auto object-contain mb-5"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
            <div className="mt-6 space-y-2.5">
              <a
                href="tel:+525618507997"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-brand-green transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-green flex-shrink-0" />
                +52 56 1850 7997
              </a>
              <a
                href="mailto:info@ccsales.com.mx"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-brand-green transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-green flex-shrink-0" />
                info@ccsales.com.mx
              </a>
              <p className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
                {t("contact.address")}
              </p>
              <p className="flex items-center gap-2.5 text-sm text-slate-400">
                <Clock className="w-4 h-4 text-brand-green flex-shrink-0" />
                {t("contact.hours")}
              </p>
            </div>
          </div>

          {/* Brands column */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {t("footer.brands")}
            </h3>
            <ul className="space-y-2.5">
              {featuredBrands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/marcas/${brand.slug}` as never}
                    className="text-sm text-slate-400 hover:text-brand-green transition-colors"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/marcas"
                  className="text-sm text-brand-cyan hover:text-brand-cyan-light transition-colors"
                >
                  {t("brands.viewAll")} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions column */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {t("footer.solutions")}
            </h3>
            <ul className="space-y-2.5">
              {solutions.map((sol) => (
                <li key={sol.slug}>
                  <Link
                    href={`/soluciones/${sol.slug}` as never}
                    className="text-sm text-slate-400 hover:text-brand-green transition-colors"
                  >
                    {sol.name.es}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & legal column */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {t("footer.company")}
            </h3>
            <ul className="space-y-2.5 mb-8">
              {[
                { href: "/nosotros" as const, label: t("footer.about") },
                { href: "/contacto" as const, label: t("footer.contact") },
                { href: "/productos" as const, label: t("nav.products") },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-brand-green transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/privacidad" as const, label: t("footer.privacy") },
                { href: "/terminos" as const, label: t("footer.terms") },
                { href: "/devoluciones" as const, label: t("footer.returns") },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-brand-green transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CCS Sales. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-3">
            {/* Social icons */}
            {[
              { href: "https://wa.me/525618507997", label: "WhatsApp", icon: "💬" },
              { href: "https://www.linkedin.com/company/ccs-sales", label: "LinkedIn", icon: "in" },
              { href: "https://www.facebook.com/ccssales", label: "Facebook", icon: "f" },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-brand-green hover:text-brand-navy flex items-center justify-center text-xs text-slate-400 font-bold transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
