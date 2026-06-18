import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/marcas": { es: "/marcas", en: "/brands" },
    "/marcas/[slug]": { es: "/marcas/[slug]", en: "/brands/[slug]" },
    "/soluciones": { es: "/soluciones", en: "/solutions" },
    "/soluciones/[slug]": { es: "/soluciones/[slug]", en: "/solutions/[slug]" },
    "/productos": { es: "/productos", en: "/products" },
    "/productos/[slug]": { es: "/productos/[slug]", en: "/products/[slug]" },
    "/carrito": { es: "/carrito", en: "/cart" },
    "/nosotros": { es: "/nosotros", en: "/about" },
    "/contacto": { es: "/contacto", en: "/contact" },
    "/privacidad": { es: "/privacidad", en: "/privacy" },
    "/terminos": { es: "/terminos", en: "/terms" },
    "/categorias/[id]": { es: "/categorias/[id]", en: "/categories/[id]" },
    "/devoluciones": { es: "/devoluciones", en: "/returns" },
  },
});

export type Locale = (typeof routing.locales)[number];
