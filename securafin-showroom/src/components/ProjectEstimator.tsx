"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { APPS, type SecurafinApp } from "@/lib/catalog";

type Step = 0 | 1 | 2;

const GOALS = [
  { id: "ship-fast", label: "Ship something proven this quarter" },
  { id: "compliance", label: "Meet security & compliance bar" },
  { id: "custom", label: "Need something no catalog app fits" },
] as const;

const SCALES = [
  { id: "solo", label: "Solo / small team" },
  { id: "dept", label: "Department or regional org" },
  { id: "enterprise", label: "Enterprise-wide rollout" },
] as const;

function recommend(
  goal: string,
  scale: string,
): { type: "product" | "custom"; apps: SecurafinApp[]; reason: string } {
  if (goal === "custom") {
    return {
      type: "custom",
      apps: [],
      reason:
        "Your requirements sound bespoke. Our Innovation Lab runs AI-assisted discovery, hardened architecture, and staged delivery.",
    };
  }
  if (goal === "compliance" && scale !== "solo") {
    return {
      type: "product",
      apps: APPS.filter((a) => a.id === "vault-access" || a.id === "sentinel-desk"),
      reason:
        "For policy-heavy workflows, these suites ship with audit trails, access tiers, and IT-friendly operations.",
    };
  }
  if (goal === "ship-fast" && scale === "solo") {
    return {
      type: "product",
      apps: APPS.filter((a) => a.category === "small-business").slice(0, 2),
      reason:
        "Fast time-to-value: mobile-first apps tuned for owners who need receipts, not roadmaps.",
    };
  }
  if (scale === "enterprise") {
    return {
      type: "product",
      apps: APPS.filter((a) => a.category === "corporate").slice(0, 2),
      reason:
        "Enterprise visitors see platforms built for scale, segregation of duties, and executive reporting.",
    };
  }
  return {
    type: "product",
    apps: APPS.slice(0, 2),
    reason:
      "Balanced picks you can trial in the browser sandbox, then deploy as a managed tenant.",
  };
}

export default function ProjectEstimator() {
  const titleId = useId();
  const liveId = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [scale, setScale] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!goal || !scale) return null;
    return recommend(goal, scale);
  }, [goal, scale]);

  const reset = useCallback(() => {
    setStep(0);
    setGoal(null);
    setScale(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl border border-teal-400/35 bg-gradient-to-br from-teal-500/20 via-violet-600/15 to-transparent px-6 py-3 text-sm font-bold text-white shadow-[0_0_40px_rgba(20,184,166,0.15)] outline-none transition focus-visible:ring-2 focus-visible:ring-teal-300"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(120px circle at var(--x,50%) var(--y,50%), rgba(20,184,166,0.25), transparent 55%)",
          }}
        />
        <span className="relative">Open Project Estimator</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="presentation"
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              aria-label="Close dialog backdrop"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={liveId}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0a0f] p-6 shadow-[0_0_80px_rgba(124,58,237,0.2)]"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 id={titleId} className="text-lg font-bold text-white">
                    Project Estimator
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    About 30 seconds — we route you to a ready app or custom build.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg border border-white/10 px-2 py-1 text-xs font-semibold text-white/70 outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  Close
                </button>
              </div>

              <div id={liveId} className="min-h-[140px]" aria-live="polite">
                {step === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white/80">
                      What is the primary outcome?
                    </p>
                    <div className="flex flex-col gap-2">
                      {GOALS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setGoal(g.id);
                            setStep(1);
                          }}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/90 outline-none transition hover:border-teal-400/40 hover:bg-teal-500/10 focus-visible:ring-2 focus-visible:ring-teal-400"
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white/80">
                      What scale are we planning for?
                    </p>
                    <div className="flex flex-col gap-2">
                      {SCALES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setScale(s.id);
                            setStep(2);
                          }}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/90 outline-none transition hover:border-violet-400/40 hover:bg-violet-500/10 focus-visible:ring-2 focus-visible:ring-violet-400"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-xs font-semibold text-white/45 underline-offset-2 hover:text-white/70 hover:underline"
                    >
                      Back
                    </button>
                  </div>
                )}

                {step === 2 && result && (
                  <div className="space-y-4">
                    <p className="text-sm text-white/70">{result.reason}</p>
                    {result.type === "custom" ? (
                      <Link
                        href="/lab"
                        onClick={close}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-violet-600 px-4 py-3 text-sm font-bold text-white outline-none transition hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        Explore Innovation Lab
                      </Link>
                    ) : (
                      <ul className="space-y-2">
                        {result.apps.map((app) => (
                          <li key={app.id}>
                            <Link
                              href={app.sandboxRoute}
                              onClick={close}
                              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition hover:border-teal-400/35 focus-visible:ring-2 focus-visible:ring-teal-400"
                            >
                              <span className="font-semibold text-white">
                                {app.name}
                              </span>
                              <span className="text-xs text-white/50">
                                {app.tagline}
                              </span>
                              <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-teal-400">
                                Try sandbox →
                              </span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href="/marketplace"
                            onClick={close}
                            className="block text-center text-xs font-semibold text-white/45 underline-offset-2 hover:text-white/75 hover:underline"
                          >
                            Browse full marketplace
                          </Link>
                        </li>
                      </ul>
                    )}
                    <button
                      type="button"
                      onClick={reset}
                      className="text-xs font-semibold text-white/45 underline-offset-2 hover:text-white/70 hover:underline"
                    >
                      Start over
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
