/** Demo presenter linked to seed pitch — until auth maps sessions */
export const DEMO_PRESENTER_EMAIL = "founder@pitchlock.test";

export type InvestorExperienceProfile = {
  id?: string;
  presenterEmail: string;
  businessName: string;
  tagline: string;
  industry: string;
  fundingStage: string;
  raiseAmount: string;
  minimumInvestment: string;
  founderName: string;
  founderTitle: string;
  founderPhotoUrl: string | null;
  founderBio: string;
  welcomeMessage: string;
  heroCoverImageUrl: string | null;
  pitchRoomSlug: string;
  isPublished: boolean;
  publishedAt: string | null;
  activeNdaVersion: string | null;
  updatedAt?: string;
};

export type InvestorExperienceInput = Partial<
  Omit<InvestorExperienceProfile, "id" | "presenterEmail" | "updatedAt">
> & {
  presenterEmail?: string;
};

const MAX = {
  businessName: 200,
  tagline: 320,
  industry: 120,
  fundingStage: 80,
  raiseAmount: 80,
  minimumInvestment: 80,
  founderName: 120,
  founderTitle: 120,
  founderPhotoUrl: 2048,
  founderBio: 2000,
  welcomeMessage: 2000,
  heroCoverImageUrl: 2048,
  pitchRoomSlug: 64,
} as const;

function trim(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function trimUrl(v: unknown, max: number): string | null {
  const s = trim(v, max);
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) return null;
  return s;
}

export function defaultInvestorExperienceProfile(
  presenterEmail: string = DEMO_PRESENTER_EMAIL,
): InvestorExperienceProfile {
  return {
    presenterEmail,
    businessName: "Pitch Lock",
    tagline: "Pitch. Protect. Progress.",
    industry: "",
    fundingStage: "",
    raiseAmount: "",
    minimumInvestment: "",
    founderName: "",
    founderTitle: "",
    founderPhotoUrl: null,
    founderBio: "",
    welcomeMessage:
      "Your secure access is verified. Explore the pitch, meet the founder, and review the opportunity at your pace.",
    heroCoverImageUrl: null,
    pitchRoomSlug: "demo",
    isPublished: false,
    publishedAt: null,
    activeNdaVersion: null,
  };
}

/** Merge partial API body onto an existing profile (studio modules save independently). */
export function mergeInvestorExperienceProfile(
  existing: InvestorExperienceProfile,
  body: Record<string, unknown>,
): InvestorExperienceProfile {
  const pick = <K extends keyof InvestorExperienceProfile>(
    key: K,
    fn: (v: unknown) => InvestorExperienceProfile[K],
  ): InvestorExperienceProfile[K] =>
    key in body ? fn(body[key]) : existing[key];

  return {
    ...existing,
    businessName: pick("businessName", (v) => trim(v, MAX.businessName)),
    tagline: pick("tagline", (v) => trim(v, MAX.tagline)),
    industry: pick("industry", (v) => trim(v, MAX.industry)),
    fundingStage: pick("fundingStage", (v) => trim(v, MAX.fundingStage)),
    raiseAmount: pick("raiseAmount", (v) => trim(v, MAX.raiseAmount)),
    minimumInvestment: pick("minimumInvestment", (v) => trim(v, MAX.minimumInvestment)),
    founderName: pick("founderName", (v) => trim(v, MAX.founderName)),
    founderTitle: pick("founderTitle", (v) => trim(v, MAX.founderTitle)),
    founderPhotoUrl: pick("founderPhotoUrl", (v) =>
      v === null ? null : trimUrl(v, MAX.founderPhotoUrl),
    ),
    founderBio: pick("founderBio", (v) => trim(v, MAX.founderBio)),
    welcomeMessage: pick("welcomeMessage", (v) => trim(v, MAX.welcomeMessage)),
    heroCoverImageUrl: pick("heroCoverImageUrl", (v) =>
      v === null ? null : trimUrl(v, MAX.heroCoverImageUrl),
    ),
    pitchRoomSlug: pick("pitchRoomSlug", (v) => trim(v, MAX.pitchRoomSlug) || "demo"),
  };
}

