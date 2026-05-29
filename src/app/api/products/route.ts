import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/odoo";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const brand = searchParams.get("brand");
  const featured = searchParams.get("featured");
  const limit = Number(searchParams.get("limit") ?? "20");
  const offset = Number(searchParams.get("offset") ?? "0");

  try {
    // Solo productos activos asignados a la tienda ccsales (B2B)
    const domain: unknown[] = [
      ["sale_ok", "=", true],
      ["cc_store_ids.slug", "=", "ccsales"],
    ];
    if (brand) domain.push(["cc_brand_id.slug", "=", brand]);
    if (featured === "true") domain.push(["cc_featured", "=", true]);

    const products = await searchProducts({ domain, limit, offset });
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Odoo products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 502 }
    );
  }
}
