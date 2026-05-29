import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { getBrands } from "@/lib/odoo";

export const metadata = {
  title: "Productos",
  description: "Catálogo de productos enterprise: Cisco, Fortinet, Aruba, HPE, Lenovo y más.",
};

export default async function ProductosPage() {
  // Fetch brands server-side for the filter sidebar
  let brands: { id: number; name: string; slug: string }[] = [];
  try {
    brands = await getBrands();
  } catch {
    // fallback to empty — client will still work
  }

  return (
    <div className="pt-20">
      <Suspense fallback={null}>
        <ProductsClient brands={brands} />
      </Suspense>
    </div>
  );
}
