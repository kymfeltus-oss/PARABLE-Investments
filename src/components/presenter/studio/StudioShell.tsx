"use client";

import Link from "next/link";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import {
  DashboardBottomNav,
  DashboardHeader,
  DashboardShell,
  DashboardSidebar,
  type NavItem,
} from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { PresenterStudioHeaderBadge } from "./PresenterStudioWelcome";
import styles from "./studio.module.css";

const STUDIO_NAV: NavItem[] = [
  { href: "/dashboard/presenter", label: "Studio" },
  { href: "/dashboard/presenter/opportunity", label: "Opportunity" },
  { href: "/dashboard/presenter/founder", label: "Founder" },
  { href: "/dashboard/presenter/welcome", label: "Welcome" },
  { href: "/dashboard/presenter/hero", label: "Hero" },
  { href: "/dashboard/presenter/pitch-room", label: "Pitch Room" },
  { href: "/dashboard/presenter/nda", label: "NDA Studio" },
  { href: "/dashboard/presenter/pipeline", label: "Pipeline" },
  { href: "/dashboard/presenter/preview", label: "Preview" },
];

type StudioShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function StudioShell({ title, subtitle, children, actions }: StudioShellProps) {
  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          title="Pitch Builder"
          subtitle="Studio"
          navItems={STUDIO_NAV}
          footer={
            <GlassCard className="!p-5">
              <p className="pl-label !text-xs">Single source of truth</p>
              <p className="mt-2 text-xs pl-muted leading-relaxed">
                Everything you configure here flows to the investor dashboard automatically.
              </p>
              <Link href="/" className="pl-link mt-3 block text-xs">
                ← Intro
              </Link>
            </GlassCard>
          }
        />
      }
      bottomNav={<DashboardBottomNav navItems={STUDIO_NAV} />}
      header={
        <DashboardHeader
          title={title}
          badge={<PresenterStudioHeaderBadge subtitle={subtitle} />}
          actions={actions}
        />
      }
    >
      <div className="pl-mobile-logo-bar lg:hidden">
        <PitchLockLogo size="sm" />
      </div>
      <div className={styles.studio}>
        <div className={styles.studioAmbient} aria-hidden>
          <div className={styles.studioGlowCyan} />
          <div className={styles.studioGlowPurple} />
        </div>
        <div className={styles.studioInner}>{children}</div>
      </div>
    </DashboardShell>
  );
}
