import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Controlled journal | Finance',
  robots: { index: false, follow: false },
};

/**
 * `/finance/controlled-journal` — analysis lives at `/finance/analysis` (see `src/app/finance/analysis/page.tsx`).
 */
export default function ControlledJournalPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Finance</p>
          <h1 className="text-2xl font-semibold text-white">Controlled journal</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Post balanced, dimension-validated entries via{' '}
            <code className="text-parable-azure">POST /api/ministry/finance/journal/commit</code>{' '}
            <span className="text-zinc-500">(legacy: /api/ministry/accounting/journal/commit)</span> — Steps 1–3, 5, 8.
          </p>
          <p className="text-sm text-zinc-500">
            Ledger metadata: <code className="text-zinc-400">GET /api/ministry/finance/ledger</code> or{' '}
            <code className="text-zinc-400">GET /api/ledger</code>.
          </p>
        </header>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-300">
          <li>
            <Link className="text-parable-azure underline hover:text-parable-cyan" href="/finance/analysis">
              Fund analysis &amp; AI CFO (Statement of Activities)
            </Link>
          </li>
          <li>
            <Link className="text-parable-azure underline hover:text-parable-cyan" href="/ministry/finance/soa-assistant">
              SOA leader Q&amp;A
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
