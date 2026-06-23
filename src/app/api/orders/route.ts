import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/odoo";

const LineSchema = z.object({
  product_id: z.number(),
  variant_id: z.number().optional(),
  qty:        z.number().min(1).default(1),
  note:       z.string().optional(),
});

const BodySchema = z.object({
  partner: z.object({
    email:   z.string().email(),
    name:    z.string().min(1),
    phone:   z.string().optional(),
    company: z.string().optional(),
  }),
  lines:      z.array(LineSchema).min(1),
  client_ref: z.string().optional(),
  note:       z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const order = await createOrder(parsed.data);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "No se pudo crear la orden" }, { status: 502 });
  }
}
