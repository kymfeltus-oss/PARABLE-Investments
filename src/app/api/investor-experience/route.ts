import { NextRequest, NextResponse } from "next/server";
import {
  defaultInvestorExperienceProfile,
  mergeInvestorExperienceProfile,
  profileToDbRow,
  serializeInvestorExperienceProfile,
  toPublishedInvestorProfile,
} from "@/lib/investor-experience";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function presenterEmailFromReq(req: NextRequest, body?: Record<string, unknown>): string | null {
  const fromQuery = req.nextUrl.searchParams.get("presenterEmail")?.trim().toLowerCase();
  if (fromQuery) return fromQuery;
  const fromBody =
    typeof body?.presenterEmail === "string" ? body.presenterEmail.trim().toLowerCase() : "";
  return fromBody || null;
}

export async function GET(req: NextRequest) {
  const presenterEmail = presenterEmailFromReq(req);
  if (!presenterEmail) {
    return NextResponse.json({ ok: false, error: "presenterEmail required" }, { status: 400 });
  }

  const audience = req.nextUrl.searchParams.get("audience") ?? "presenter";
  const isInvestorAudience = audience === "investor";

  const admin = getSupabaseAdmin();
  if (!admin) {
    const profile = defaultInvestorExperienceProfile(presenterEmail);
    return NextResponse.json({
      ok: true,
      profile: isInvestorAudience ? toPublishedInvestorProfile(profile) : profile,
      source: "default",
      published: false,
    });
  }

  const { data, error } = await admin
    .from("investor_experience_profiles")
    .select("*")
    .ilike("presenter_email", presenterEmail)
    .maybeSingle();

  if (error) {
    console.error("[investor-experience GET]", error.message);
    return NextResponse.json({ ok: false, error: "Could not load profile" }, { status: 500 });
  }

  if (!data) {
    const profile = defaultInvestorExperienceProfile(presenterEmail);
    return NextResponse.json({
      ok: true,
      profile: isInvestorAudience ? null : profile,
      source: "default",
      published: false,
    });
  }

  const profile = serializeInvestorExperienceProfile(data);

  if (isInvestorAudience) {
    const published = toPublishedInvestorProfile(profile);
    return NextResponse.json({
      ok: true,
      profile: published,
      source: "database",
      published: Boolean(published),
    });
  }

  return NextResponse.json({
    ok: true,
    profile,
    source: "database",
    published: profile.isPublished,
  });
}

export async function PUT(req: NextRequest) {
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

  const presenterEmail = presenterEmailFromReq(req, body);
  if (!presenterEmail) {
    return NextResponse.json({ ok: false, error: "presenterEmail required" }, { status: 400 });
  }

  const { data: existing } = await admin
    .from("investor_experience_profiles")
    .select("*")
    .ilike("presenter_email", presenterEmail)
    .maybeSingle();

  const base = existing
    ? serializeInvestorExperienceProfile(existing)
    : defaultInvestorExperienceProfile(presenterEmail);

  const profile = mergeInvestorExperienceProfile(base, body);
  const row = profileToDbRow(profile);

  if (existing?.id) {
    const { data, error } = await admin
      .from("investor_experience_profiles")
      .update(row)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      console.error("[investor-experience PUT update]", error.message);
      return NextResponse.json({ ok: false, error: "Could not save profile" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      profile: serializeInvestorExperienceProfile(data),
    });
  }

  const { data, error } = await admin
    .from("investor_experience_profiles")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    console.error("[investor-experience PUT insert]", error.message);
    return NextResponse.json({ ok: false, error: "Could not save profile" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    profile: serializeInvestorExperienceProfile(data),
  });
}
