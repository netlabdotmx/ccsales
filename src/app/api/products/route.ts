import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/odoo";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const brand     = searchParams.get("brand")     ?? undefined;
  const condition = searchParams.get("condition") ?? undefined;
  const q         = searchParams.get("q")         ?? undefined;
  const categ     = searchParams.get("categ") ? Number(searchParams.get("categ")) : undefined;
  const featured  = searchParams.get("featured") === "true" ? true : undefined;
  const sort      = (searchParams.get("sort") ?? undefined) as "name" | "price_asc" | "price_desc" | "newest" | undefined;
  const limit     = Math.min(Number(searchParams.get("limit")  ?? "24"), 100);
  const page      = Number(searchParams.get("page")  ?? "1");

  try {
    const result = await searchProducts({ q, brand, condition, categ, featured, sort, limit, page });
    return NextResponse.json({ data: result.products, total: result.total, pages: result.pages, page: result.page });
  } catch (error) {
    console.error("Odoo products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 502 });
  }
}
