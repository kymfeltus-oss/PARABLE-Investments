import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./investor-dashboard.module.css";

export type InvestorDashboardExperienceProps = {
  canBook: boolean;
  canJoin: boolean;
  documentsLocked: boolean;
  questionsLocked: boolean;
  interestLocked: boolean;
};

const PITCH_NAME = "Pitch Lock";
const FOUNDER_NAME = "Kym Feltus";

const ACTIVITY_ITEMS = [
  { label: "Access Verified", tone: "cyan" as const },
  { label: "NDA Signed", tone: "cyan" as const },
  { label: "Documents Available", tone: "muted" as const },
  { label: "PitchMeeting Ready", tone: "purple" as const },
];

function WorkspaceAction({
  href,
  label,
  variant = "primary",
  locked = false,
  className,
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "tile";
  locked?: boolean;
  className?: string;
}) {
  const btnClass =
    variant === "primary"
      ? "pl-btn pl-btn-primary"
      : variant === "secondary"
        ? "pl-btn pl-btn-secondary"
        : "pl-btn pl-btn-primary";

  if (locked) {
    return (
      <span className={cn(btnClass, styles.actionBtn, className)} aria-disabled>
        {label}
      </span>
    );
  }

  return (
    <Link href={href} className={cn(btnClass, styles.actionBtn, className)}>
      {label}
    </Link>
  );
}

function TileIcon({ kind }: { kind: "documents" | "questions" | "interest" }) {
  const common = {
    className: styles.tileIconSvg,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };

  if (kind === "documents") {
    return (
      <svg {...common}>
        <rect x="10" y="8" width="28" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 16h16M16 22h12M16 28h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "questions") {
    return (
      <svg {...common}>
        <path
          d="M14 18a10 10 0 0118.5 3.5A10 10 0 0124 34h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="38" r="2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M12 32l8-14 8 8 8-18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type ExperienceTileProps = {
  kind: "documents" | "questions" | "interest";
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  locked: boolean;
  delayClass?: string;
};

function ExperienceTile({
  kind,
  title,
  description,
  actionLabel,
  href,
  locked,
  delayClass,
}: ExperienceTileProps) {
  return (
    <article
      className={cn(styles.experienceTile, locked && styles.experienceTileLocked, delayClass)}
    >
      <div className={styles.tileIconWrap}>
        <TileIcon kind={kind} />
      </div>
      <h3 className={cn("pl-display", styles.tileTitle)}>{title}</h3>
      <p className={styles.tileDesc}>{description}</p>
      <div className={styles.tileFooter}>
        <WorkspaceAction href={href} label={actionLabel} variant="tile" locked={locked} />
        {locked ? <span className="pl-badge pl-badge-purple">Pro</span> : null}
      </div>
    </article>
  );
}

export function InvestorDashboardExperience({
  canBook,
  canJoin,
  documentsLocked,
  questionsLocked,
  interestLocked,
}: InvestorDashboardExperienceProps) {
  return (
    <div className={styles.workspace}>
      <div className={styles.atmosphere} aria-hidden>
        <div className={styles.glowCyan} />
        <div className={styles.glowPurple} />
        <div className={styles.orbitRing} />
      </div>

      <div className={styles.workspaceInner}>
        {/* Section 1 — Hero */}
        <section className={cn(styles.heroSection, "pl-animate-in")} aria-labelledby="inv-hero-title">
          <p className={cn("pl-label", styles.heroEyebrow)}>Private Investor Access</p>

          <div className={styles.heroMeta}>
            <div className={styles.heroMetaBlock}>
              <span className={cn("pl-label", styles.heroMetaLabel)}>Pitch</span>
              <p id="inv-hero-title" className={styles.pitchName}>
                {PITCH_NAME}
              </p>
            </div>
            <div className={styles.heroMetaBlock}>
              <span className={cn("pl-label", styles.heroMetaLabel)}>Founder</span>
              <p className={styles.founderName}>{FOUNDER_NAME}</p>
            </div>
            <div className={styles.heroMetaBlock}>
              <span className={cn("pl-label", styles.heroMetaLabel)}>Verification</span>
              <p className={styles.verificationStatus}>
                <span className={styles.statusPulse} aria-hidden />
                Verified
              </p>
            </div>
          </div>

          <div className={styles.heroCtaZone}>
            <Link href="/pitch" className={cn("pl-btn pl-btn-primary", styles.heroCta)}>
              Enter Pitch Room
            </Link>
          </div>
        </section>

        {/* Section 2 — PitchMeeting */}
        <section
          className={cn(styles.meetingSection, "pl-animate-in-delay-1")}
          aria-labelledby="inv-meeting-title"
        >
          <div className={styles.meetingGlow} aria-hidden />
          <div className={styles.meetingContent}>
            <div className={styles.meetingCopy}>
              <h2 id="inv-meeting-title" className={cn("pl-display", styles.meetingTitle)}>
                PitchMeeting
              </h2>
              <p className={styles.meetingDesc}>Book private meetings with the founder.</p>
            </div>
            <div className={styles.meetingActions}>
              <WorkspaceAction
                href="/book"
                label="Book Meeting"
                variant="primary"
                locked={!canBook}
                className={styles.meetingBtnPrimary}
              />
              <div className={styles.meetingJoinRow}>
                <WorkspaceAction
                  href="/meet"
                  label="Join Meeting"
                  variant="secondary"
                  locked={!canJoin}
                />
                {!canJoin ? <span className="pl-badge pl-badge-purple">Pro</span> : null}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Experience tiles */}
        <section className={styles.tilesSection} aria-label="Investor modules">
          <ExperienceTile
            kind="documents"
            title="Document Vault"
            description="Review shared materials and supporting files for this opportunity."
            actionLabel="View Documents"
            href="/documents"
            locked={documentsLocked}
            delayClass="pl-animate-in-delay-2"
          />
          <ExperienceTile
            kind="questions"
            title="Questions"
            description="Ask the founder in confidence before or after your review."
            actionLabel="Ask a Question"
            href="/questions"
            locked={questionsLocked}
            delayClass="pl-animate-in-delay-2"
          />
          <ExperienceTile
            kind="interest"
            title="Investment Interest"
            description="Signal interest, request follow-up, or continue your review."
            actionLabel="Update Interest"
            href="/interest"
            locked={interestLocked}
            delayClass="pl-animate-in-delay-3"
          />
        </section>

        {/* Section 4 — Activity strip */}
        <section className={cn(styles.activityStrip, "pl-animate-in-delay-3")} aria-label="Status">
          <ul className={styles.activityPills}>
            {ACTIVITY_ITEMS.map((item) => (
              <li key={item.label}>
                <span
                  className={cn(
                    styles.activityPill,
                    item.tone === "cyan" && styles.activityPillCyan,
                    item.tone === "purple" && styles.activityPillPurple,
                    item.tone === "muted" && styles.activityPillMuted,
                  )}
                >
                  <span className={styles.activityPillDot} aria-hidden />
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
