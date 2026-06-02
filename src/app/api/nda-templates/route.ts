import { NextRequest, NextResponse } from "next/server";
import {
  fetchDraftForPresenter,
  normalizeNdaTemplateInput,
  serializeNdaTemplate,
} from "@/lib/nda-templates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const presenterEmail = req.nextUrl.searchParams.get("presenterEmail")?.trim().toLowerCase();
  if (!presenterEmail) {
    return NextResponse.json({ ok: false, error: "presenterEmail required" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("nda_templates")
    .select("*")
    .ilike("presenter_email", presenterEmail)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[nda-templates GET]", error.message);
    return NextResponse.json({ ok: false, error: "Could not load templates" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    templates: (data ?? []).map(serializeNdaTemplate),
  });
}

export async function POST(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Expected JSON body" }, { status: 400 });
  }

  const normalized = normalizeNdaTemplateInput({
    companyName: typeof body.companyName === "string" ? body.companyName : undefined,
    productName: typeof body.productName === "string" ? body.productName : undefined,
    presenterName: typeof body.presenterName === "string" ? body.presenterName : undefined,
    presenterEmail: typeof body.presenterEmail === "string" ? body.presenterEmail : undefined,
    governingState: typeof body.governingState === "string" ? body.governingState : undefined,
  });

  if (!normalized.presenterEmail) {
    return NextResponse.json({ ok: false, error: "presenterEmail required" }, { status: 400 });
  }

  const existingDraft = await fetchDraftForPresenter(admin, normalized.presenterEmail);
  const now = new Date().toISOString();

  if (existingDraft) {
    const { data, error } = await admin
      .from("nda_templates")
      .update({
        company_name: normalized.companyName,
        product_name: normalized.productName,
        presenter_name: normalized.presenterName,
        presenter_email: normalized.presenterEmail,
        governing_state: normalized.governingState,
        agreement_version: normalized.agreementVersion,
        updated_at: now,
      })
      .eq("id", existingDraft.id)
      .eq("status", "draft")
      .select("*")
      .single();

    if (error || !data) {
      console.error("[nda-templates POST update draft]", error?.message);
      return NextResponse.json({ ok: false, error: "Could not save draft" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, template: serializeNdaTemplate(data) });
  }

  const { data, error } = await admin
    .from("nda_templates")
    .insert({
      presenter_email: normalized.presenterEmail,
      presenter_name: normalized.presenterName,
      company_name: normalized.companyName,
      product_name: normalized.productName,
      governing_state: normalized.governingState,
      agreement_version: normalized.agreementVersion,
      agreement_title: "Pitch Access Agreement",
      status: "draft",
      updated_at: now,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[nda-templates POST]", error?.message);
    return NextResponse.json({ ok: false, error: "Could not create draft" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, template: serializeNdaTemplate(data) });
}
