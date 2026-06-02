"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import {
  DashboardBottomNav,
  DashboardHeader,
  DashboardShell,
  DashboardSidebar,
  type NavItem,
} from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  DEMO_PRESENTER_EMAIL,
  type InvestorExperienceProfile,
} from "@/lib/investor-experience";
import styles from "./investor-experience-form.module.css";

const SIDEBAR_NAV: NavItem[] = [
  { href: "/dashboard/presenter", label: "Overview" },
  { href: "/dashboard/presenter/investor-experience", label: "Investor Experience" },
  { href: "/dashboard/presenter/nda", label: "NDA" },
  { href: "/pitch", label: "Pitch Rooms" },
];

type InvestorExperienceFormProps = {
  presenterEmail?: string;
};

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className="pl-input-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? <p className={styles.fieldHint}>{hint}</p> : null}
    </div>
  );
}

export function InvestorExperienceForm({
  presenterEmail = DEMO_PRESENTER_EMAIL,
}: InvestorExperienceFormProps) {
  const [form, setForm] = useState<InvestorExperienceProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/investor-experience?presenterEmail=${encodeURIComponent(presenterEmail)}`,
    );
    const data = (await res.json()) as { ok?: boolean; profile?: InvestorExperienceProfile };
    if (data.ok && data.profile) setForm(data.profile);
  }, [presenterEmail]);

  useEffect(() => {
    void load();
  }, [load]);

  function update<K extends keyof InvestorExperienceProfile>(key: K, value: InvestorExperienceProfile[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/investor-experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, presenterEmail }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; profile?: InvestorExperienceProfile };
      if (!data.ok) {
        setError(data.error ?? "Could not save");
        return;
      }
      if (data.profile) setForm(data.profile);
      setMessage("Investor experience saved. Your investors will see this on their dashboard.");
    } finally {
      setBusy(false);
    }
  }

  if (!form) {
    return (
      <p className="pl-body pl-muted pl-page-container">Loading investor experience…</p>
    );
  }

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          title="Presenter"
          subtitle="Investor Experience"
          navItems={SIDEBAR_NAV}
          footer={
            <Link
              href="/dashboard/presenter"
              className="block text-center text-xs pl-muted pl-hover-text"
            >
              ← Overview
            </Link>
          }
        />
      }
      bottomNav={<DashboardBottomNav navItems={SIDEBAR_NAV} />}
      header={
        <DashboardHeader
          title="Investor Experience"
          badge={
            <p className="mt-1 text-sm pl-muted">
              Personalize what investors see after they sign in
            </p>
          }
        />
      }
    >
      <div className="pl-mobile-logo-bar lg:hidden">
        <PitchLockLogo size="sm" />
      </div>

      <div className="mx-auto max-w-3xl space-y-8 pl-page-container">
        {message ? <p className="text-sm pl-text">{message}</p> : null}
        {error ? <p className="text-sm pl-error">{error}</p> : null}

        <form onSubmit={save} className={styles.form}>
          <GlassCard className={styles.section}>
            <h2 className={styles.sectionTitle}>Business & opportunity</h2>
            <p className={styles.sectionLead}>
              This appears at the top of the investor dashboard — warm, personal, and focused on
              your raise.
            </p>
            <div className={styles.fieldGrid}>
              <Field id="businessName" label="Business name">
                <input
                  id="businessName"
                  className="pl-input w-full"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                />
              </Field>
              <Field id="tagline" label="Tagline">
                <input
                  id="tagline"
                  className="pl-input w-full"
                  value={form.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                />
              </Field>
              <Field id="industry" label="Industry">
                <input
                  id="industry"
                  className="pl-input w-full"
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                />
              </Field>
              <Field id="fundingStage" label="Funding stage">
                <input
                  id="fundingStage"
                  className="pl-input w-full"
                  value={form.fundingStage}
                  onChange={(e) => update("fundingStage", e.target.value)}
                  placeholder="e.g. Seed, Series A"
                />
              </Field>
              <Field id="raiseAmount" label="Raise amount">
                <input
                  id="raiseAmount"
                  className="pl-input w-full"
                  value={form.raiseAmount}
                  onChange={(e) => update("raiseAmount", e.target.value)}
                  placeholder="e.g. $2.5M"
                />
              </Field>
              <Field id="minimumInvestment" label="Minimum investment">
                <input
                  id="minimumInvestment"
                  className="pl-input w-full"
                  value={form.minimumInvestment}
                  onChange={(e) => update("minimumInvestment", e.target.value)}
                  placeholder="e.g. $25,000"
                />
              </Field>
            </div>
          </GlassCard>

          <GlassCard className={styles.section}>
            <h2 className={styles.sectionTitle}>Founder</h2>
            <div className={styles.fieldGrid}>
              <Field id="founderName" label="Founder name">
                <input
                  id="founderName"
                  className="pl-input w-full"
                  value={form.founderName}
                  onChange={(e) => update("founderName", e.target.value)}
                />
              </Field>
              <Field id="founderTitle" label="Founder title">
                <input
                  id="founderTitle"
                  className="pl-input w-full"
                  value={form.founderTitle}
                  onChange={(e) => update("founderTitle", e.target.value)}
                />
              </Field>
              <Field
                id="founderPhotoUrl"
                label="Founder photo"
                hint="HTTPS image URL (square works best)"
              >
                <input
                  id="founderPhotoUrl"
                  className="pl-input w-full"
                  type="url"
                  value={form.founderPhotoUrl ?? ""}
                  onChange={(e) => update("founderPhotoUrl", e.target.value || null)}
                  placeholder="https://…"
                />
              </Field>
              <Field id="founderBio" label="Founder bio" hint="Short paragraph for trust and context">
                <textarea
                  id="founderBio"
                  className="pl-input min-h-[120px] w-full resize-y"
                  value={form.founderBio}
                  onChange={(e) => update("founderBio", e.target.value)}
                />
              </Field>
            </div>
          </GlassCard>

          <GlassCard className={styles.section}>
            <h2 className={styles.sectionTitle}>Welcome & imagery</h2>
            <div className={styles.fieldGrid}>
              <Field id="welcomeMessage" label="Welcome message">
                <textarea
                  id="welcomeMessage"
                  className="pl-input min-h-[140px] w-full resize-y"
                  value={form.welcomeMessage}
                  onChange={(e) => update("welcomeMessage", e.target.value)}
                />
              </Field>
              <Field
                id="heroCoverImageUrl"
                label="Hero cover image"
                hint="HTTPS URL for a soft banner behind the welcome area"
              >
                <input
                  id="heroCoverImageUrl"
                  className="pl-input w-full"
                  type="url"
                  value={form.heroCoverImageUrl ?? ""}
                  onChange={(e) => update("heroCoverImageUrl", e.target.value || null)}
                  placeholder="https://…"
                />
              </Field>
            </div>
          </GlassCard>

          <div className={styles.actions}>
            <button type="submit" className="pl-btn pl-btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save investor experience"}
            </button>
            <Link href="/dashboard/investor" className="pl-btn pl-btn-outline">
              Preview investor view
            </Link>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
