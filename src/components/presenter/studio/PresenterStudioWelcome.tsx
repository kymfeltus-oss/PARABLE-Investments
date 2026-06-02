"use client";

import { useEffect, useState } from "react";
import {
  getPresenterDemoProfile,
  type PresenterDemoProfile,
} from "@/lib/presenter-demo-profile";
import { getPresenterPlanPermissions, type PlanTier } from "@/lib/plan-permissions";

const DEMO_TIER: PlanTier = "free";

export function PresenterStudioWelcome() {
  const [profile, setProfile] = useState<PresenterDemoProfile | null>(null);
  const plan = getPresenterPlanPermissions(DEMO_TIER);

  useEffect(() => {
    setProfile(getPresenterDemoProfile());
  }, []);

  const fullName = profile?.fullName ?? "Presenter";
  const companyName = profile?.companyName ?? null;

  return (
    <div className="mb-2">
      <p className="text-sm pl-text">
        Welcome back, <span className="text-pl-cyan">{fullName}</span>
      </p>
      {companyName ? (
        <p className="mt-0.5 text-sm pl-muted">
          Company: <span className="pl-text-secondary">{companyName}</span>
        </p>
      ) : (
        <p className="mt-0.5 text-sm pl-muted">{plan.label} plan</p>
      )}
      <p className="mt-2 text-xs pl-muted opacity-90">
        Demo mode. Authentication will be connected later.
      </p>
    </div>
  );
}

export function PresenterStudioHeaderBadge({ subtitle }: { subtitle?: string }) {
  const [profile, setProfile] = useState<PresenterDemoProfile | null>(null);
  const plan = getPresenterPlanPermissions(DEMO_TIER);

  useEffect(() => {
    setProfile(getPresenterDemoProfile());
  }, []);

  if (subtitle) {
    return (
      <div>
        <p className="mt-1 text-sm pl-muted">{subtitle}</p>
        <p className="mt-2 text-xs pl-muted opacity-80">Demo mode · {plan.label} plan</p>
      </div>
    );
  }

  const fullName = profile?.fullName ?? "Presenter";
  const companyName = profile?.companyName;

  return (
    <div>
      <p className="mt-1 text-sm pl-text">
        Welcome back, <span className="text-pl-cyan">{fullName}</span>
        {!profile ? (
          <>
            {" "}
            · <span className="pl-muted">{plan.label} plan</span>
          </>
        ) : null}
      </p>
      {companyName ? (
        <p className="mt-0.5 text-sm pl-muted">
          Company: <span className="pl-text-secondary">{companyName}</span>
        </p>
      ) : null}
      <p className="mt-1.5 text-xs pl-muted opacity-90">
        Demo mode. Authentication will be connected later.
      </p>
    </div>
  );
}
