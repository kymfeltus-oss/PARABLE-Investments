"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InvestorDashboardExperience } from "@/components/dashboard/InvestorDashboardExperience";
import {
  DEMO_PRESENTER_EMAIL,
  defaultInvestorExperienceProfile,
  type InvestorExperienceProfile,
} from "@/lib/investor-experience";
import { getInvestorSessionName } from "@/lib/pitch-access-storage";

export type InvestorDashboardLoaderProps = {
  presenterEmail?: string;
  canBook: boolean;
  canJoin: boolean;
  documentsLocked: boolean;
  questionsLocked: boolean;
  interestLocked: boolean;
};

export function InvestorDashboardLoader({
  presenterEmail = DEMO_PRESENTER_EMAIL,
  canBook,
  canJoin,
  documentsLocked,
  questionsLocked,
  interestLocked,
}: InvestorDashboardLoaderProps) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";

  const [profile, setProfile] = useState<InvestorExperienceProfile>(
    defaultInvestorExperienceProfile(presenterEmail),
  );
  const [investorName, setInvestorName] = useState("Investor");
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    setInvestorName(getInvestorSessionName() ?? "Investor");

    const audience = isPreview ? "presenter" : "investor";
    void fetch(
      `/api/investor-experience?presenterEmail=${encodeURIComponent(presenterEmail)}&audience=${audience}`,
    )
      .then((res) => res.json())
      .then(
        (data: {
          ok?: boolean;
          profile?: InvestorExperienceProfile | null;
          published?: boolean;
        }) => {
          if (data.ok && data.profile) {
            setProfile(data.profile);
            setPublished(Boolean(data.published ?? data.profile.isPublished));
          } else {
            setProfile(defaultInvestorExperienceProfile(presenterEmail));
            setPublished(false);
          }
        },
      )
      .finally(() => setLoading(false));
  }, [presenterEmail, isPreview]);

  return (
    <InvestorDashboardExperience
      profile={profile}
      investorName={investorName}
      loading={loading}
      isPreview={isPreview}
      experienceLive={published || isPreview}
      canBook={canBook}
      canJoin={canJoin}
      documentsLocked={documentsLocked}
      questionsLocked={questionsLocked}
      interestLocked={interestLocked}
    />
  );
}
