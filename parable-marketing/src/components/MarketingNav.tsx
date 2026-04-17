"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ParableLogo from "@/components/ParableLogo";

const links = [
  { href: "#core-value", label: "Core value" },
  { href: "#leadership", label: "Leadership" },
  { href: "#partners", label: "Partners" },
  { href: "#contact", label: "Contact" },
];

export default function MarketingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5 sm:px-6"
    >
      <nav
        className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="PARABLE home"
        >
          <ParableLogo variant="nav" priority />
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="marketing-nav-link rounded-lg px-3 py-2 text-[11px] font-medium uppercase text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/90"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 shadow-inner shadow-white/[0.04] transition hover:border-[color:color-mix(in_srgb,var(--accent-cyan)_40%,transparent)] hover:bg-white/[0.1]"
        >
          Partner inquiry
        </a>
      </nav>
    </motion.header>
  );
}
