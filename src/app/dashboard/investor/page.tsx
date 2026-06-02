import Link from "next/link";
import { Suspense } from "react";

import { PitchLockLogo } from "@/components/brand/PitchLockLogo";

import { InvestorDashboardLoader } from "@/components/dashboard/InvestorDashboardLoader";

import { EmailDeliveryNotice } from "@/components/nda/EmailDeliveryNotice";

import {

  DashboardBottomNav,

  DashboardShell,

  DashboardSidebar,

  type NavItem,

} from "@/components/layout/DashboardShell";

import {

  canInvestorAccessFeatureForPresenterTier,

  getInvestorDashboardPermissionsForPresenterTier,

  type PlanTier,

} from "@/lib/plan-permissions";



const DEMO_PRESENTER_TIER: PlanTier = "founder";



const SIDEBAR_NAV: NavItem[] = [

  { href: "/dashboard/investor", label: "Overview" },

  { href: "/pitch", label: "Pitch Room" },

  { href: "/book", label: "Book Meeting" },

  { href: "/meet", label: "Join Meeting" },

];



export default function InvestorDashboardPage() {

  const permissions = getInvestorDashboardPermissionsForPresenterTier(DEMO_PRESENTER_TIER);

  const tier = permissions.presenterTier;



  const canBook = canInvestorAccessFeatureForPresenterTier(tier, "book_pitch_meeting");

  const canJoin = canInvestorAccessFeatureForPresenterTier(tier, "join_pitch_meeting");



  return (

    <DashboardShell

      sidebar={

        <DashboardSidebar

          className="pl-investor-sidebar-minimal"

          title="Investor"

          subtitle="Workspace"

          navItems={SIDEBAR_NAV.map((item) => ({

            ...item,

            locked:

              (item.href === "/book" && !canBook) ||

              (item.href === "/meet" && !canJoin),

          }))}

          footer={

            <Link href="/" className="block text-center text-xs pl-muted pl-hover-text">

              ← Home

            </Link>

          }

        />

      }

      bottomNav={<DashboardBottomNav navItems={SIDEBAR_NAV} />}

    >

      <div className="pl-mobile-logo-bar lg:hidden">

        <PitchLockLogo size="sm" />

      </div>

      <EmailDeliveryNotice />

      <Suspense fallback={null}>
        <InvestorDashboardLoader
          canBook={canBook}
          canJoin={canJoin}
          documentsLocked={!canInvestorAccessFeatureForPresenterTier(tier, "documents_vault")}
          questionsLocked={!canInvestorAccessFeatureForPresenterTier(tier, "questions")}
          interestLocked={!canInvestorAccessFeatureForPresenterTier(tier, "investment_interest")}
        />
      </Suspense>

    </DashboardShell>

  );

}


