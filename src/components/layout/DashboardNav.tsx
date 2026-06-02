"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./DashboardShell";

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard/investor" || href === "/dashboard/presenter") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
  title,
  subtitle,
  navItems,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  footer?: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "pl-dashboard-sidebar hidden lg:flex lg:w-56 lg:shrink-0 lg:flex-col",
        className,
      )}
    >
      <div className="px-6 py-10">
        <p className="pl-label">{title}</p>
        {subtitle ? <p className="mt-2 text-sm pl-muted">{subtitle}</p> : null}
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-4 pl-scroll">
        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "pl-dashboard-nav-link",
                active && "pl-dashboard-nav-link--active",
                item.locked && "cursor-not-allowed pl-muted opacity-50",
              )}
              aria-disabled={item.locked}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
              {item.locked ? (
                <span className="pl-badge pl-badge-purple ml-2">Pro</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      {footer ? <div className="border-t border-[var(--pl-border)] p-6">{footer}</div> : null}
    </aside>
  );
}

export function DashboardBottomNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const primary = navItems.slice(0, 4);

  return (
    <nav className="pl-dashboard-bottom-nav lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-3">
        {primary.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "pl-dashboard-bottom-link",
                  active && "pl-dashboard-bottom-link--active",
                  item.locked && "pl-muted opacity-50",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
