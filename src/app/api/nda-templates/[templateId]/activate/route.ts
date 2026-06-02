import { NextResponse } from "next/server";
import {
  activateNdaTemplate,
  fetchNdaTemplateById,
  serializeNdaTemplate,
  signingUrlForTemplate,
} from "@/lib/nda-templates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ templateId: string }> };

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function POST(req: Request, ctx: Ctx) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 503 });
  }

  const { templateId } = await ctx.params;
  const existing = await fetchNdaTemplateById(admin, templateId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }
  if (existing.status !== "finalized") {
    return NextResponse.json(
      { ok: false, error: "Finalize the NDA before setting it as active" },
      { status: 400 }
    );
  }

  let pitchId: string | null = null;
  try {
    const body = (await req.json()) as { pitchId?: string };
    pitchId = body.pitchId?.trim() || null;
  } catch {
    pitchId = null;
  }

  if (pitchId && !isUuid(pitchId)) {
    return NextResponse.json({ ok: false, error: "Invalid pitchId" }, { status: 400 });
  }

  try {
    const activated = await activateNdaTemplate(admin, templateId, { pitchId });
    const signingUrl = signingUrlForTemplate(activated);

    return NextResponse.json({
      ok: true,
      templateId: activated.id,
      signingUrl,
      template: serializeNdaTemplate(activated),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not activate template";
    console.error("[nda-templates activate]", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
