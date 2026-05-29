import { notFound } from "next/navigation";
import { getBrands, searchProducts, odooImageUrl } from "@/lib/odoo";
import { brands as staticBrands } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, BadgeCheck, Package } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const staticBrand = staticBrands.find((b) => b.slug === slug);
  return {
    title: staticBrand?.name ?? slug,
    description: staticBrand?.description,
  };
}

export default async function MarcaDetailPage({ params }: Props) {
  const { slug } = await params;

  // Find brand info (Odoo first, then static fallback)
  let brandId: number | null = null;
  let brandName = slug;
  let partnerLevel: string | undefined;
  let logoUrl = "";

  try {
    const odooBrands = await getBrands();
    const found = odooBrands.find((b) => b.slug === slug);
    if (found) {
      brandId = found.id;
      brandName = found.name;
      partnerLevel = found.partner_level || undefined;
      logoUrl = odooImageUrl("product.brand", found.id, "logo");
    }
  } catch { /* use static */ }

  const staticBrand = staticBrands.find((b) => b.slug === slug);
  if (!brandId && !staticBrand) notFound();

  if (!brandId) {
    // brand exists in static data but not yet in Odoo — still render page
    brandName = staticBrand!.name;
    partnerLevel = staticBrand!.partnerLevel;
  }

  // Fetch products for this brand
  const products = await searchProducts({
    domain: [["cc_brand_id.slug", "=", slug]],
    limit: 48,
  }).catch(() => []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-brand-navy border-b border-white/10 py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/marcas"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-green transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Todas las marcas
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {logoUrl && (
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={brandName} className="w-14 h-14 object-contain" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{brandName}</h1>
                {partnerLevel && <BadgeCheck className="w-7 h-7 text-brand-green" />}
              </div>
              {partnerLevel && (
                <p className="text-brand-green text-sm font-semibold uppercase tracking-wide mb-2">
                  {partnerLevel}
                </p>
              )}
              {staticBrand?.description && (
                <p className="text-slate-300 max-w-xl leading-relaxed">
                  {staticBrand.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-brand-navy">
            Productos de {brandName}
          </h2>
          <span className="text-sm text-slate-400">{products.length} productos</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">No hay productos disponibles para esta marca aún.</p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-brand-navy text-white text-sm font-semibold hover:bg-brand-navy-light transition-colors"
            >
              Ver todo el catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
