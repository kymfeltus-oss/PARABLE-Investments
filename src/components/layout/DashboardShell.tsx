import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon?: string;
  locked?: boolean;
};

export { DashboardBottomNav, DashboardSidebar } from "./DashboardNav";

export function DashboardShell({
  sidebar,
  children,
  bottomNav,
  header,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  bottomNav: React.ReactNode;
  header?: React.ReactNode;
}) {
  return (
    <div className="pl-atmosphere pl-app-shell flex min-h-dvh w-full">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <main className="pl-app-main pl-app-main--tabbed pl-scroll">{children}</main>
        {bottomNav}
      </div>
    </div>
  );
}

export function DashboardHeader({
  title,
  badge,
  actions,
}: {
  title: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="pl-dashboard-header">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="pl-display truncate text-lg sm:text-xl">{title}</h1>
          {badge}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}

export function ModuleCardGrid({ children }: { children: React.ReactNode }) {
  return <div className="pl-module-grid xl:max-w-6xl">{children}</div>;
}

export type ModuleSubmodule = {
  title: string;
  description: string;
  href: string;
  locked?: boolean;
};

export function ModuleCardWithSubmodules({
  title,
  description,
  href,
  submodules,
  locked = false,
}: {
  title: string;
  description: string;
  href: string;
  submodules: ModuleSubmodule[];
  locked?: boolean;
}) {
  const className = cn(
    "pl-module-card pl-module-card--hub pl-animate-in",
    locked && "pl-module-card--locked",
  );

  const header = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h2 className="pl-label pl-text !text-sm">{title}</h2>
        {locked ? <span className="pl-badge pl-badge-purple shrink-0">Pro</span> : null}
      </div>
      <p className="mt-3 pl-body text-sm">{description}</p>
    </>
  );

  return (
    <article className={className}>
      {locked ? (
        <div className="block">{header}</div>
      ) : (
        <Link href={href} className="block">
          {header}
        </Link>
      )}
      <ul className="pl-module-subnav" aria-label={`${title} modules`}>
        {submodules.map((item) => (
          <li key={item.href}>
            {item.locked ? (
              <div className="pl-module-subnav-item pl-module-subnav-item--locked">
                <span className="pl-module-subnav-title">{item.title}</span>
                <span className="pl-badge pl-badge-purple shrink-0">Pro</span>
                <p className="pl-module-subnav-desc">{item.description}</p>
              </div>
            ) : (
              <Link href={item.href} className="pl-module-subnav-item">
                <span className="pl-module-subnav-title">{item.title}</span>
                <span className="pl-module-subnav-chevron" aria-hidden="true">
                  →
                </span>
                <p className="pl-module-subnav-desc">{item.description}</p>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ModuleCard({
  title,
  description,
  href,
  locked = false,
  badge,
  premium = false,
}: {
  title: string;
  description: string;
  href?: string;
  icon?: string;
  locked?: boolean;
  badge?: string;
  premium?: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h2 className="pl-label pl-text !text-sm">{title}</h2>
        {badge ? <span className="shrink-0 text-xs pl-muted">{badge}</span> : null}
        {locked ? <span className="pl-badge pl-badge-purple shrink-0">Pro</span> : null}
        {premium ? <span className="pl-badge pl-badge-purple shrink-0">Premium</span> : null}
      </div>
      <p className="mt-3 pl-body text-sm">{description}</p>
    </>
  );

  const className = cn("pl-module-card pl-animate-in", locked && "pl-module-card--locked");

  if (locked || !href) {
    return <article className={className}>{inner}</article>;
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function VerifiedBanner() {
  return (
    <div className="pl-verified-banner">
      <span className="pl-verified-icon">✓</span>
      <div>
        <p className="pl-label pl-text !text-sm">Access verified</p>
        <p className="mt-1 pl-body text-sm">Pitch Access Agreement on file</p>
      </div>
    </div>
  );
}
