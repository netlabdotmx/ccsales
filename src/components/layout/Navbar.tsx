"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { brands, solutions } from "@/lib/data";
import {
  Menu, X, ShoppingCart, Globe, ChevronDown,
  ShieldCheck, Network, Wifi, Server, HardDrive, Monitor,
} from "lucide-react";

const solutionIcons: Record<string, React.ElementType> = {
  seguridad: ShieldCheck, redes: Network, wifi: Wifi,
  servidores: Server, almacenamiento: HardDrive, computo: Monitor,
};

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"brands" | "solutions" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isDark = !scrolled && !mobileOpen;
  const featuredBrands = brands.filter((b) => b.featured);

  return (
    <header
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-white shadow-lg"
          : "bg-brand-navy/90 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={isDark ? "/logos/logo con texto blanco.png" : "/logos/logo con texto.png"}
              alt="CCS"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Brands mega menu */}
            <button
              onClick={() => setActiveMenu(activeMenu === "brands" ? null : "brands")}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:text-brand-navy hover:bg-brand-gray"
              }`}
            >
              {t("nav.brands")}
              <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === "brands" ? "rotate-180" : ""}`} />
            </button>

            {/* Solutions mega menu */}
            <button
              onClick={() => setActiveMenu(activeMenu === "solutions" ? null : "solutions")}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:text-brand-navy hover:bg-brand-gray"
              }`}
            >
              {t("nav.solutions")}
              <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === "solutions" ? "rotate-180" : ""}`} />
            </button>

            {[
              { href: "/productos" as const, label: t("nav.products") },
              { href: "/nosotros" as const, label: t("nav.about") },
              { href: "/contacto" as const, label: t("nav.contact") },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-brand-navy hover:bg-brand-gray"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <Link
              href={pathname as never}
              locale={pathname.startsWith("/en") ? "es" : "en"}
              className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isDark
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {pathname.startsWith("/en") ? "ES" : "EN"}
            </Link>

            {/* Cart */}
            <Link
              href="/carrito"
              className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-brand-navy text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* CTA */}
            <Link
              href="/contacto"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green text-brand-navy text-sm font-semibold hover:bg-brand-green-light transition-colors"
            >
              {t("nav.quote")}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
              }`}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Brands mega-dropdown ─────────────────────────────── */}
      {activeMenu === "brands" && (
        <div className="hidden lg:block absolute left-0 right-0 bg-white shadow-2xl border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
              {t("brands.title")}
            </p>
            <div className="grid grid-cols-4 gap-4">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/marcas/${brand.slug}` as never}
                  onClick={() => setActiveMenu(null)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-gray group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={32}
                      height={32}
                      className="object-contain w-8 h-8"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-navy">{brand.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{brand.description.slice(0, 60)}…</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/marcas"
                onClick={() => setActiveMenu(null)}
                className="text-sm font-medium text-brand-navy hover:text-brand-cyan transition-colors"
              >
                {t("brands.viewAll")} →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Solutions mega-dropdown ──────────────────────────── */}
      {activeMenu === "solutions" && (
        <div className="hidden lg:block absolute left-0 right-0 bg-white shadow-2xl border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
              {t("solutions.title")}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {solutions.map((sol) => {
                const Icon = solutionIcons[sol.slug] ?? ShieldCheck;
                return (
                  <Link
                    key={sol.slug}
                    href={`/soluciones/${sol.slug}` as never}
                    onClick={() => setActiveMenu(null)}
                    className="flex items-start gap-3 p-4 rounded-xl hover:bg-brand-gray group transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-navy flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green transition-colors">
                      <Icon className="w-4 h-4 text-brand-green group-hover:text-brand-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{sol.name.es}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{sol.description.es.slice(0, 70)}…</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile menu ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            <Link href="/marcas" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-brand-gray">
              {t("nav.brands")}
            </Link>
            <Link href="/soluciones" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-brand-gray">
              {t("nav.solutions")}
            </Link>
            <Link href="/productos" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-brand-gray">
              {t("nav.products")}
            </Link>
            <Link href="/nosotros" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-brand-gray">
              {t("nav.about")}
            </Link>
            <Link href="/contacto" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-brand-gray">
              {t("nav.contact")}
            </Link>
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/contacto"
                className="block w-full text-center px-4 py-3 rounded-full bg-brand-green text-brand-navy font-semibold hover:bg-brand-green-light transition-colors"
              >
                {t("nav.quote")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
