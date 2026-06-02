"use client";

import { useCallback, useEffect, useState } from "react";
import {
  computeStudioCompletion,
  studioReadyToPublish,
  type StudioCompletion,
} from "@/lib/pitch-builder-studio";
import {
  DEMO_PRESENTER_EMAIL,
  defaultInvestorExperienceProfile,
  type InvestorExperienceProfile,
} from "@/lib/investor-experience";

export function useStudioProfile(presenterEmail: string = DEMO_PRESENTER_EMAIL) {
  const [profile, setProfile] = useState<InvestorExperienceProfile>(
    defaultInvestorExperienceProfile(presenterEmail),
  );
  const [pipelineCount, setPipelineCount] = useState(0);
  const [ndaActive, setNdaActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [profileRes, ndaRes, agreementsRes] = await Promise.all([
      fetch(`/api/investor-experience?presenterEmail=${encodeURIComponent(presenterEmail)}`),
      fetch(`/api/nda-templates?presenterEmail=${encodeURIComponent(presenterEmail)}`),
      fetch(`/api/pitch-access/agreements?presenterEmail=${encodeURIComponent(presenterEmail)}`),
    ]);

    const profileData = (await profileRes.json()) as {
      ok?: boolean;
      profile?: InvestorExperienceProfile;
    };
    if (profileData.ok && profileData.profile) setProfile(profileData.profile);

    const ndaData = (await ndaRes.json()) as {
      templates?: { isActive?: boolean; activeForPresenter?: boolean }[];
    };
    const templates = ndaData.templates ?? [];
    setNdaActive(
      templates.some((t) => t.isActive && t.activeForPresenter) ||
        templates.some((t) => t.isActive),
    );

    const agreementsData = (await agreementsRes.json()) as { agreements?: unknown[] };
    setPipelineCount(agreementsData.agreements?.length ?? 0);
  }, [presenterEmail]);

  useEffect(() => {
    void refresh().finally(() => setLoading(false));
  }, [refresh]);

  const completion: StudioCompletion = computeStudioCompletion(profile, {
    ndaActive,
    pipelineCount,
  });

  const canPublish = studioReadyToPublish(completion);

  const savePartial = useCallback(
    async (patch: Partial<InvestorExperienceProfile>) => {
      setBusy(true);
      setMessage(null);
      setError(null);
      try {
        const res = await fetch("/api/investor-experience", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...patch, presenterEmail }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          error?: string;
          profile?: InvestorExperienceProfile;
        };
        if (!data.ok) {
          setError(data.error ?? "Could not save");
          return false;
        }
        if (data.profile) setProfile(data.profile);
        setMessage("Saved — investors will see this after you publish.");
        return true;
      } finally {
        setBusy(false);
      }
    },
    [presenterEmail],
  );

  const publish = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/investor-experience/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presenterEmail }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        profile?: InvestorExperienceProfile;
      };
      if (!data.ok) {
        setError(data.error ?? "Could not publish");
        return false;
      }
      if (data.profile) setProfile(data.profile);
      setMessage("Published. Your investor experience is live.");
      return true;
    } finally {
      setBusy(false);
    }
  }, [presenterEmail]);

  return {
    profile,
    setProfile,
    pipelineCount,
    ndaActive,
    loading,
    busy,
    message,
    error,
    completion,
    canPublish,
    refresh,
    savePartial,
    publish,
  };
}
