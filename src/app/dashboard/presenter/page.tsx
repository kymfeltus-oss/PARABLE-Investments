import Link from "next/link";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import { NdaModuleSummary } from "@/components/presenter/NdaModuleSummary";
import {
  DashboardBottomNav,
  DashboardHeader,
  DashboardShell,
  DashboardSidebar,
  ModuleCard,
  ModuleCardGrid,
  type NavItem,
} from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  canPresenterAccessFeature,
  getPresenterPlanPermissions,
  type PlanTier,
} from "@/lib/plan-permissions";

const DEMO_TIER: PlanTier = "free";
const plan = getPresenterPlanPermissions(DEMO_TIER);

const SIDEBAR_NAV: NavItem[] = [
  { href: "/dashboard/presenter", label: "Overview" },
  { href: "/dashboard/presenter/nda", label: "NDA" },
  { href: "/pitch", label: "Pitch Rooms" },
  { href: "/book", label: "Meetings" },
  { href: "/documents", label: "Documents" },
  { href: "/pricing", label: "Plans" },
];

export default function PresenterDashboardPage() {
  const tier = plan.tier;

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          title="Presenter"
          subtitle={plan.label}
          navItems={SIDEBAR_NAV.map((item) => ({
            ...item,
            locked:
              (item.href === "/book" &&
                !canPresenterAccessFeature(tier, "pitch_meeting_management")) ||
              (item.href === "/documents" &&
                !canPresenterAccessFeature(tier, "documents_vault")),
          }))}
          footer={
            <GlassCard className="!p-5">
              <p className="pl-label pl-text !text-sm">{plan.label}</p>
              <p className="mt-1 text-xs pl-muted">
                {plan.maxPitchRooms === "unlimited" ? "Unlimited" : plan.maxPitchRooms} pitch room
                {plan.maxPitchRooms === 1 ? "" : "s"}
              </p>
              <Link href="/pricing" className="pl-link mt-3 block text-xs">
                View plans →
              </Link>
            </GlassCard>
          }
        />
      }
      bottomNav={<DashboardBottomNav navItems={SIDEBAR_NAV} />}
      header={
        <DashboardHeader
          title="Presenter"
          badge={
            <p className="mt-1 text-sm pl-muted">
              <span className="text-pl-cyan">{plan.label}</span> plan
            </p>
          }
          actions={
            <Link href="/pricing" className="pl-badge pl-badge-purple">
              Upgrade
            </Link>
          }
        />
      }
    >
      <div className="pl-mobile-logo-bar lg:hidden">
        <PitchLockLogo size="sm" />
      </div>
      <ModuleCardGrid>
        <ModuleCard
          title="Pitch Rooms"
          description="Create a room, upload your deck, and invite investors securely."
          href="/pitch"
        />
        <div className="sm:col-span-2">
          <NdaModuleSummary />
        </div>
        <ModuleCard
          title="Meetings"
          description="Schedule and manage investor PitchMeetings."
          href="/book"
          locked={!canPresenterAccessFeature(tier, "pitch_meeting_management")}
        />
        <ModuleCard
          title="Documents"
          description="Share supplementary materials with controlled access."
          href="/documents"
          locked={!canPresenterAccessFeature(tier, "documents_vault")}
        />
        <ModuleCard
          title="Investor Questions"
          description="Review confidential questions from your investors."
          href="/questions"
          locked={!canPresenterAccessFeature(tier, "investor_questions")}
        />
      </ModuleCardGrid>
    </DashboardShell>
  );
}
