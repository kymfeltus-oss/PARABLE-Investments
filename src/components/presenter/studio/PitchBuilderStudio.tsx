"use client";

import Link from "next/link";
import {
  STUDIO_MODULES,
  type StudioModuleStatus,
} from "@/lib/pitch-builder-studio";
import { cn } from "@/lib/utils";
import { PresenterStudioWelcome } from "./PresenterStudioWelcome";
import { StudioShell } from "./StudioShell";
import { useStudioProfile } from "./useStudioProfile";
import styles from "./studio.module.css";

function statusLabel(status: StudioModuleStatus): string {
  if (status === "ready") return "Ready";
  if (status === "in-progress") return "In progress";
  return "Start";
}

export function PitchBuilderStudio() {
  const {
    profile,
    loading,
    busy,
    message,
    error,
    completion,
    canPublish,
    publish,
  } = useStudioProfile();

  return (
    <StudioShell
      title="Pitch Builder Studio"
      actions={
        <Link href="/dashboard/presenter/preview" className="pl-btn pl-btn-outline !py-2 !px-4">
          Preview
        </Link>
      }
    >
      <header className={styles.studioHero}>
        <PresenterStudioWelcome />
        <p className="pl-label">Creative workspace</p>
        <h1 className={styles.studioHeroTitle}>Build your investor experience</h1>
        <p className={styles.studioHeroLead}>
          Configure once here — business story, founder, welcome, hero, pitch room, NDA, and
          meetings. When you publish, investors receive everything automatically. No duplicate
          data entry.
        </p>

        <div className={styles.publishBar}>
          <p className={styles.publishStatus}>
            {profile.isPublished ? (
              <>
                <strong>Live</strong> — published{" "}
                {profile.publishedAt
                  ? new Date(profile.publishedAt).toLocaleDateString()
                  : "recently"}
                . NDA v{profile.activeNdaVersion ?? "—"}
              </>
            ) : (
              <>
                <strong>Draft</strong> — complete your modules, then publish to unlock the
                investor dashboard.
              </>
            )}
          </p>
          <button
            type="button"
            className="pl-btn pl-btn-primary"
            disabled={busy || loading || (!canPublish && !profile.isPublished)}
            onClick={() => void publish()}
          >
            {profile.isPublished ? "Republish" : "Publish pitch"}
          </button>
        </div>
        {message ? <p className={cn(styles.feedBanner, "mt-4")}>{message}</p> : null}
        {error ? (
          <p className={cn(styles.feedBanner, styles.feedBannerError, "mt-4")}>{error}</p>
        ) : null}
      </header>

      <div className={styles.moduleGrid}>
        {STUDIO_MODULES.map((mod) => {
          const status = completion[mod.id];
          return (
            <Link
              key={mod.id}
              href={mod.href}
              className={cn(
                styles.moduleCard,
                mod.accent === "cyan" ? styles.moduleCardCyan : styles.moduleCardPurple,
              )}
            >
              <div className={styles.moduleCardTop}>
                <div>
                  <p className={styles.moduleSubtitle}>{mod.subtitle}</p>
                  <h2 className={styles.moduleTitle}>{mod.title}</h2>
                </div>
                <span
                  className={cn(
                    styles.moduleStatus,
                    status === "ready" && styles.statusReady,
                    status === "in-progress" && styles.statusProgress,
                    status === "empty" && styles.statusEmpty,
                  )}
                >
                  {statusLabel(status)}
                </span>
              </div>
              <p className={styles.moduleDesc}>{mod.description}</p>
              <span className={styles.moduleArrow}>Open module →</span>
            </Link>
          );
        })}
      </div>
    </StudioShell>
  );
}
