import { NextRequest, NextResponse } from "next/server";
import { shortHash } from "@/lib/pitch-access-agreement-hash";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const presenterEmail = req.nextUrl.searchParams.get("presenterEmail")?.trim().toLowerCase();

  let query = admin
    .from("pitch_access_agreements")
    .select(
      "id, investor_name, investor_email, agreement_version, created_at, signed_at_utc, email_status, nda_template_id, presenter_email, signing_url, signed_record_url, document_hash, company_name, product_name, nda_templates(company_name, product_name, agreement_version)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (presenterEmail) {
    query = query.ilike("presenter_email", presenterEmail);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[pitch-access/agreements GET]", error.message);
    return NextResponse.json({ ok: false, error: "Could not load agreements" }, { status: 500 });
  }

  const agreements = (data ?? []).map((row) => {
    const tpl = row.nda_templates as
      | { company_name: string; product_name: string; agreement_version: string }
      | { company_name: string; product_name: string; agreement_version: string }[]
      | null;
    const template = Array.isArray(tpl) ? tpl[0] : tpl;
    const company = row.company_name ?? template?.company_name ?? null;
    const product = row.product_name ?? template?.product_name ?? null;

    return {
      id: row.id,
      investorName: row.investor_name,
      investorEmail: row.investor_email,
      version: row.agreement_version,
      signedAt: row.signed_at_utc ?? row.created_at,
      emailStatus: row.email_status,
      ndaTemplateId: row.nda_template_id,
      presenterEmail: row.presenter_email,
      signingUrl: row.signing_url,
      signedRecordUrl: row.signed_record_url,
      companyName: company,
      productName: product,
      documentHash: row.document_hash,
      documentHashShort: shortHash(row.document_hash),
      templateName: company && product ? `${company} — ${product}` : "Pitch Lock default",
    };
  });

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
    agreements,
    stats,
    total: agreements.length,
  });
}
