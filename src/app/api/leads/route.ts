import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/odoo";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.email(),
  phone: z.string().min(8),
  description: z.string(),
  rfc: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, company, email, phone, description } = parsed.data;

    const leadId = await createLead({
      name: `Cotización web — ${company}`,
      contact_name: name,
      email_from: email,
      phone,
      partner_name: company,
      description,
    });

    return NextResponse.json({ success: true, leadId });
  } catch (error) {
    console.error("Odoo lead creation error:", error);
    // Still return success to user — lead can be created manually from WA message
    return NextResponse.json({ success: true, leadId: null });
  }
}
