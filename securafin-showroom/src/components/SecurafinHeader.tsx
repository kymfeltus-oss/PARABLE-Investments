"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSecurafinPersona } from "@/components/persona-context";

const nav = [
  { href: "/", label: "Intro" },
  { href: "/showroom", label: "Showroom" },
  { href: "/marketplace", label: "App Marketplace" },
  { href: "/lab", label: "Innovation Lab" },
];

export default function SecurafinHeader() {
  const pathname = usePathname();
  const { persona, setPersona } = useSecurafinPersona();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050508]/85 backdrop-blur-xl">
      <a
        href="#securafin-main"
        className="absolute -left-[9999px] top-4 z-50 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white outline-none focus:left-4 focus:ring-2 focus:ring-teal-400"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg outline-none ring-violet-500/0 transition hover:ring-2 focus-visible:ring-2"
        >
          <span
            className="text-sm font-black uppercase tracking-[0.2em] text-white"
            aria-hidden
          >
            SF
          </span>
          <span className="text-base font-bold tracking-tight text-white md:text-lg">
            Securafin<span className="text-teal-400">-AI</span>
          </span>
        </Link>

        <nav
          className="flex flex-wrap items-center gap-1 md:gap-2"
          aria-label="Primary"
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider transition outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80 md:text-[11px]",
                  active
                    ? "bg-white/10 text-teal-300"
                    : "text-white/55 hover:bg-white/5 hover:text-white/90",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {pathname !== "/" && (
          <div
            className="flex w-full items-center justify-end gap-2 sm:w-auto"
            role="group"
            aria-label="Personalize homepage"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">
              View as
            </span>
            <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
              {(
                [
                  { id: "corporate" as const, label: "Enterprise" },
                  { id: "smb" as const, label: "Small business" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPersona(opt.id)}
                  aria-pressed={persona === opt.id}
                  className={[
                    "relative rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                    persona === opt.id
                      ? "text-white"
                      : "text-white/45 hover:text-white/75",
                  ].join(" ")}
                >
                  {persona === opt.id && (
                    <motion.span
                      layoutId="persona-pill"
                      className="absolute inset-0 rounded-full bg-violet-600/35 ring-1 ring-violet-400/40"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
