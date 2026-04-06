"use client";

import Link from "next/link";
import { useState } from "react";
import type { SecurafinApp } from "@/lib/catalog";

export default function SandboxClient({ app }: { app: SecurafinApp }) {
  const [tab, setTab] = useState<"demo" | "spec">("demo");

  return (
    <div className="mt-8">
      <div
        className="flex gap-2 border-b border-white/10 pb-3"
        role="tablist"
        aria-label="Sandbox views"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "demo"}
          onClick={() => setTab("demo")}
          className={[
            "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
            tab === "demo"
              ? "bg-white/10 text-teal-200"
              : "text-white/45 hover:text-white/75",
          ].join(" ")}
        >
          Interactive shell
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "spec"}
          onClick={() => setTab("spec")}
          className={[
            "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
            tab === "spec"
              ? "bg-white/10 text-teal-200"
              : "text-white/45 hover:text-white/75",
          ].join(" ")}
        >
          Spec sheet
        </button>
      </div>

      {tab === "demo" && (
        <div
          role="tabpanel"
          className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#07070c] shadow-[0_0_60px_rgba(20,184,166,0.08)]"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" aria-hidden />
            <span className="ml-3 text-[10px] font-mono text-white/35">
              securafin-sandbox://{app.id}
            </span>
          </div>
          <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
            <aside className="border-b border-white/10 bg-black/30 p-4 lg:border-b-0 lg:border-r">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                Modules
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                {app.highlights.map((h) => (
                  <li key={h}>
                    <span className="block rounded-lg border border-transparent px-2 py-2 text-left">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="min-h-[320px] p-6 md:min-h-[420px]">
              <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-transparent to-violet-600/10 p-6">
                <h2 className="text-lg font-bold text-white">
                  Instant PWA-ready shell
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                  This in-browser sandbox loads without an app store step. Wire
                  your APIs here, or ship with our managed tenant template. For
                  production, we register a scoped service worker and offline
                  cache policy per client.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <div className="text-[10px] font-bold uppercase text-white/35">
                      Latency budget
                    </div>
                    <div className="mt-2 text-2xl font-black text-teal-300">
                      &lt; 2s
                    </div>
                    <div className="text-xs text-white/45">
                      First interactive target on showroom pages
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <div className="text-[10px] font-bold uppercase text-white/35">
                      Access
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      Role-based demo data
                    </div>
                    <div className="text-xs text-white/45">
                      Synthetic records only — safe for stakeholder reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "spec" && (
        <div
          role="tabpanel"
          className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <ul className="space-y-3 text-sm text-white/65">
            <li>
              <span className="font-semibold text-white">Deployment:</span>{" "}
              Dedicated tenant, VPC peering available.
            </li>
            <li>
              <span className="font-semibold text-white">Identity:</span> SAML /
              OIDC, SCIM provisioning hooks.
            </li>
            <li>
              <span className="font-semibold text-white">Data:</span>{" "}
              Region-pinning, customer-managed keys on request.
            </li>
            <li>
              <span className="font-semibold text-white">Accessibility:</span>{" "}
              WCAG 2.2 AA targets on shipped UI components.
            </li>
          </ul>
          <Link
            href={`/lab?app=${encodeURIComponent(app.id)}`}
            className="mt-6 inline-flex rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white outline-none transition hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            Request custom extension
          </Link>
        </div>
      )}
    </div>
  );
}
