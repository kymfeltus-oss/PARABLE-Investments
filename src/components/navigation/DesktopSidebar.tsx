"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PARABLE_MAIN_NAV, isNavItemActive } from "@/components/navigation/parable-main-nav";
import { useSidebarLayout } from "@/contexts/SidebarLayoutContext";

const IS_STUDY_AI = process.env.NEXT_PUBLIC_APP_VARIANT === "parable-study-ai";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { expanded, toggle, sidebarWidthPx } = useSidebarLayout();

  if (IS_STUDY_AI) return null;

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/[0.07] bg-[#050506]/95 shadow-[8px_0_48px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:flex"
      style={{ width: sidebarWidthPx }}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/[0.06] px-3">
        <div className="relative h-8 w-8 shrink-0">
          <Image
            src="/fonts/parable-logo.svg"
            alt="Parable"
            fill
            className="object-contain object-left"
            sizes="32px"
            priority
          />
        </div>
        {expanded && (
          <span className="truncate text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Parable</span>
        )}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3 [scrollbar-width:thin]">
        {PARABLE_MAIN_NAV.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={[
                "flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition",
                active
                  ? "border border-[#00f2ff]/25 bg-[#00f2ff]/10 text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.12)]"
                  : "border border-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.04]",
                expanded ? "" : "justify-center",
              ].join(" ")}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40">
                {item.icon(active)}
              </span>
              {expanded && (
                <span className="truncate text-[11px] font-bold uppercase tracking-wide">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/[0.06] p-2">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/60 transition hover:border-white/15 hover:bg-white/[0.06]"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              Collapse
            </>
          ) : (
            <ChevronRight className="h-4 w-4" aria-label="Expand sidebar" />
          )}
        </button>
      </div>
    </aside>
  );
}
