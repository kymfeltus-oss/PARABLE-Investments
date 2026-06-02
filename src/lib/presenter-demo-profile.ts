/** Demo presenter session — local only until Supabase Auth ships */

export const PITCHLOCK_PRESENTER_DEMO_PROFILE_KEY = "pitchlock_presenter_demo_profile";

export type PresenterDemoProfile = {
  fullName: string;
  email: string;
  companyName: string;
  createdAt: string;
};

export const PRESENTER_ACCESS_ROUTE = "/presenter/access";
export const PRESENTER_STUDIO_ROUTE = "/dashboard/presenter";

export const CONTINUE_WITHOUT_LOGIN_PROFILE: PresenterDemoProfile = {
  fullName: "Presenter",
  email: "demo@pitchlock.local",
  companyName: "Untitled Pitch",
  createdAt: new Date().toISOString(),
};

export function getPresenterDemoProfile(): PresenterDemoProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PITCHLOCK_PRESENTER_DEMO_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PresenterDemoProfile;
    if (!parsed.fullName || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setPresenterDemoProfile(profile: PresenterDemoProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PITCHLOCK_PRESENTER_DEMO_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore quota / private mode */
  }
}

export function savePresenterDemoProfile(input: {
  fullName: string;
  email: string;
  companyName: string;
}): PresenterDemoProfile {
  const profile: PresenterDemoProfile = {
    fullName: input.fullName.trim().slice(0, 200) || "Presenter",
    email: input.email.trim().toLowerCase().slice(0, 320) || "demo@pitchlock.local",
    companyName: input.companyName.trim().slice(0, 200) || "Untitled Pitch",
    createdAt: new Date().toISOString(),
  };
  setPresenterDemoProfile(profile);
  return profile;
}

export function getPresenterDisplayDefaults(): { fullName: string; planLabel: string } {
  const profile = getPresenterDemoProfile();
  return {
    fullName: profile?.fullName ?? "Presenter",
    planLabel: "Free plan",
  };
}
