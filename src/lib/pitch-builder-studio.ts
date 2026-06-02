import type { InvestorExperienceProfile } from "@/lib/investor-experience";

export type StudioModuleId =
  | "opportunity"
  | "founder"
  | "welcome"
  | "hero"
  | "pitch-room"
  | "nda"
  | "pitch-meeting"
  | "pipeline"
  | "preview";

export type StudioModule = {
  id: StudioModuleId;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: "cyan" | "purple";
  /** External or legacy route — not under /studio path */
  external?: boolean;
};

export const STUDIO_MODULES: StudioModule[] = [
  {
    id: "opportunity",
    title: "Opportunity Profile",
    subtitle: "Your raise story",
    description: "Business name, tagline, industry, stage, and raise details — what investors see first.",
    href: "/dashboard/presenter/opportunity",
    accent: "cyan",
  },
  {
    id: "founder",
    title: "Founder Profile",
    subtitle: "Trust & presence",
    description: "Name, title, photo, and bio. Human connection before the deck.",
    href: "/dashboard/presenter/founder",
    accent: "purple",
  },
  {
    id: "welcome",
    title: "Welcome Experience",
    subtitle: "Personal greeting",
    description: "The message investors read when they enter their private room.",
    href: "/dashboard/presenter/welcome",
    accent: "cyan",
  },
  {
    id: "hero",
    title: "Hero Cover Builder",
    subtitle: "Visual atmosphere",
    description: "Cover image behind the welcome — premium, warm, on-brand.",
    href: "/dashboard/presenter/hero",
    accent: "purple",
  },
  {
    id: "pitch-room",
    title: "Pitch Room Builder",
    subtitle: "Deck & narrative",
    description: "Upload and shape the protected pitch investors enter after signing.",
    href: "/dashboard/presenter/pitch-room",
    accent: "cyan",
  },
  {
    id: "nda",
    title: "NDA Studio",
    subtitle: "Legal gate",
    description: "Customize, activate, and track Pitch Access Agreements.",
    href: "/dashboard/presenter/nda",
    accent: "purple",
    external: true,
  },
  {
    id: "pitch-meeting",
    title: "PitchMeeting Studio",
    subtitle: "Concierge meetings",
    description: "How investors book and join private conversations with you.",
    href: "/dashboard/presenter/pitch-meeting",
    accent: "cyan",
  },
  {
    id: "pipeline",
    title: "Investor Pipeline",
    subtitle: "Signed & invited",
    description: "Everyone who agreed, verified access, and readiness to meet.",
    href: "/dashboard/presenter/pipeline",
    accent: "purple",
  },
  {
    id: "preview",
    title: "Investor Experience Preview",
    subtitle: "See what they see",
    description: "Live preview of the investor dashboard — no duplicate data entry.",
    href: "/dashboard/presenter/preview",
    accent: "cyan",
  },
];

export type StudioModuleStatus = "empty" | "in-progress" | "ready";

export type StudioCompletion = Record<StudioModuleId, StudioModuleStatus>;

export function computeStudioCompletion(
  profile: InvestorExperienceProfile,
  opts?: { ndaActive?: boolean; pipelineCount?: number },
): StudioCompletion {
  const opportunityReady =
    Boolean(profile.businessName?.trim()) &&
    Boolean(profile.tagline?.trim()) &&
    Boolean(profile.industry?.trim() || profile.fundingStage?.trim());

  const founderReady =
    Boolean(profile.founderName?.trim()) && Boolean(profile.founderTitle?.trim());

  const welcomeReady = Boolean(profile.welcomeMessage?.trim()) && profile.welcomeMessage.length > 40;

  const heroReady = Boolean(profile.heroCoverImageUrl);

  const pitchRoomReady = Boolean(profile.pitchRoomSlug?.trim());

  const ndaReady = Boolean(opts?.ndaActive ?? profile.activeNdaVersion);

  return {
    opportunity: opportunityReady ? "ready" : profile.businessName ? "in-progress" : "empty",
    founder: founderReady ? "ready" : profile.founderName ? "in-progress" : "empty",
    welcome: welcomeReady ? "ready" : profile.welcomeMessage ? "in-progress" : "empty",
    hero: heroReady ? "ready" : "empty",
    "pitch-room": pitchRoomReady ? "ready" : "in-progress",
    nda: ndaReady ? "ready" : "in-progress",
    "pitch-meeting": "in-progress",
    pipeline: (opts?.pipelineCount ?? 0) > 0 ? "ready" : "empty",
    preview: profile.isPublished ? "ready" : "in-progress",
  };
}

export function studioReadyToPublish(completion: StudioCompletion): boolean {
  const required: StudioModuleId[] = ["opportunity", "founder", "welcome", "nda"];
  return required.every((id) => completion[id] === "ready");
}
