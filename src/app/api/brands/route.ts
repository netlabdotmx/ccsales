import { NextResponse } from "next/server";
import { getBrands, odooImageUrl } from "@/lib/odoo";

export async function GET() {
  try {
    const raw = await getBrands();
    const brands = raw.map((b) => ({
      ...b,
      logo:     odooImageUrl("product.brand", b.id, "logo"),
      logoDark: odooImageUrl("product.brand", b.id, "logo_dark"),
    }));
    return NextResponse.json({ data: brands });
  } catch (error) {
    console.error("Odoo brands error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 502 });
  }
}
