"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Fingerprint,
  Share2,
  Wallet,
  ArrowRight,
  FileDown,
  Sparkles,
} from "lucide-react";
import ParableLogo from "@/components/ParableLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.68, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BorderBeamCard({
  children,
  className = "",
  beamSlow = false,
}: {
  children: React.ReactNode;
  className?: string;
  beamSlow?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={`relative overflow-hidden rounded-3xl p-px ${className}`}>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 opacity-70"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255,255,255,0.06), rgba(0,242,255,0.45), rgba(139,92,246,0.5), rgba(0,242,255,0.35), rgba(255,255,255,0.06))",
        }}
        animate={
          reduceMotion
            ? { rotate: 0 }
            : { rotate: 360 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: beamSlow ? 14 : 10, repeat: Infinity, ease: "linear" }
        }
      />
      <div className="relative rounded-[calc(1.5rem-1px)] border border-white/[0.06] bg-[rgba(8,8,10,0.72)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl">
        {children}
      </div>
    </div>
  );
}

const coreValues = [
  {
    title: "Direct monetization",
    icon: Wallet,
    body: "A near zero‑friction payout posture: creators keep more of what they earn, with fewer intermediaries between fan spend and artist balance—built for repeat purchases, not one‑off spikes.",
  },
  {
    title: "Social synergy",
    icon: Share2,
    body: "A unified surface for cross‑platform signal: bring your channels into one coherent feed and workflow—so distribution feels intentional, not fragmented across tabs and tools.",
  },
  {
    title: "Data ownership",
    icon: Fingerprint,
    body: "User‑owned identity with clear IP boundaries: your audience graph and creative assets stay under explicit controls—designed for portability, protection, and partner‑grade compliance.",
  },
] as const;

const roadmap = [
  {
    phase: "Beta",
    caption: "Private partner program",
    detail: "High‑touch cohorts, tight feedback loops, and instrumentation that proves retention.",
  },
  {
    phase: "Growth",
    caption: "Integrations & network effects",
    detail: "Cross‑platform workflows, creator teams, and distribution partnerships that compound.",
  },
  {
    phase: "Scale",
    caption: "Institutional workflows",
    detail: "Reporting, roles, and controls built for agencies, labels, and strategic partners.",
  },
  {
    phase: "Global scale",
    caption: "Category leadership",
    detail: "Multi‑region expansion with a product narrative that travels—without diluting the core thesis.",
  },
] as const;

