import Link from "next/link";
import { PitchLockLogo } from "@/components/brand/PitchLockLogo";
import { GlassButton } from "@/components/ui/GlassButton";

export function MarketingShell({
  children,
  showCta = true,
}: {
  children: React.ReactNode;
  showCta?: boolean;
}) {
  return (
    <div className="pl-atmosphere pl-app-shell relative flex min-h-dvh w-full flex-col">
      <header className="pl-app-header-safe relative z-10 flex items-center justify-between pb-6 sm:pb-8">
        <Link href="/" className="shrink-0">
          <PitchLockLogo size="sm" />
        </Link>
        {showCta ? (
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hidden text-sm pl-muted pl-hover-text sm:inline-block">
              Pricing
            </Link>
            <Link href="/dashboard/presenter">
              <GlassButton variant="ghost" className="!px-4 !py-2.5">
                Presenter
              </GlassButton>
            </Link>
          </div>
        ) : null}
      </header>
      <main className="pl-app-main relative z-10 flex flex-1 flex-col pl-animate-in">
        {children}
      </main>
    </div>
  );
}

export function PagePlaceholder({
  title,
  description,
  backHref = "/",
  children,
}: {
  title: string;
  description: string;
  backHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <MarketingShell>
      <div className="flex flex-1 flex-col items-center justify-center pl-page-section text-center">
        <p className="pl-label">Coming soon</p>
        <h1 className="pl-display mt-6 text-lg sm:text-xl">{title}</h1>
        <p className="mt-4 max-w-md pl-body text-sm">{description}</p>
        {children}
        <Link href={backHref} className="pl-link mt-10 text-sm">
          ← Back
        </Link>
      </div>
    </MarketingShell>
  );
}
