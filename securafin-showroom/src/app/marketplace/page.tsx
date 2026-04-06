"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  APPS,
  CATEGORY_LABELS,
  type AppCategory,
} from "@/lib/catalog";
import CustomizePulseButton from "@/components/CustomizePulseButton";

const FILTERS: (AppCategory | "all")[] = [
  "all",
  "corporate",
  "events",
  "small-business",
];

export default function MarketplacePage() {
  const [cat, setCat] = useState<AppCategory | "all">("all");
  const list = useMemo(
    () => (cat === "all" ? APPS : APPS.filter((a) => a.category === cat)),
    [cat],
  );

  return (
    <main
      id="securafin-main"
      className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pt-10"
    >
      <header className="max-w-2xl">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-teal-400/90">
          Ready-to-use
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          App Marketplace
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Pick a category, open a live sandbox, and validate with stakeholders in
          minutes. Every SKU can be extended in the Innovation Lab if you need a
          bespoke edge.
        </p>
      </header>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="App categories"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={cat === f}
            onClick={() => setCat(f)}
            className={[
              "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none transition focus-visible:ring-2 focus-visible:ring-teal-400",
              cat === f
                ? "bg-teal-500/25 text-teal-200 ring-1 ring-teal-400/40"
                : "bg-white/[0.04] text-white/50 hover:bg-white/[0.07] hover:text-white/75",
            ].join(" ")}
          >
            {f === "all" ? "All" : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((app) => (
          <li key={app.id}>
            <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/18 hover:bg-white/[0.05]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                {CATEGORY_LABELS[app.category]}
              </div>
              <h2 className="mt-2 text-lg font-bold text-white">{app.name}</h2>
              <p className="mt-2 flex-1 text-sm text-white/50">{app.tagline}</p>
              <ul className="mt-4 space-y-1.5 text-xs text-white/45">
                {app.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="text-teal-400" aria-hidden>
                      ·
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={app.sandboxRoute}
                  className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-black outline-none transition hover:bg-teal-400 focus-visible:ring-2 focus-visible:ring-teal-300"
                >
                  Try it now
                </Link>
                <CustomizePulseButton
                  href={`/lab?app=${encodeURIComponent(app.id)}`}
                />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
