import { NextRequest, NextResponse } from "next/server";
import {
  fetchNdaTemplateById,
  normalizeNdaTemplateInput,
  serializeNdaTemplate,
} from "@/lib/nda-templates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ templateId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const { templateId } = await ctx.params;
  const row = await fetchNdaTemplateById(admin, templateId);
  if (!row) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, template: serializeNdaTemplate(row) });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const { templateId } = await ctx.params;
  const existing = await fetchNdaTemplateById(admin, templateId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }
  if (existing.status === "finalized") {
    return NextResponse.json(
      { ok: false, error: "Finalized templates cannot be edited. Save a new draft." },
      { status: 409 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Expected JSON body" }, { status: 400 });
  }

  const normalized = normalizeNdaTemplateInput({
    companyName: typeof body.companyName === "string" ? body.companyName : existing.company_name,
    productName: typeof body.productName === "string" ? body.productName : existing.product_name,
    presenterName:
      typeof body.presenterName === "string" ? body.presenterName : existing.presenter_name ?? undefined,
    presenterEmail:
      typeof body.presenterEmail === "string" ? body.presenterEmail : existing.presenter_email ?? undefined,
    governingState:
      typeof body.governingState === "string" ? body.governingState : existing.governing_state,
    agreementVersion: existing.agreement_version,
  });

  const { data, error } = await admin
    .from("nda_templates")
    .update({
      company_name: normalized.companyName,
      product_name: normalized.productName,
      presenter_name: normalized.presenterName,
      presenter_email: normalized.presenterEmail,
      governing_state: normalized.governingState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", templateId)
    .eq("status", "draft")
    .select("*")
    .single();

  if (error || !data) {
    console.error("[nda-templates PATCH]", error?.message);
    return NextResponse.json({ ok: false, error: "Could not update draft" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, template: serializeNdaTemplate(data) });
}
