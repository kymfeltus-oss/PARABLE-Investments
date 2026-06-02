import { NextRequest, NextResponse } from "next/server";
import { CONSENT_CHECKBOX_TEXT } from "@/lib/pitch-access-agreement";
import { resolveNdaForInvestorSigning, serializeNdaTemplate } from "@/lib/nda-templates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const pitchId = req.nextUrl.searchParams.get("pitchId")?.trim();
  const templateId = req.nextUrl.searchParams.get("templateId")?.trim();
  const slug = req.nextUrl.searchParams.get("nda")?.trim();

  if (pitchId && !isUuid(pitchId)) {
    return NextResponse.json({ ok: false, error: "Invalid pitchId" }, { status: 400 });
  }
  if (templateId && !isUuid(templateId)) {
    return NextResponse.json({ ok: false, error: "Invalid templateId" }, { status: 400 });
  }

  const resolved = await resolveNdaForInvestorSigning(admin, {
    pitchId: pitchId || null,
    templateId: templateId || null,
    slug: slug || null,
  });

  if ("error" in resolved) {
    return NextResponse.json({ ok: false, error: resolved.error }, { status: resolved.status });
  }

  const snapshot = resolved.documentSnapshot;

  return NextResponse.json({
    ok: true,
    source: resolved.source,
    signingUrl: resolved.signingUrl,
    agreementVersion: resolved.agreementVersion,
    ndaTemplateId: resolved.ndaTemplateId,
    companyName: resolved.companyName,
    productName: resolved.productName,
    governingState: resolved.governingState,
    presenterName: resolved.presenterName,
    presenterEmail: resolved.presenterEmail,
    consentCheckboxText: CONSENT_CHECKBOX_TEXT,
    templateLabel: resolved.templateLabel,
    template: resolved.template ? serializeNdaTemplate(resolved.template) : null,
    documentSnapshot: snapshot,
    paragraphs: snapshot.split(/\n\n+/).filter(Boolean),
  });
}
