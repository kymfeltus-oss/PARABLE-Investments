import { NextResponse } from "next/server";
import { fetchNdaTemplateById } from "@/lib/nda-templates";
import { buildNdaSigningUrl, generateQrCodeDataUrl, getSiteUrl } from "@/lib/qr-code";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ templateId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const { templateId } = await ctx.params;
  const row = await fetchNdaTemplateById(admin, templateId);
  if (!row) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }
  if (row.status !== "finalized") {
    return NextResponse.json(
      { ok: false, error: "Only finalized templates can generate a signing QR code" },
      { status: 409 }
    );
  }

  const signingUrl = buildNdaSigningUrl({
    siteUrl: getSiteUrl(),
    templateId: row.id,
    publicSigningSlug: row.public_signing_slug,
  });

  const qrCodeDataUrl = await generateQrCodeDataUrl(signingUrl);

  return NextResponse.json({
    ok: true,
    templateId: row.id,
    signingUrl,
    qrCodeDataUrl,
  });
}
