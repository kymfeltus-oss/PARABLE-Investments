/**
 * Central plan permission system for Pitch Lock.
 * Presenters own subscriptions; investor dashboard access derives from the presenter's tier.
 */

export const PLAN_TIERS = [
  "free",
  "founder",
  "pro_founder",
  "deal_room",
  "accelerator",
] as const;

export type PlanTier = (typeof PLAN_TIERS)[number];

export const USER_ROLES = ["investor", "presenter", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type PresenterFeature =
  | "create_pitch"
  | "upload_deck"
  | "invite_investors"
  | "nda_signatures"
  | "pitch_room_management"
  | "pitch_meeting_management"
  | "documents_vault"
  | "investor_questions"
  | "engagement_analytics"
  | "team_members"
  | "hot_investor_scoring"
  | "watermarked_documents"
  | "access_expiration"
  | "revoke_investor_access"
  | "custom_branding"
  | "remove_platform_branding"
  | "cohort_dashboard"
  | "bulk_pitch_rooms";

export type InvestorFeature =
  | "pitch_room"
  | "book_pitch_meeting"
  | "join_pitch_meeting"
  | "documents_vault"
  | "basic_documents"
  | "watermarked_documents"
  | "questions"
  | "investment_interest"
  | "recent_activity"
  | "signed_agreement_access"
  | "custom_branded_experience"
  | "access_expiration"
  | "follow_up_actions"
  | "full_branded_investor_portal";

export type PresenterPlanPermissions = {
  tier: PlanTier;
  label: string;
  suggestedPriceMonthly: number | null;
  maxPitchRooms: number | "unlimited";
  maxInvestorInvitesPerMonth: number | "unlimited";
  features: PresenterFeature[];
};

export type InvestorDashboardPermissions = {
  presenterTier: PlanTier;
  features: InvestorFeature[];
  pitchMeetingLocked: boolean;
  advancedDocumentsLocked: boolean;
  customBrandingLocked: boolean;
};

const PRESENTER_TIER_CONFIG: Record<PlanTier, PresenterPlanPermissions> = {
  free: {
    tier: "free",
    label: "Free",
    suggestedPriceMonthly: null,
    maxPitchRooms: 1,
    maxInvestorInvitesPerMonth: 3,
    features: [
      "create_pitch",
      "upload_deck",
      "invite_investors",
      "nda_signatures",
      "pitch_room_management",
    ],
  },
  founder: {
    tier: "founder",
    label: "Founder",
    suggestedPriceMonthly: 29,
    maxPitchRooms: 3,
    maxInvestorInvitesPerMonth: 25,
    features: [
      "create_pitch",
      "upload_deck",
      "invite_investors",
      "nda_signatures",
      "pitch_room_management",
      "pitch_meeting_management",
      "documents_vault",
      "investor_questions",
      "engagement_analytics",
    ],
  },
  pro_founder: {
    tier: "pro_founder",
    label: "Pro Founder",
    suggestedPriceMonthly: 79,
    maxPitchRooms: 10,
    maxInvestorInvitesPerMonth: "unlimited",
    features: [
      "create_pitch",
      "upload_deck",
      "invite_investors",
      "nda_signatures",
      "pitch_room_management",
      "pitch_meeting_management",
      "documents_vault",
      "investor_questions",
      "engagement_analytics",
      "remove_platform_branding",
    ],
  },
  deal_room: {
    tier: "deal_room",
    label: "Deal Room",
    suggestedPriceMonthly: 199,
    maxPitchRooms: "unlimited",
    maxInvestorInvitesPerMonth: "unlimited",
    features: [
      "create_pitch",
      "upload_deck",
      "invite_investors",
      "nda_signatures",
      "pitch_room_management",
      "pitch_meeting_management",
      "documents_vault",
      "investor_questions",
      "engagement_analytics",
      "team_members",
      "hot_investor_scoring",
      "watermarked_documents",
      "access_expiration",
      "revoke_investor_access",
      "custom_branding",
      "remove_platform_branding",
    ],
  },
  accelerator: {
    tier: "accelerator",
    label: "Accelerator",
    suggestedPriceMonthly: null,
    maxPitchRooms: "unlimited",
    maxInvestorInvitesPerMonth: "unlimited",
    features: [
      "create_pitch",
      "upload_deck",
      "invite_investors",
      "nda_signatures",
      "pitch_room_management",
      "pitch_meeting_management",
      "documents_vault",
      "investor_questions",
      "engagement_analytics",
      "team_members",
      "hot_investor_scoring",
      "watermarked_documents",
      "access_expiration",
      "revoke_investor_access",
      "custom_branding",
      "remove_platform_branding",
      "cohort_dashboard",
      "bulk_pitch_rooms",
    ],
  },
};

const INVESTOR_TIER_FEATURES: Record<PlanTier, InvestorFeature[]> = {
  free: [
    "pitch_room",
    "basic_documents",
    "questions",
    "investment_interest",
    "recent_activity",
  ],
  founder: [
    "pitch_room",
    "book_pitch_meeting",
    "documents_vault",
    "questions",
    "investment_interest",
    "signed_agreement_access",
    "recent_activity",
  ],
  pro_founder: [
    "pitch_room",
    "book_pitch_meeting",
    "join_pitch_meeting",
    "documents_vault",
    "questions",
    "investment_interest",
    "custom_branded_experience",
    "recent_activity",
  ],
  deal_room: [
    "pitch_room",
    "book_pitch_meeting",
    "join_pitch_meeting",
    "documents_vault",
    "watermarked_documents",
    "access_expiration",
    "questions",
    "investment_interest",
    "follow_up_actions",
    "full_branded_investor_portal",
    "recent_activity",
  ],
  accelerator: [
    "pitch_room",
    "book_pitch_meeting",
    "join_pitch_meeting",
    "documents_vault",
    "watermarked_documents",
    "access_expiration",
    "questions",
    "investment_interest",
    "follow_up_actions",
    "full_branded_investor_portal",
    "recent_activity",
  ],
};

function normalizeTier(tier: string): PlanTier {
  if ((PLAN_TIERS as readonly string[]).includes(tier)) {
    return tier as PlanTier;
  }
  return "free";
}

export function getPresenterPlanPermissions(tier: PlanTier | string): PresenterPlanPermissions {
  return PRESENTER_TIER_CONFIG[normalizeTier(tier)];
}

export function getInvestorDashboardPermissionsForPresenterTier(
  tier: PlanTier | string
): InvestorDashboardPermissions {
  const normalized = normalizeTier(tier);
  const features = INVESTOR_TIER_FEATURES[normalized];

  return {
    presenterTier: normalized,
    features,
    pitchMeetingLocked: !features.includes("book_pitch_meeting") && !features.includes("join_pitch_meeting"),
    advancedDocumentsLocked: normalized === "free",
    customBrandingLocked: !features.includes("custom_branded_experience") && !features.includes("full_branded_investor_portal"),
  };
}

export function canPresenterAccessFeature(
  tier: PlanTier | string,
  feature: PresenterFeature
): boolean {
  return getPresenterPlanPermissions(tier).features.includes(feature);
}

export function canInvestorAccessFeatureForPresenterTier(
  tier: PlanTier | string,
  feature: InvestorFeature
): boolean {
  return getInvestorDashboardPermissionsForPresenterTier(tier).features.includes(feature);
}

export function getDashboardRoute(role: UserRole | string): string {
  switch (role) {
    case "investor":
      return "/dashboard/investor";
    case "admin":
      return "/dashboard/presenter";
    case "presenter":
    default:
      return "/dashboard/presenter";
  }
}

export function getTierDisplayName(tier: PlanTier | string): string {
  return getPresenterPlanPermissions(tier).label;
}