const DECK_MAILTO =
  "mailto:partners@parable.app?subject=PARABLE%20%E2%80%94%20Investor%20Deck&body=Please%20send%20the%20latest%20investor%20deck.";

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.38]"
        aria-hidden
      >
        <div className="absolute left-1/2 top-[14rem] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--accent-cyan)_18%,transparent),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--accent-violet)_14%,transparent),transparent_65%)] blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 pb-28 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        {/* Hero */}
        <section
          id="hero"
          className="scroll-mt-28 pb-20 pt-4 md:pb-28 lg:pt-8"
          aria-labelledby="hero-heading"
        >
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="order-2 flex max-w-xl flex-col gap-8 lg:order-1">
              <FadeIn>
                <ParableLogo variant="hero" priority className="lg:mr-auto" />
              </FadeIn>
              <FadeIn delay={0.06}>
                <h1
                  id="hero-heading"
                  className="marketing-heading text-[2.35rem] leading-[1.04] text-white sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]"
                >
                  The New Standard for Creator Equity.
                </h1>
              </FadeIn>
              <FadeIn delay={0.12}>
                <p className="marketing-track-wide max-w-lg text-[12px] font-medium uppercase text-white/40">
                  For investors &amp; strategic partners
                </p>
              </FadeIn>
              <FadeIn delay={0.14}>
                <p className="max-w-lg text-[17px] leading-relaxed text-white/55 md:text-lg">
                  PARABLE is the central hub for musicians and influencers—one
                  premium surface for audience, distribution, and economics, so
                  creative careers compound instead of fragment.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#contact"
                    className="cta-cyber-glow inline-flex h-12 items-center justify-center rounded-full bg-white/[0.06] px-8 text-[15px] font-medium text-white/95"
                  >
                    Get started
                  </a>
                  <a
                    href="#core-value"
                    className="marketing-nav-link inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[12px] font-semibold uppercase text-white/45 transition hover:text-white/75"
                  >
                    Explore core value
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                </div>
              </FadeIn>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <FadeIn delay={0.1} className="w-full max-w-[320px]">
                <p className="marketing-track-wide mb-6 text-center text-[11px] font-medium uppercase text-white/35 lg:text-right">
                  Product preview
                </p>
                <div className="relative mx-auto flex justify-center lg:mx-0 lg:justify-end">
                  <motion.div
                    className="relative aspect-[9/19.5] w-full max-w-[280px]"
                    animate={
                      reduceMotion
                        ? undefined
                        : { y: [0, -11, 0] }
                    }
                    transition={
                      reduceMotion
                        ? undefined
                        : {
                            duration: 5.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                  >
                    <div
                      className="absolute inset-0 rounded-[2.85rem] border border-white/[0.14] bg-gradient-to-b from-zinc-700/35 via-zinc-950 to-black shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
                      aria-hidden
                    />
                    <div
                      className="absolute left-1/2 top-3 h-7 w-[5.75rem] -translate-x-1/2 rounded-full bg-black/85 ring-1 ring-white/[0.08]"
                      aria-hidden
                    />
                    <div
                      className="absolute inset-[11px] overflow-hidden rounded-[2.35rem] bg-[#070708]"
                      aria-hidden
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent-violet)_28%,transparent)] via-[#050505] to-[color-mix(in_srgb,var(--accent-cyan)_22%,transparent)]" />
                      <div className="absolute inset-0 opacity-[0.22] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute left-6 top-[22%] space-y-2">
                        <div className="h-2 w-24 rounded-full bg-white/10" />
                        <div className="h-2 w-36 rounded-full bg-white/[0.07]" />
                        <div className="h-2 w-20 rounded-full bg-white/[0.05]" />
                      </div>
                      <div className="absolute bottom-8 left-6 right-6 rounded-2xl border border-white/[0.08] bg-black/35 p-4 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-white/55">
                          <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent-cyan)]" />
                          High‑fidelity UI placeholder
                        </div>
                        <p className="mt-2 text-[12px] leading-relaxed text-white/40">
                          3D device asset can replace this panel—layout is
                          responsive and float‑ready.
                        </p>
                      </div>
                    </div>
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[2.85rem] ring-1 ring-inset ring-white/[0.06]"
                      aria-hidden
                    />
                  </motion.div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Core value */}
        <section id="core-value" className="scroll-mt-28 pb-24 md:pb-28">
          <FadeIn className="mb-12 max-w-2xl">
            <p className="marketing-track-wide text-[12px] font-medium uppercase text-white/45">
              Core value
            </p>
            <h2 className="marketing-heading mt-3 text-2xl text-white sm:text-3xl md:text-4xl">
              Built for durable economics—not novelty features.
            </h2>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3 md:gap-5">
            {coreValues.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <BorderBeamCard beamSlow className="h-full">
                  <div className="flex h-full flex-col p-7 sm:p-8">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/85 shadow-inner shadow-white/[0.04]">
                      <item.icon
                        className="h-5 w-5"
                        strokeWidth={1.35}
                        aria-hidden
                      />
                    </div>
                    <h3 className="marketing-heading text-lg text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {item.body}
                    </p>
                  </div>
                </BorderBeamCard>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section id="leadership" className="scroll-mt-28 pb-24 md:pb-32">
          <FadeIn className="mb-12 max-w-2xl">
            <p className="marketing-track-wide text-[12px] font-medium uppercase text-white/45">
              Visionary leadership
            </p>
            <h2 className="marketing-heading mt-3 text-2xl text-white sm:text-3xl md:text-4xl">
              Operator discipline meets product craft.
            </h2>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="glass-panel rounded-3xl p-8 sm:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
                <div className="flex shrink-0 flex-col items-center gap-4 md:items-start">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.12] to-white/[0.02] text-lg font-semibold tracking-tight text-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                    aria-hidden
                  >
                    KT
                  </div>
                  <p className="text-center text-[11px] uppercase tracking-[0.24em] text-white/35 md:text-left">
                    Founder
                  </p>
                </div>
                <div className="min-w-0 flex-1 space-y-4">
                  <div>
                    <h3 className="marketing-heading text-xl text-white sm:text-2xl">
                      Kym The CEO
                    </h3>
                    <p className="mt-2 text-[14px] text-[color:var(--accent-violet)]">
                      CFO‑grounded execution · systems‑level product vision
                    </p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-white/58">
                    Kym brings a finance‑first operating lens—controls,
                    forecasting, and capital efficiency—paired with a technical
                    roadmap that treats creator tooling as infrastructure, not
                    cosmetics. The mandate is simple: ship outcomes investors
                    can model and creators can feel in their balance sheet.
                  </p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Capital discipline & unit economics",
                      "Platform architecture & long‑term leverage",
                    ].map((line) => (
                      <li
                        key={line}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[13px] text-white/60"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="mt-16" delay={0.08}>
            <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="marketing-track-wide text-[12px] font-medium uppercase text-white/45">
                  Growth roadmap
                </p>
                <h3 className="marketing-heading mt-2 text-xl text-white sm:text-2xl">
                  From beta to global scale
                </h3>
              </div>
              <p className="max-w-md text-sm text-white/45">
                A measured arc—each phase earns the next with proof, partners,
                and repeatable motion.
              </p>
            </div>

            {/* Timeline — desktop */}
            <div className="relative hidden md:block">
              <div
                className="absolute left-0 right-0 top-[0.65rem] h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
                aria-hidden
              />
              <ol className="grid grid-cols-4 gap-6">
                {roadmap.map((step, i) => (
                  <li key={step.phase} className="relative pt-0 text-center">
                    <span
                      className="timeline-dot mx-auto mb-5 block h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_0_4px_rgba(10,10,12,0.95)] ring-1 ring-white/15"
                      style={{ animationDelay: `${i * 0.45}s` }}
                    />
                    <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/45">
                      {step.phase}
                    </p>
                    <p className="marketing-heading mt-2 text-base text-white">
                      {step.caption}
                    </p>
                    <p className="mt-3 text-[13px] leading-relaxed text-white/45">
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Timeline — mobile */}
            <div className="relative md:hidden">
              <div
                className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-white/5 via-white/15 to-white/5"
                aria-hidden
              />
              <ol className="space-y-10 pl-10">
                {roadmap.map((step, i) => (
                  <li key={step.phase} className="relative">
                    <span
                      className="timeline-dot absolute left-[-29px] top-2 z-10 block h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_0_4px_rgba(10,10,12,0.95)] ring-1 ring-white/15"
                      style={{ animationDelay: `${i * 0.45}s` }}
                    />
                    <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/45">
                      {step.phase}
                    </p>
                    <p className="marketing-heading mt-1 text-lg text-white">
                      {step.caption}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/50">
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>
        </section>

        {/* Partners */}
        <section id="partners" className="scroll-mt-28 pb-24">
          <FadeIn>
            <div className="glass-panel rounded-3xl p-8 sm:p-10">
              <p className="marketing-track-wide text-[12px] font-medium uppercase text-white/45">
                Partners
              </p>
              <h2 className="marketing-heading mt-4 text-2xl text-white sm:text-3xl">
                Built for funds, studios, and marquee creators who set culture
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/55">
                If you allocate capital, broker strategic deals, or carry an
                audience at scale, PARABLE meets you with diligence‑ready
                surfaces—clear economics, crisp narrative, and materials that
                respect your time.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  "Investor‑ready narrative",
                  "Creator‑first economics",
                  "Premium brand presentation",
                ].map((label) => (
                  <li
                    key={label}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/65 backdrop-blur-xl"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </section>

        {/* Contact + footer */}
        <section
          id="contact"
          className="scroll-mt-28 border-t border-white/[0.08] pt-16"
        >
          <FadeIn>
            <div className="flex flex-col gap-10 rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 shadow-[0_24px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <h2 className="marketing-heading text-2xl text-white sm:text-3xl">
                    Briefings & materials
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                    Tell us about your mandate— we’ll route you to the right
                    conversation, data room, and partner touchpoints.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="mailto:partners@parable.app"
                    className="glass-panel inline-flex h-12 items-center justify-center rounded-2xl px-7 text-[15px] font-medium text-white/95 transition hover:border-white/[0.2]"
                  >
                    partners@parable.app
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[13px] text-white/45">
                  Request the latest diligence pack—delivered as a secure link.
                </p>
                <a
                  href={DECK_MAILTO}
                  className="cta-deck-premium inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[rgba(212,175,55,0.22)] bg-gradient-to-b from-white/[0.09] to-white/[0.03] px-7 text-[14px] font-semibold tracking-tight text-white/95"
                >
                  <FileDown className="h-4 w-4 text-amber-100/90" strokeWidth={1.75} />
                  Download investor deck
                </a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <p className="mt-12 text-center text-[12px] text-white/35">
              © {new Date().getFullYear()} PARABLE. All rights reserved.
            </p>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}
