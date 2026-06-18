import { notFound } from "next/navigation";
import { getBrands, getCategories } from "@/lib/odoo";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import type { Category } from "@/types";
import CategoryProductsClient from "@/components/products/CategoryProductsClient";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

function findCategory(cats: Category[], id: number): Category | null {
  for (const c of cats) {
    if (c.id === id) return c;
    const found = findCategory(c.children ?? [], id);
    if (found) return found;
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const tree = await getCategories();
    const cat = findCategory(tree, Number(id));
    return { title: cat?.name ?? "Categoría" };
  } catch {
    return {};
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) notFound();

  const [tree, brands] = await Promise.all([
    getCategories().catch(() => []),
    getBrands().catch(() => []),
  ]);

  const category = findCategory(tree, numId);
  if (!category) notFound();

  // Find parent for breadcrumb
  function findParent(cats: Category[], id: number): Category | null {
    for (const c of cats) {
      if (c.children?.some((ch) => ch.id === id)) return c;
      const found = findParent(c.children ?? [], id);
      if (found) return found;
    }
    return null;
  }
  const parent = findParent(tree, numId);

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-brand-navy border-b border-white/10 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-green transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            {parent ? parent.name : "Catálogo"}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{category.name}</h1>
          {category.children?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {category.children.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categorias/${sub.id}` as never}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                >
                  {sub.name}
                  {sub.product_count > 0 && (
                    <span className="ml-1.5 opacity-60">({sub.product_count})</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products with brand filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <CategoryProductsClient
          categoryId={numId}
          brands={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
        />
      </div>
    </div>
  );
}
