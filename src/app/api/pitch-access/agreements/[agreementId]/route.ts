import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ agreementId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const { agreementId } = await ctx.params;
  const { data, error } = await admin
    .from("pitch_access_agreements")
    .select("*")
    .eq("id", agreementId)
    .maybeSingle();

  if (error) {
    console.error("[pitch-access/agreements GET id]", error.message);
    return NextResponse.json({ ok: false, error: "Could not load agreement" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ ok: false, error: "Agreement not found" }, { status: 404 });
  }

  // document_snapshot is immutable after signing — never mutate in API responses beyond read.
  return NextResponse.json({
    ok: true,
    agreement: {
      id: data.id,
      investorName: data.investor_name,
      investorEmail: data.investor_email,
      signature: data.signature,
      version: data.agreement_version,
      signedAt: data.signed_at_utc ?? data.created_at,
      clientIp: data.client_ip,
      userAgent: data.user_agent,
      deviceFingerprint: data.device_fingerprint,
      documentSnapshot: data.document_snapshot,
      documentHash: data.document_hash,
      recordHash: data.record_hash,
      emailStatus: data.email_status,
      ndaTemplateId: data.nda_template_id,
      presenterName: data.presenter_name,
      presenterEmail: data.presenter_email,
      companyName: data.company_name,
      productName: data.product_name,
      governingState: data.governing_state,
      consentCheckboxText: data.consent_checkbox_text,
      signingUrl: data.signing_url,
      signedRecordUrl: data.signed_record_url,
      signedPdfUrl: data.signed_pdf_url,
    },
  });
}