export function normalizeInvestorExperienceInput(
  body: Record<string, unknown>,
  presenterEmail: string,
  base?: InvestorExperienceProfile,
): InvestorExperienceProfile {
  const seed = base ?? defaultInvestorExperienceProfile(presenterEmail);
  return mergeInvestorExperienceProfile(seed, {
    businessName: body.businessName,
    tagline: body.tagline,
    industry: body.industry,
    fundingStage: body.fundingStage,
    raiseAmount: body.raiseAmount,
    minimumInvestment: body.minimumInvestment,
    founderName: body.founderName,
    founderTitle: body.founderTitle,
    founderPhotoUrl: body.founderPhotoUrl,
    founderBio: body.founderBio,
    welcomeMessage: body.welcomeMessage,
    heroCoverImageUrl: body.heroCoverImageUrl,
    pitchRoomSlug: body.pitchRoomSlug,
  });
}

type DbRow = {
  id: string;
  presenter_email: string;
  business_name: string | null;
  tagline: string | null;
  industry: string | null;
  funding_stage: string | null;
  raise_amount: string | null;
  minimum_investment: string | null;
  founder_name: string | null;
  founder_title: string | null;
  founder_photo_url: string | null;
  founder_bio: string | null;
  welcome_message: string | null;
  hero_cover_image_url: string | null;
  pitch_room_slug?: string | null;
  is_published?: boolean;
  published_at?: string | null;
  active_nda_version?: string | null;
  updated_at: string;
};

export function serializeInvestorExperienceProfile(row: DbRow): InvestorExperienceProfile {
  const base = defaultInvestorExperienceProfile(row.presenter_email);
  return {
    id: row.id,
    presenterEmail: row.presenter_email,
    businessName: row.business_name?.trim() || base.businessName,
    tagline: row.tagline?.trim() || base.tagline,
    industry: row.industry?.trim() || "",
    fundingStage: row.funding_stage?.trim() || "",
    raiseAmount: row.raise_amount?.trim() || "",
    minimumInvestment: row.minimum_investment?.trim() || "",
    founderName: row.founder_name?.trim() || "",
    founderTitle: row.founder_title?.trim() || "",
    founderPhotoUrl: row.founder_photo_url?.trim() || null,
    founderBio: row.founder_bio?.trim() || "",
    welcomeMessage: row.welcome_message?.trim() || base.welcomeMessage,
    heroCoverImageUrl: row.hero_cover_image_url?.trim() || null,
    pitchRoomSlug: row.pitch_room_slug?.trim() || "demo",
    isPublished: Boolean(row.is_published),
    publishedAt: row.published_at ?? null,
    activeNdaVersion: row.active_nda_version?.trim() || null,
    updatedAt: row.updated_at,
  };
}

/** Investor-facing view — only published fields; never exposes draft state beyond flags */
export function toPublishedInvestorProfile(
  profile: InvestorExperienceProfile,
): InvestorExperienceProfile | null {
  if (!profile.isPublished) return null;
  return profile;
}

export function profileToDbRow(profile: InvestorExperienceProfile): Record<string, unknown> {
  return {
    presenter_email: profile.presenterEmail,
    business_name: profile.businessName || null,
    tagline: profile.tagline || null,
    industry: profile.industry || null,
    funding_stage: profile.fundingStage || null,
    raise_amount: profile.raiseAmount || null,
    minimum_investment: profile.minimumInvestment || null,
    founder_name: profile.founderName || null,
    founder_title: profile.founderTitle || null,
    founder_photo_url: profile.founderPhotoUrl,
    founder_bio: profile.founderBio || null,
    welcome_message: profile.welcomeMessage || null,
    hero_cover_image_url: profile.heroCoverImageUrl,
    pitch_room_slug: profile.pitchRoomSlug || "demo",
    updated_at: new Date().toISOString(),
  };
}

export function hasOpportunitySnapshot(profile: InvestorExperienceProfile): boolean {
  return Boolean(
    profile.industry ||
      profile.fundingStage ||
      profile.raiseAmount ||
      profile.minimumInvestment,
  );
}
