"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useState } from "react";
import { APPS } from "@/lib/catalog";

const PHASES = [
  {
    title: "Discover",
    body: "AI-assisted workshops map outcomes, risks, and integrations in days, not months.",
  },
  {
    title: "Prototype",
    body: "Clickable specs with synthetic data so legal and IT can stress-test early.",
  },
  {
    title: "Harden",
    body: "Threat modeling, accessibility sweeps, and performance budgets baked into CI.",
  },
  {
    title: "Deploy",
    body: "Progressive rollout, observability, and rollback paths you can explain to the board.",
  },
] as const;

const CASES = [
  {
    id: "fin",
    client: "Regional credit union",
    problem: "Legacy vendor lock-in blocked modern MFA for branches.",
    solve:
      "Custom identity façade with step-up challenges, preserved core banking APIs.",
    impact: "45% faster help-desk resolution on access issues.",
  },
  {
    id: "health",
    client: "Clinical network",
    problem: "Referral leakage between facilities with no unified audit view.",
    solve:
      "FHIR-aware routing layer with immutable handoff logs and nurse-friendly UI.",
    impact: "12% lift in completed referrals within one quarter.",
  },
  {
    id: "events",
    client: "National conference series",
    problem: "Night-of ops depended on spreadsheets and radio chatter.",
    solve:
      "PulseEvents handheld mode + sponsor APIs + live capacity guardrails.",
    impact: "Zero overrun incidents across 9 cities.",
  },
] as const;

function LabContent() {
  const params = useSearchParams();
  const preset = params.get("app");
  const presetApp = APPS.find((a) => a.id === preset);
  const [openCase, setOpenCase] = useState<string | null>(CASES[0]?.id ?? null);

  return (
    <main
      id="securafin-main"
      className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pt-10"
    >
      <header className="max-w-2xl">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-violet-300/90">
          Custom solutions
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Innovation Lab
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Precision builds for teams that have outgrown one-size templates. We
          pair agentic tooling with senior engineers so your roadmap stays
          honest.
        </p>
        {presetApp && (
          <p className="mt-4 rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-100/90">
            You&apos;re tailoring{" "}
            <span className="font-semibold text-white">{presetApp.name}</span>.
            We&apos;ll inherit its baseline modules and extend where you need
            differentiation.
          </p>
        )}
      </header>

      <section className="mt-14" aria-labelledby="process-heading">
        <h2 id="process-heading" className="text-lg font-bold text-white">
          Delivery motion
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((phase, i) => (
            <motion.li
              key={phase.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className="text-[10px] font-black text-violet-300/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-white">
                {phase.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/50">
                {phase.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="mt-16" aria-labelledby="cases-heading">
        <h2 id="cases-heading" className="text-lg font-bold text-white">
          Interactive case studies
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/50">
          Click a scenario to walk through the problem, intervention, and
          measurable impact — the same narrative structure we use in executive
          readouts.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {CASES.map((c) => {
            const open = openCase === c.id;
            return (
              <div
                key={c.id}
                className={[
                  "rounded-2xl border transition",
                  open
                    ? "border-violet-400/45 bg-violet-500/[0.08]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/18",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenCase(open ? null : c.id)}
                  className="flex w-full flex-col items-start gap-1 rounded-2xl p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  aria-expanded={open}
                  aria-controls={`case-panel-${c.id}`}
                  id={`case-trigger-${c.id}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {c.client}
                  </span>
                  <span className="text-base font-semibold text-white">
                    Problem snapshot
                  </span>
                  <span className="text-sm text-white/55">{c.problem}</span>
                </button>
                <div
                  id={`case-panel-${c.id}`}
                  role="region"
                  aria-labelledby={`case-trigger-${c.id}`}
                  hidden={!open}
                  className={open ? "border-t border-white/10 px-5 pb-5 pt-4" : ""}
                >
                  {open && (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-violet-300/90">
                        What we built
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        {c.solve}
                      </p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-teal-300/90">
                        Impact
                      </p>
                      <p className="mt-1 text-sm text-white/60">{c.impact}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/marketplace"
          className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 outline-none transition hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Compare ready-to-use apps
        </Link>
        <Link
          href="/showroom"
          className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white outline-none transition hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          Back to showroom
        </Link>
      </div>
    </main>
  );
}

export default function InnovationLabPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-16 text-white/50">
          Loading…
        </main>
      }
    >
      <LabContent />
    </Suspense>
  );
}
