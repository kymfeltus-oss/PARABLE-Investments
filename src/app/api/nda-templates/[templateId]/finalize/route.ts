import { NextResponse } from "next/server";
import {
  fetchNdaTemplateById,
  generatePublicSigningSlug,
  serializeNdaTemplate,
  signingUrlForTemplate,
} from "@/lib/nda-templates";
import { getSiteUrl } from "@/lib/qr-code";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ templateId: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const { templateId } = await ctx.params;
  const existing = await fetchNdaTemplateById(admin, templateId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  const slug = existing.public_signing_slug ?? generatePublicSigningSlug();
  const siteUrl = getSiteUrl();
  const signingUrl = signingUrlForTemplate({ ...existing, public_signing_slug: slug, signing_url: null });

  if (existing.status === "finalized") {
    if (!existing.signing_url) {
      await admin
        .from("nda_templates")
        .update({ signing_url: signingUrl, public_signing_slug: slug })
        .eq("id", templateId);
    }
    return NextResponse.json({
      ok: true,
      templateId: existing.id,
      signingUrl: existing.signing_url ?? signingUrl,
      template: serializeNdaTemplate(existing),
    });
  }

  const finalizedAt = new Date().toISOString();

  const { data, error } = await admin
    .from("nda_templates")
    .update({
      status: "finalized",
      finalized_at: finalizedAt,
      public_signing_slug: slug,
      signing_url: signingUrl,
      updated_at: finalizedAt,
    })
    .eq("id", templateId)
    .eq("status", "draft")
    .select("*")
    .single();

  if (error || !data) {
    console.error("[nda-templates finalize]", error?.message);
    return NextResponse.json({ ok: false, error: "Could not finalize template" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    templateId: data.id,
    signingUrl,
    template: serializeNdaTemplate(data),
  });
}
