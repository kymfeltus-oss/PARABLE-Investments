import Link from "next/link";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { GlassCard, GlassButton } from "@/components/ui/GlassCard";
import { PLAN_TIERS, getPresenterPlanPermissions } from "@/lib/plan-permissions";

export default function PricingPage() {
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:px-10 sm:py-24">
        <div className="text-center">
          <p className="pl-label">Plans</p>
          <h1 className="pl-display mt-4 text-3xl sm:text-4xl">For presenters</h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed pl-muted">
            Investors are typically free. Their experience reflects the plan you choose for each pitch
            room.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLAN_TIERS.filter((t) => t !== "accelerator").map((tier) => {
            const plan = getPresenterPlanPermissions(tier);
            const isPremium = tier === "founder";
            const price =
              plan.suggestedPriceMonthly === null
                ? tier === "free"
                  ? "Free"
                  : "Custom"
                : `$${plan.suggestedPriceMonthly}/mo`;

            return (
              <GlassCard
                key={tier}
                premium={isPremium}
                className="flex flex-col"
              >
                {isPremium ? (
                  <span className="pl-badge pl-badge-purple mb-4">
                    Recommended
                  </span>
                ) : null}
                <p className="text-sm font-medium text-white">{plan.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{price}</p>
                <ul className="mt-8 flex-1 space-y-3 text-sm pl-muted">
                  <li>
                    {plan.maxPitchRooms === "unlimited" ? "Unlimited" : plan.maxPitchRooms} pitch
                    room{plan.maxPitchRooms === 1 ? "" : "s"}
                  </li>
                  <li>
                    {plan.maxInvestorInvitesPerMonth === "unlimited"
                      ? "Unlimited"
                      : plan.maxInvestorInvitesPerMonth}{" "}
                    invites per month
                  </li>
                </ul>
                <Link href="/dashboard/presenter" className="mt-10 block">
                  <GlassButton variant={isPremium ? "primary" : "outline"} className="w-full">
                    Get started
                  </GlassButton>
                </Link>
              </GlassCard>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm pl-muted">
          Enterprise and accelerator plans available on request.
        </p>
      </div>
    </MarketingShell>
  );
}
