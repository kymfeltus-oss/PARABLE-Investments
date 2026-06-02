import { NextRequest, NextResponse } from "next/server";
import {
  defaultInvestorExperienceProfile,
  profileToDbRow,
  serializeInvestorExperienceProfile,
} from "@/lib/investor-experience";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

  const presenterEmail =
    typeof body.presenterEmail === "string" ? body.presenterEmail.trim().toLowerCase() : "";
  if (!presenterEmail) {
    return NextResponse.json({ ok: false, error: "presenterEmail required" }, { status: 400 });
  }

  const { data: existing } = await admin
    .from("investor_experience_profiles")
    .select("*")
    .ilike("presenter_email", presenterEmail)
    .maybeSingle();

  const profile = existing
    ? serializeInvestorExperienceProfile(existing)
    : defaultInvestorExperienceProfile(presenterEmail);

  const { data: ndaTemplates } = await admin
    .from("nda_templates")
    .select("agreement_version, is_active, active_for_presenter")
    .ilike("presenter_email", presenterEmail)
    .order("updated_at", { ascending: false });

  const activeNda = (ndaTemplates ?? []).find((t) => t.is_active && t.active_for_presenter);
  const ndaVersion =
    (activeNda?.agreement_version as string | undefined) ??
    profile.activeNdaVersion ??
    "2026-05-pitchlock-access-standard-v1";

  const now = new Date().toISOString();
  const publishRow = {
    ...profileToDbRow(profile),
    is_published: true,
    published_at: now,
    active_nda_version: ndaVersion,
    updated_at: now,
  };

  if (existing?.id) {
    const { data, error } = await admin
      .from("investor_experience_profiles")
      .update(publishRow)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      console.error("[investor-experience/publish]", error.message);
      return NextResponse.json({ ok: false, error: "Could not publish" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      profile: serializeInvestorExperienceProfile(data),
      publishedAt: now,
    });
  }

  const { data, error } = await admin.from("investor_experience_profiles").insert(publishRow).select("*").single();

  if (error) {
    console.error("[investor-experience/publish insert]", error.message);
    return NextResponse.json({ ok: false, error: "Could not publish" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    profile: serializeInvestorExperienceProfile(data),
    publishedAt: now,
  });
}
