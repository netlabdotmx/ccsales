import { NextResponse } from "next/server";
import { cancelOrder } from "@/lib/odoo";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const token: string | undefined = body?.token;
  if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 401 });

  try {
    const order = await cancelOrder(Number(id), token);
    return NextResponse.json({ order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("403")) return NextResponse.json({ error: "Token inválido" }, { status: 403 });
    if (msg.includes("404")) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    if (msg.includes("409")) return NextResponse.json({ error: "La orden ya no puede cancelarse" }, { status: 409 });
    return NextResponse.json({ error: "Error al cancelar orden" }, { status: 502 });
  }
}
