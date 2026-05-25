import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/odoo";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const brand = searchParams.get("brand");
  const solution = searchParams.get("solution");
  const limit = Number(searchParams.get("limit") ?? "20");
  const offset = Number(searchParams.get("offset") ?? "0");

  try {
    const domain: unknown[] = [["sale_ok", "=", true]];
    if (brand) domain.push(["categ_id.name", "ilike", brand]);

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
