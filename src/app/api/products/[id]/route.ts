import { NextRequest, NextResponse } from "next/server";
import { getProduct, getProductPriceTiers } from "@/lib/odoo";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const [product, tiers] = await Promise.all([
      getProduct(numId),
      getProductPriceTiers(numId),
    ]);

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { ...product, priceTiers: tiers } });
  } catch (error) {
    console.error("Odoo product detail error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 502 });
  }
}
