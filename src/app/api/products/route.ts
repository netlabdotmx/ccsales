import { NextRequest, NextResponse } from "next/server";
import { searchProducts, countProducts } from "@/lib/odoo";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const brand    = searchParams.get("brand");     // cc_brand_id.slug
  const featured = searchParams.get("featured");  // "true"
  const condition= searchParams.get("condition"); // "new"|"refurbished"|"used"
  const q        = searchParams.get("q");         // name search
  const limit    = Math.min(Number(searchParams.get("limit")  ?? "24"), 100);
  const offset   = Number(searchParams.get("offset") ?? "0");

  try {
    const domain: unknown[] = [];
    if (brand)     domain.push(["cc_brand_id.slug", "=", brand]);
    if (featured === "true") domain.push(["cc_featured", "=", true]);
    if (condition) domain.push(["cc_condition", "=", condition]);
    if (q)         domain.push(["name", "ilike", q]);

    const [products, total] = await Promise.all([
      searchProducts({ domain, limit, offset }),
      countProducts(domain),
    ]);

    return NextResponse.json({ data: products, total, limit, offset });
  } catch (error) {
    console.error("Odoo products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 502 });
  }
}
