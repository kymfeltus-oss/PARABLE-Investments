"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProjectEstimator from "@/components/ProjectEstimator";
import ProductPreview3D from "@/components/ProductPreview3D";
import { useSecurafinPersona } from "@/components/persona-context";

export default function ShowroomHomePage() {
  const { persona } = useSecurafinPersona();

  const hero =
    persona === "corporate"
      ? {
          kicker: "Governed AI · Zero-trust ready",
          title: "Deploy intelligence without trading control.",
          sub:
            "See how enterprises pair Securafin-AI apps with hardened custom paths — SOC-minded defaults, audit trails, and scale-tested delivery.",
          primary: { href: "/lab", label: "Innovation Lab" },
          secondary: { href: "/marketplace", label: "Review catalog" },
        }
      : {
          kicker: "Fast value · Proven playbooks",
          title: "Ship ready-to-use apps before the quarter closes.",
          sub:
            "Spin up tenant sandboxes in seconds, validate workflows with your team, then scale — or brief us for a precision custom build.",
          primary: { href: "/marketplace", label: "App Marketplace" },
          secondary: { href: "/lab", label: "Custom build" },
        };

  const cases =
    persona === "corporate"
      ? [
          {
            title: "Global access governance",
            body: "Unified contractor badging with policy gates and immutable logs.",
          },
          {
            title: "Executive command layer",
            body: "Roll-up dashboards with data residency and least-privilege APIs.",
          },
        ]
      : [
          {
            title: "Owner-friendly billing",
            body: "LedgerLite cut DSO by 18 days for a 12-person services firm.",
          },
          {
            title: "Event night-of ops",
            body: "PulseEvents handled 4 concurrent venues with one handheld crew view.",
          },
        ];

  return (
    <main id="securafin-main" className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pt-12">
      <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-black uppercase tracking-[0.35em] text-teal-400/90"
          >
            {hero.kicker}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-white/55"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href={hero.primary.href}
              className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-bold text-black outline-none transition hover:bg-teal-400 focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              {hero.primary.label}
            </Link>
            <Link
              href={hero.secondary.href}
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/85 outline-none transition hover:border-white/25 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {hero.secondary.label}
            </Link>
            <ProjectEstimator />
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-10 grid gap-4 sm:grid-cols-2"
            aria-label="Highlighted outcomes"
          >
            {cases.map((c) => (
              <li
                key={c.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="text-sm font-semibold text-white">{c.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  {c.body}
                </p>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 md:p-8"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.12),transparent_45%)]" />
          <ProductPreview3D productName="Securafin Suite" />
          <p className="mt-6 text-center text-[11px] text-white/40">
            GPU-friendly CSS 3D mockup — lightweight first paint, optional WebGL
            upgrades for flagship SKUs.
          </p>
        </motion.div>
      </section>

      <section
        className="mt-20 grid gap-6 md:grid-cols-2"
        aria-labelledby="paths-heading"
      >
        <h2 id="paths-heading" className="sr-only">
          Two paths
        </h2>
        <Link
          href="/marketplace"
          className="group rounded-3xl border border-teal-500/25 bg-teal-500/[0.06] p-8 outline-none transition hover:border-teal-400/45 hover:bg-teal-500/[0.09] focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-300/90">
            Speed
          </span>
          <h3 className="mt-3 text-xl font-bold text-white">App Marketplace</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Categorized, tenant-ready products. Try in-browser sandboxes powered
            by instant-loading PWA shells — no install required.
          </p>
          <span className="mt-6 inline-flex text-xs font-bold uppercase tracking-wider text-teal-300 transition-transform group-hover:translate-x-1">
            Browse apps →
          </span>
        </Link>
        <Link
          href="/lab"
          className="group rounded-3xl border border-violet-500/25 bg-violet-600/[0.07] p-8 outline-none transition hover:border-violet-400/45 hover:bg-violet-600/[0.1] focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-300/90">
            Precision
          </span>
          <h3 className="mt-3 text-xl font-bold text-white">Innovation Lab</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            From AI-assisted prototyping to hardened deployment — custom
            architecture, integrations, and compliance-aware delivery.
          </p>
          <span className="mt-6 inline-flex text-xs font-bold uppercase tracking-wider text-violet-200 transition-transform group-hover:translate-x-1">
            See the process →
          </span>
        </Link>
      </section>
    </main>
  );
}
