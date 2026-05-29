import { notFound } from "next/navigation";
import { searchProducts } from "@/lib/odoo";
import { solutions, brands as staticBrands } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, BadgeCheck, Package, ShieldCheck, Network, Wifi, Server, HardDrive, Monitor } from "lucide-react";
import type { Metadata } from "next";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, Network, Wifi, Server, HardDrive, Monitor,
};

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sol = solutions.find((s) => s.slug === slug);
  if (!sol) return {};
  return { title: sol.name.es, description: sol.description.es };
}

export default async function SolucionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = solutions.find((s) => s.slug === slug);
  if (!solution) notFound();

  const Icon = iconMap[solution.icon] ?? ShieldCheck;
  const relatedBrands = staticBrands.filter((b) => solution.brandSlugs.includes(b.slug));

  // Fetch products from related brands
  const products = await searchProducts({
    domain: [["cc_brand_id.slug", "in", solution.brandSlugs]],
    limit: 48,
  }).catch(() => []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-brand-navy py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/soluciones"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-green transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Todas las soluciones
          </Link>

          <div className="flex items-start gap-6 max-w-3xl">
            <div className="w-14 h-14 rounded-2xl bg-brand-green/15 border border-brand-green/30 flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-brand-green" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {solution.name.es}
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {solution.description.es}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related brands */}
      {relatedBrands.length > 0 && (
        <div className="bg-brand-gray border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Marcas especializadas en esta solución
            </p>
            <div className="flex flex-wrap gap-3">
              {relatedBrands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/marcas/${b.slug}` as never}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-brand-navy hover:shadow-sm transition-all text-sm font-medium text-slate-700"
                >
                  {b.partnerLevel && <BadgeCheck className="w-4 h-4 text-brand-green" />}
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-brand-navy">
            Productos relacionados
          </h2>
          <Link
            href={{ pathname: "/productos", query: {} } as never}
            className="text-sm font-medium text-brand-cyan hover:text-brand-cyan-dark transition-colors"
          >
            Ver catálogo completo →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">Próximamente productos en esta categoría.</p>
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
