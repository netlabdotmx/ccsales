import { notFound } from "next/navigation";
import { getBrands, getCategories, odooImageUrl } from "@/lib/odoo";
import { brands as staticBrands } from "@/lib/data";
import BrandProductsClient from "@/components/products/BrandProductsClient";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, BadgeCheck } from "lucide-react";
import type { Metadata } from "next";
import type { Category } from "@/types";

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

/** Flatten all categories from a tree node */
function flattenCategories(cats: Category[]): Category[] {
  return cats.flatMap((c) => [c, ...flattenCategories(c.children ?? [])]);
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
      partnerLevel = found.partner_level ?? undefined;
      logoUrl = odooImageUrl("product.brand", found.id, "logo");
    }
  } catch { /* use static */ }

  const staticBrand = staticBrands.find((b) => b.slug === slug);
  if (!brandId && !staticBrand) notFound();

  if (!brandId) {
    brandName = staticBrand!.name;
    partnerLevel = staticBrand!.partnerLevel;
  }

  // Fetch full category tree and find the node that matches this brand
  let brandCategories: Category[] = [];
  try {
    const tree = await getCategories();
    const all = flattenCategories(tree);
    // Find the brand node by name (case-insensitive)
    const brandNode = all.find(
      (c) => c.name.toLowerCase() === brandName.toLowerCase()
        || c.name.toLowerCase() === slug.replace(/-/g, " ").toLowerCase()
    );
    if (brandNode?.children?.length) {
      brandCategories = brandNode.children;
    } else {
      // fallback: show second-level categories (Networking, Cómputo, etc.)
      brandCategories = tree[0]?.children ?? [];
    }
  } catch { /* no categories filter */ }

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

      {/* Products with filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <BrandProductsClient brandSlug={slug} categories={brandCategories} />
      </div>
    </div>
  );
}
