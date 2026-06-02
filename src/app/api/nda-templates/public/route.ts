import { NextRequest, NextResponse } from "next/server";
import { resolveNdaForInvestorSigning, serializeNdaTemplate } from "@/lib/nda-templates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const templateId = req.nextUrl.searchParams.get("templateId")?.trim();
  const slug = req.nextUrl.searchParams.get("nda")?.trim();

  if (!templateId && !slug) {
    return NextResponse.json(
      { ok: false, error: "templateId or nda slug required" },
      { status: 400 }
    );
  }

  const resolved = await resolveNdaForInvestorSigning(admin, {
    templateId: templateId || null,
    slug: slug || null,
  });

  if ("error" in resolved) {
    return NextResponse.json({ ok: false, error: resolved.error }, { status: resolved.status });
  }

  if (!resolved.template) {
    return NextResponse.json({ ok: false, error: "Finalized NDA template not found" }, { status: 404 });
  }

  const snapshot = resolved.documentSnapshot;

  return NextResponse.json({
    ok: true,
    template: serializeNdaTemplate(resolved.template),
    documentSnapshot: snapshot,
    paragraphs: snapshot.split(/\n\n+/).filter(Boolean),
  });
}
