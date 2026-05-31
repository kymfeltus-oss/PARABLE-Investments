'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjectSlug } from '@/lib/pitchlock/use-project-slug';

const DECK_STREAM_SRC = '/api/deck/stream#toolbar=0&navpanes=0&scrollbar=0';

type TabId = 'presentation' | 'overview' | 'next';

const TABS: { id: TabId; label: string }[] = [
  { id: 'presentation', label: 'Presentation' },
  { id: 'overview', label: 'Executive overview' },
  { id: 'next', label: 'Next steps' },
];

/**
 * High-conviction executive control board — personalized for Dr. Valerie Daniels-Carter.
 * Presentation tab streams the authenticated local PDF via `/api/deck/stream`.
 */
export function LiveDeckViewport() {
  const projectSlug = useProjectSlug();
  const [activeTab, setActiveTab] = useState<TabId>('presentation');

  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-baseline)]">
      <header className="shrink-0 border-b border-[var(--border-grid)] bg-[var(--bg-panel)] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="font-mono text-[10px] font-semibold tracking-[0.28em] text-[var(--color-accent)] uppercase">
              SecuraFin-AI Executive Briefing
            </p>
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
              Dr. Valerie Daniels-Carter
            </h1>
            <p className="text-xs text-[var(--text-baseline)]/55">
              Confidential investor presentation · session-gated PDF stream
            </p>
          </div>
          <Link
            href={`/${projectSlug}/investor/portal/hub`}
            className="shrink-0 rounded-lg border border-[var(--border-grid)] px-3 py-1.5 font-mono text-[10px] tracking-widest text-[var(--color-accent)] uppercase transition hover:border-[var(--color-accent)]/40"
          >
            ← Portal hub
          </Link>
        </div>

        <nav
          className="mx-auto mt-4 flex max-w-6xl gap-1 overflow-x-auto"
          aria-label="Deck sections"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-t-lg px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition ${
                activeTab === tab.id
                  ? 'bg-[var(--bg-canvas)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30'
                  : 'text-[var(--text-baseline)]/45 hover:text-[var(--text-baseline)]/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {activeTab === 'presentation' ? (
          <div className="relative flex min-h-0 flex-1 flex-col border-t border-[var(--border-grid)]">
            <iframe
              src={DECK_STREAM_SRC}
              title="Parable executive presentation"
              className="absolute inset-0 h-full w-full border-none bg-[var(--bg-panel)]"
              allow="fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : activeTab === 'overview' ? (
          <div className="mx-auto max-w-2xl flex-1 overflow-y-auto px-6 py-10">
            <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-[var(--color-accent)] uppercase">
              Executive overview
            </h2>
            <ul className="space-y-4 text-sm leading-relaxed text-[var(--text-baseline)]/85">
              <li>
                <strong className="text-[var(--text-baseline)]">Platform thesis.</strong> Parable
                builds the infrastructure layer of the global faith economy — stream, give, account,
                and grow on one sovereign stack.
              </li>
              <li>
                <strong className="text-[var(--text-baseline)]">Why now.</strong> Distribution,
                compliance, and capital are converging; early operators need a white-label path that
                preserves brand and data isolation.
              </li>
              <li>
                <strong className="text-[var(--text-baseline)]">Your session.</strong> This deck
                streams from a server-bound PDF. Access requires an active Supabase session and a
                signed NDA on file.
              </li>
            </ul>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl flex-1 overflow-y-auto px-6 py-10">
            <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-[var(--color-success)] uppercase">
              Next steps
            </h2>
            <div className="flex flex-col gap-3">
              <Link
                href={`/${projectSlug}/start/book`}
                className="rounded-xl border border-[var(--border-grid)] bg-[var(--bg-panel)] px-5 py-4 text-center text-sm font-semibold text-[var(--color-accent)] transition hover:border-[var(--color-accent)]/40"
              >
                Book a live briefing
              </Link>
              <Link
                href={`/${projectSlug}/start/explore`}
                className="rounded-xl border border-[var(--border-grid)] px-5 py-4 text-center text-sm text-[var(--text-baseline)]/75 transition hover:text-[var(--text-baseline)]"
              >
                Explore the product prototype
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="shrink-0 border-t border-[var(--border-grid)] px-4 py-2 text-center font-mono text-[9px] tracking-widest text-[var(--text-baseline)]/30 uppercase">
        Faith · Finance · Technology · United For Kingdom Impact
      </footer>
    </div>
  );
}
