import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { getBrands, getCategories } from "@/lib/odoo";
import type { Category } from "@/types";

export const metadata = {
  title: "Productos",
  description: "Catálogo de productos enterprise: Cisco, Fortinet, Aruba, HPE, Lenovo y más.",
};

export default async function ProductosPage() {
  let brands: { id: number; name: string; slug: string }[] = [];
  let categories: Category[] = [];
  try {
    [brands, categories] = await Promise.all([getBrands(), getCategories()]);
  } catch {
    // fallback to empty — client will still work
  }

  return (
    <div className="pt-20">
      <Suspense fallback={null}>
        {/* Pass second-level categories (Networking, Cómputo, etc.) */}
        <ProductsClient brands={brands} categories={categories[0]?.children ?? []} />
      </Suspense>
    </div>
  );
}
