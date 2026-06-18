import { NextResponse } from "next/server";
import { getCategories } from "@/lib/odoo";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("Odoo categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 502 });
  }
}
