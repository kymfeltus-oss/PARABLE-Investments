import { NextRequest, NextResponse } from "next/server";
import { shortHash } from "@/lib/pitch-access-agreement-hash";
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

  const { data: templates, error: tErr } = await admin
    .from("nda_templates")
    .select("*")
    .ilike("presenter_email", presenterEmail)
    .order("updated_at", { ascending: false });

  if (tErr) {
    return NextResponse.json({ ok: false, error: "Could not load templates" }, { status: 500 });
  }

  const activeTemplate =
    (templates ?? []).find((t) => t.status === "finalized" && t.is_active && t.active_for_presenter) ??
    (templates ?? []).find((t) => t.status === "finalized" && t.is_active) ??
    null;

  let agreementsQuery = admin
    .from("pitch_access_agreements")
    .select(
      "id, investor_name, investor_email, agreement_version, created_at, signed_at_utc, email_status, document_hash, company_name, product_name, signed_record_url"
    )
    .ilike("presenter_email", presenterEmail)
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: rows, error: aErr } = await agreementsQuery;
  if (aErr) {
    return NextResponse.json({ ok: false, error: "Could not load agreements" }, { status: 500 });
  }

  const agreements = (rows ?? []).map((row) => ({
    id: row.id,
    investorName: row.investor_name,
    investorEmail: row.investor_email,
    version: row.agreement_version,
    signedAt: row.signed_at_utc ?? row.created_at,
    emailStatus: row.email_status,
    companyName: row.company_name,
    productName: row.product_name,
    documentHashShort: shortHash(row.document_hash),
    signedRecordUrl: row.signed_record_url,
  }));

  const stats = {
    totalSigned: agreements.length,
    emailsSent: agreements.filter((a) => a.emailStatus === "sent").length,
    emailsUnconfigured: agreements.filter(
      (a) => a.emailStatus === "unconfigured" || a.emailStatus === "not_sent"
    ).length,
    emailsFailed: agreements.filter((a) => a.emailStatus === "failed").length,
  };

  return NextResponse.json({
    ok: true,
    activeTemplate: activeTemplate
      ? {
          id: activeTemplate.id,
          companyName: activeTemplate.company_name,
          productName: activeTemplate.product_name,
          presenterName: activeTemplate.presenter_name,
          presenterEmail: activeTemplate.presenter_email,
          governingState: activeTemplate.governing_state,
          agreementVersion: activeTemplate.agreement_version,
          signingUrl: activeTemplate.signing_url,
        }
      : null,
    agreements,
    stats,
  });
}
