"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { StudioShell } from "../StudioShell";
import { useStudioProfile } from "../useStudioProfile";
import styles from "../studio.module.css";

export function InvestorPreviewModule() {
  const { profile, publish, busy, canPublish } = useStudioProfile();

  return (
    <StudioShell
      title="Investor Experience Preview"
      subtitle="What they see"
      actions={
        <button
          type="button"
          className="pl-btn pl-btn-primary !py-2 !px-4"
          disabled={busy || !canPublish}
          onClick={() => void publish()}
        >
          {profile.isPublished ? "Republish" : "Publish first"}
        </button>
      }
    >
      <p className="max-w-2xl text-sm pl-muted leading-relaxed mb-4">
        Live preview of the investor dashboard. All content comes from your studio modules — investors
        never re-enter this data.
      </p>
      {!profile.isPublished ? (
        <p className={cn(styles.feedBanner, "max-w-2xl")}>
          Draft mode: publish to push Business Name, Founder, Welcome, Hero, NDA version, and Pitch
          Room to investors.
        </p>
      ) : null}
      <div className={styles.previewFrame}>
        <iframe
          title="Investor dashboard preview"
          src="/dashboard/investor?preview=1"
        />
      </div>
      <Link href="/dashboard/investor?preview=1" className="pl-link mt-4 inline-block text-sm" target="_blank">
        Open preview in new tab →
      </Link>
    </StudioShell>
  );
}
