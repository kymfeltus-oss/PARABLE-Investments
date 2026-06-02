import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  hasOpportunitySnapshot,
  type InvestorExperienceProfile,
} from "@/lib/investor-experience";
import styles from "./investor-dashboard.module.css";

export type InvestorDashboardExperienceProps = {
  profile: InvestorExperienceProfile;
  investorName: string;
  loading?: boolean;
  isPreview?: boolean;
  experienceLive?: boolean;
  canBook: boolean;
  canJoin: boolean;
  documentsLocked: boolean;
  questionsLocked: boolean;
  interestLocked: boolean;
};

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

function ExperienceTile({
  kind,
  title,
  description,
  actionLabel,
  href,
  locked,
  delayClass,
}: {
  kind: "documents" | "questions" | "interest";
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  locked: boolean;
  delayClass?: string;
}) {
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

function FounderPhoto({ url, name }: { url: string | null; name: string }) {
  if (!url) return null;
  return (
    <div className={styles.founderPhotoWrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={name ? `${name}, founder` : "Founder"}
        className={styles.founderPhoto}
        width={96}
        height={96}
      />
    </div>
  );
}

export function InvestorDashboardExperience({
  profile,
  investorName,
  loading = false,
  isPreview = false,
  experienceLive = true,
  canBook,
  canJoin,
  documentsLocked,
  questionsLocked,
  interestLocked,
}: InvestorDashboardExperienceProps) {
  const firstName = investorName.trim().split(/\s+/)[0] || "Investor";
  const showSnapshot = hasOpportunitySnapshot(profile);
  const founderLine = [profile.founderName, profile.founderTitle].filter(Boolean).join(" · ");
  const showActions = experienceLive;

  return (
    <div className={styles.lounge}>
      <div className={styles.ambient} aria-hidden>
        <div className={styles.ambientCyan} />
        <div className={styles.ambientPurple} />
        <div className={styles.ambientVeil} />
      </div>

      <div className={styles.loungeInner}>
        {/* Personalized welcome — replaces generic header */}
        <section
          className={cn(styles.profileWelcome, loading && styles.profileLoading, "pl-animate-in")}
          aria-labelledby="inv-profile-welcome"
        >
          {profile.heroCoverImageUrl ? (
            <div
              className={styles.profileHeroBg}
              style={{ backgroundImage: `url(${profile.heroCoverImageUrl})` }}
              aria-hidden
            />
          ) : null}
          <div className={styles.profileHeroVeil} aria-hidden />

          <div className={styles.profileBody}>
            <p className={cn("pl-label", styles.profileEyebrow)}>Private investor access</p>
            <h1 id="inv-profile-welcome" className={styles.profileGreeting}>
              Welcome, {firstName}
            </h1>

            <p className={styles.profileGranted}>Private access has been granted to</p>
            <p className={styles.profileBusiness}>{profile.businessName}</p>
            {profile.tagline ? <p className={styles.profileTagline}>{profile.tagline}</p> : null}

            {(profile.founderName || profile.founderTitle || profile.founderPhotoUrl) && (
              <div className={styles.founderBlock}>
                <p className={styles.profilePresented}>Presented by</p>
                <div className={styles.founderRow}>
                  <FounderPhoto url={profile.founderPhotoUrl} name={profile.founderName} />
                  <div>
                    {profile.founderName ? (
                      <p className={styles.founderName}>{profile.founderName}</p>
                    ) : null}
                    {profile.founderTitle ? (
                      <p className={styles.founderTitle}>{profile.founderTitle}</p>
                    ) : null}
                  </div>
                </div>
                {profile.founderBio ? (
                  <p className={styles.founderBio}>{profile.founderBio}</p>
                ) : null}
              </div>
            )}

            {profile.welcomeMessage ? (
              <blockquote className={styles.profileMessage}>{profile.welcomeMessage}</blockquote>
            ) : null}

            {showSnapshot ? (
              <div className={styles.snapshot} aria-label="Opportunity snapshot">
                <p className={cn("pl-label", styles.snapshotLabel)}>Opportunity snapshot</p>
                <dl className={styles.snapshotGrid}>
                  {profile.industry ? (
                    <div className={styles.snapshotItem}>
                      <dt>Industry</dt>
                      <dd>{profile.industry}</dd>
                    </div>
                  ) : null}
                  {profile.fundingStage ? (
                    <div className={styles.snapshotItem}>
                      <dt>Stage</dt>
                      <dd>{profile.fundingStage}</dd>
                    </div>
                  ) : null}
                  {profile.raiseAmount ? (
                    <div className={styles.snapshotItem}>
                      <dt>Raise</dt>
                      <dd>{profile.raiseAmount}</dd>
                    </div>
                  ) : null}
                  {profile.minimumInvestment ? (
                    <div className={styles.snapshotItem}>
                      <dt>Minimum</dt>
                      <dd>{profile.minimumInvestment}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}

            <ul className={styles.accessPills} aria-label="Access status">
              <li>
                <span className={cn(styles.accessPill, styles.accessPillCyan)}>
                  <span className={styles.accessPillDot} aria-hidden />
                  Verified access
                </span>
              </li>
              <li>
                <span className={cn(styles.accessPill, styles.accessPillCyan)}>
                  <span className={styles.accessPillDot} aria-hidden />
                  NDA signed
                </span>
              </li>
              {founderLine ? (
                <li>
                  <span className={cn(styles.accessPill, styles.accessPillPurple)}>
                    <span className={styles.accessPillDot} aria-hidden />
                    {founderLine}
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        {!experienceLive && !loading ? (
          <p className={styles.unpublishedNotice}>
            Your presenter is preparing your private experience. Check back after they publish
            their pitch.
          </p>
        ) : null}

        {isPreview ? (
          <p className={styles.previewBanner}>Studio preview — this is what investors see after publish.</p>
        ) : null}

        {/* Actions — only after opportunity context */}
        {showActions ? (
        <div className={styles.actionsRegion}>
          <p className={cn("pl-label", styles.actionsDivider)}>Explore your private room</p>

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
              <p className={styles.featuredSub}>
                Step into the deck and narrative curated for you by {profile.founderName || "the founder"}.
              </p>
              <Link href="/pitch" className={cn("pl-btn pl-btn-primary", styles.featuredCta)}>
                Enter Pitch Room
              </Link>
            </div>
          </section>

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
                  Book a private conversation or join your scheduled meeting with{" "}
                  {profile.founderName || "the presenter"}.
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
        ) : null}
      </div>
    </div>
  );
}
