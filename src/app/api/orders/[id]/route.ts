import { NextResponse } from "next/server";
import { getOrder } from "@/lib/odoo";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 401 });

  try {
    const order = await getOrder(Number(id), token);
    return NextResponse.json({ order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("403")) return NextResponse.json({ error: "Token inválido" }, { status: 403 });
    if (msg.includes("404")) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    return NextResponse.json({ error: "Error al consultar orden" }, { status: 502 });
  }
}
