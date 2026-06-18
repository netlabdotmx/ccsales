import { NextResponse } from "next/server";
import { getBrands } from "@/lib/odoo";

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json({ data: brands });
  } catch (error) {
    console.error("Odoo brands error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 502 });
  }
}
