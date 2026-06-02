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

const FOUNDER_NAME = "Kym Feltus";

const WELCOME_BADGES = [
  { label: "Verified Access", tone: "cyan" as const },
  { label: "NDA Signed", tone: "cyan" as const },
  { label: "Presenter Available", tone: "purple" as const },
];

const ACTIVITY_ITEMS = [
  { label: "Access confirmed", tone: "cyan" as const },
  { label: "Agreement recorded", tone: "muted" as const },
  { label: "Pitch room available", tone: "cyan" as const },
  { label: "Meeting tools ready", tone: "purple" as const },
];

function LoungeAction({
  href,
  label,
  variant = "primary",
  locked = false,
  className,
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "soft";
  locked?: boolean;
  className?: string;
}) {
  const btnClass =
    variant === "primary"
      ? "pl-btn pl-btn-primary"
      : variant === "secondary"
        ? "pl-btn pl-btn-secondary"
        : cn("pl-btn pl-btn-primary", styles.softBtn);

  if (locked) {
    return (
      <span className={cn(btnClass, styles.loungeBtn, className)} aria-disabled>
        {label}
      </span>
    );
  }

  return (
    <Link href={href} className={cn(btnClass, styles.loungeBtn, className)}>
      {label}
    </Link>
  );
}

function TileIcon({ kind }: { kind: "documents" | "questions" | "interest" }) {
  const common = {
    className: styles.tileIconSvg,
    viewBox: "0 0 56 56",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };

  if (kind === "documents") {
    return (
      <svg {...common}>
        <path
          d="M16 12h24l4 6v26H16V12z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M20 12V8h16v4M22 28h16M22 34h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "questions") {
    return (
      <svg {...common}>
        <path
          d="M18 22a10 10 0 0118.5 3.5A10 10 0 0126 38h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="22" cy="42" r="2.5" fill="currentColor" />
        <path d="M38 18v8M34 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M14 38l10-18 10 10 12-22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="16" r="5" stroke="currentColor" strokeWidth="1.5" />
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
        <LoungeAction href={href} label={actionLabel} variant="soft" locked={locked} />
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
    <div className={styles.lounge}>
      <div className={styles.ambient} aria-hidden>
        <div className={styles.ambientCyan} />
        <div className={styles.ambientPurple} />
        <div className={styles.ambientVeil} />
      </div>

      <div className={styles.loungeInner}>
        {/* 1 — Warm welcome */}
        <section className={cn(styles.welcome, "pl-animate-in")} aria-labelledby="inv-welcome-title">
          <p className={cn("pl-label", styles.welcomeEyebrow)}>Your private space</p>
          <h1 id="inv-welcome-title" className={styles.welcomeTitle}>
            Welcome to your private pitch access
          </h1>
          <p className={styles.welcomeLead}>
            Your secure access is verified. Explore the pitch, meet the presenter, and review the
            opportunity at your pace.
          </p>
          <ul className={styles.welcomeBadges} aria-label="Access status">
            {WELCOME_BADGES.map((badge) => (
              <li key={badge.label}>
                <span
                  className={cn(
                    styles.welcomeBadge,
                    badge.tone === "cyan" && styles.welcomeBadgeCyan,
                    badge.tone === "purple" && styles.welcomeBadgePurple,
                  )}
                >
                  <span className={styles.welcomeBadgeDot} aria-hidden />
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2 — Featured pitch room */}
        <section
          className={cn(styles.featured, "pl-animate-in-delay-1")}
          aria-labelledby="inv-featured-title"
        >
          <div className={styles.featuredGlow} aria-hidden />
          <div className={styles.featuredInner}>
            <p className={cn("pl-label", styles.featuredEyebrow)}>Primary experience</p>
            <h2 id="inv-featured-title" className={cn("pl-display", styles.featuredTitle)}>
              Private Pitch Room
            </h2>
            <dl className={styles.featuredMeta}>
              <div className={styles.featuredMetaItem}>
                <dt className={styles.featuredMetaLabel}>Founder</dt>
                <dd className={styles.featuredMetaValue}>{FOUNDER_NAME}</dd>
              </div>
              <div className={styles.featuredMetaItem}>
                <dt className={styles.featuredMetaLabel}>Status</dt>
                <dd className={styles.featuredMetaValue}>
                  <span className={styles.statusLive} aria-hidden />
                  Access Verified
                </dd>
              </div>
            </dl>
            <Link href="/pitch" className={cn("pl-btn pl-btn-primary", styles.featuredCta)}>
              Enter Pitch Room
            </Link>
          </div>
        </section>

        {/* 3 — PitchMeeting lounge */}
        <section
          className={cn(styles.concierge, "pl-animate-in-delay-2")}
          aria-labelledby="inv-concierge-title"
        >
          <div className={styles.conciergeAura} aria-hidden />
          <div className={styles.conciergeInner}>
            <div className={styles.conciergeCopy}>
              <p className={cn("pl-label", styles.conciergeEyebrow)}>Concierge</p>
              <h2 id="inv-concierge-title" className={cn("pl-display", styles.conciergeTitle)}>
                PitchMeeting Lounge
              </h2>
              <p className={styles.conciergeLead}>
                Book a private conversation or join your scheduled meeting with the presenter.
              </p>
            </div>
            <div className={styles.conciergeActions}>
              <LoungeAction
                href="/book"
                label="Book PitchMeeting"
                variant="primary"
                locked={!canBook}
                className={styles.conciergeBtnPrimary}
              />
              <div className={styles.conciergeJoinWrap}>
                <LoungeAction
                  href="/meet"
                  label="Join PitchMeeting"
                  variant="secondary"
                  locked={!canJoin}
                />
                {!canJoin ? <span className="pl-badge pl-badge-purple">Pro</span> : null}
              </div>
            </div>
          </div>
        </section>

        {/* 4 — Supporting modules */}
        <section className={styles.modules} aria-label="Explore at your pace">
          <p className={cn("pl-label", styles.modulesEyebrow)}>At your pace</p>
          <div className={styles.modulesGrid}>
            <ExperienceTile
              kind="documents"
              title="Documents Vault"
              description="Everything shared with you, gathered in one calm place."
              actionLabel="Open Vault"
              href="/documents"
              locked={documentsLocked}
              delayClass="pl-animate-in-delay-2"
            />
            <ExperienceTile
              kind="questions"
              title="Questions"
              description="Ask what matters — privately, directly, on your timeline."
              actionLabel="Ask a Question"
              href="/questions"
              locked={questionsLocked}
              delayClass="pl-animate-in-delay-2"
            />
            <ExperienceTile
              kind="interest"
              title="Investment Interest"
              description="Share your level of interest when you are ready."
              actionLabel="Express Interest"
              href="/interest"
              locked={interestLocked}
              delayClass="pl-animate-in-delay-3"
            />
          </div>
        </section>

        {/* 5 — Recent activity */}
        <section className={cn(styles.activity, "pl-animate-in-delay-3")} aria-label="Recent activity">
          <p className={styles.activityLabel}>Recent activity</p>
          <ul className={styles.activityList}>
            {ACTIVITY_ITEMS.map((item) => (
              <li key={item.label}>
                <span
                  className={cn(
                    styles.activityItem,
                    item.tone === "cyan" && styles.activityItemCyan,
                    item.tone === "purple" && styles.activityItemPurple,
                    item.tone === "muted" && styles.activityItemMuted,
                  )}
                >
                  <span className={styles.activityDot} aria-hidden />
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
