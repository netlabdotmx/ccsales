import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/odoo";

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
    const product = await getProduct(numId);

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Odoo product detail error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 502 });
  }
}
