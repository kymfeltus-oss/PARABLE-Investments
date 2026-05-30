'use client';

import { BarChart, Card, Text, Title } from '@tremor/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  analyzeFundPerformance,
  generateFreshAdjustedSnapshot,
  listMinistryFundsForAnalysis,
  type MinistryFundOption,
} from '@/app/actions/accounting-analyst';
import { explainAnomalies, type DrilldownJournalRow } from '@/app/actions/audit-drilldown';
import type { StatementOfActivitiesFundSummaryJson } from '@/lib/ministry-finance/statement-of-activities-summary';

type Props = {
  initialTenantId: string;
};

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function defaultAnalysisPeriod(): { startDate: string; endDate: string } {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return { startDate: formatLocalYmd(start), endDate: formatLocalYmd(today) };
}

function expenseChartRows(raw: StatementOfActivitiesFundSummaryJson | null) {
  if (!raw) return [];
  const expenses = raw.statement.lines.filter((l) => l.kind === 'expense' && l.amount_cents > 0);
  const sorted = [...expenses].sort((a, b) => b.amount_cents - a.amount_cents).slice(0, 12);
  return sorted.map((l) => ({
    name: `${l.account_code}`.slice(0, 18),
    account_code: l.account_code,
    Expenses: Math.round(l.amount_cents) / 100,
  }));
}

export function AnalysisDashboardClient({ initialTenantId }: Props) {
  /** Seeded from `NEXT_PUBLIC_MINISTRY_TENANT_ID` when present; editable for other tenants. */
  const [tenantId, setTenantId] = useState(() => initialTenantId);
  const [funds, setFunds] = useState<MinistryFundOption[]>([]);
  const [fundId, setFundId] = useState('');
  const [{ startDate, endDate }, setPeriod] = useState(() => defaultAnalysisPeriod());
  const [fundsError, setFundsError] = useState<string | null>(null);
  const [loadingFunds, setLoadingFunds] = useState(false);

  const [rawData, setRawData] = useState<StatementOfActivitiesFundSummaryJson | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const [drillOpen, setDrillOpen] = useState(false);
  const [drillAccount, setDrillAccount] = useState<string | null>(null);
  const [drillLineKind, setDrillLineKind] = useState<string | null>(null);
  const [drillNarrative, setDrillNarrative] = useState<string | null>(null);
  const [drillEntries, setDrillEntries] = useState<DrilldownJournalRow[]>([]);
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillError, setDrillError] = useState<string | null>(null);

  const [snapshotBusy, setSnapshotBusy] = useState(false);
  const [snapshotMessage, setSnapshotMessage] = useState<string | null>(null);

  const loadFunds = useCallback(async () => {
    setFundsError(null);
    setLoadingFunds(true);
    setFunds([]);
    setFundId('');
    try {
      const res = await listMinistryFundsForAnalysis(tenantId.trim());
      if (!res.ok) {
        setFundsError(res.error);
        return;
      }
      setFunds(res.funds);
      if (res.funds.length) setFundId(res.funds[0].id);
    } finally {
      setLoadingFunds(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (!initialTenantId.trim()) return;
    let cancelled = false;
    void (async () => {
      setLoadingFunds(true);
      setFundsError(null);
      const res = await listMinistryFundsForAnalysis(initialTenantId.trim());
      if (cancelled) return;
      if (!res.ok) {
        setFundsError(res.error);
        setLoadingFunds(false);
        return;
      }
      setFunds(res.funds);
      if (res.funds.length) setFundId(res.funds[0].id);
      setLoadingFunds(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [initialTenantId]);

  const chartData = useMemo(() => expenseChartRows(rawData), [rawData]);

  const openDrillDown = useCallback(
    async (accountCode: string, lineKind: string) => {
      const code = accountCode.trim();
      if (!code || !fundId.trim() || !tenantId.trim()) return;
      setDrillOpen(true);
      setDrillAccount(code);
      setDrillLineKind(lineKind);
      setDrillLoading(true);
      setDrillError(null);
      setDrillNarrative(null);
      setDrillEntries([]);
      try {
        const res = await explainAnomalies({
          tenantId: tenantId.trim(),
          fundId: fundId.trim(),
          accountCode: code,
          limit: 10,
        });
        if (!res.ok) {
          setDrillError(res.error);
          return;
        }
        setDrillNarrative(res.narrative);
        setDrillEntries(res.entries);
      } finally {
        setDrillLoading(false);
      }
    },
    [tenantId, fundId],
  );

  const closeDrillDown = useCallback(() => {
    setDrillOpen(false);
    setDrillAccount(null);
    setDrillLineKind(null);
    setDrillNarrative(null);
    setDrillEntries([]);
    setDrillError(null);
  }, []);

  const runAnalysis = useCallback(async () => {
    setRunError(null);
    setAnalysis(null);
    setRawData(null);
    setRunning(true);
    try {
      const s = startDate.trim();
      const e = endDate.trim();
      if (s && e && s > e) {
        setRunError('Start date must be on or before end date.');
        return;
      }
      const res = await analyzeFundPerformance({
        tenantId: tenantId.trim(),
        fundId: fundId.trim(),
        startDate: s,
        endDate: e,
      });
      if (!res.ok) {
        setRunError(res.error);
        return;
      }
      setRawData(res.rawData);
      setAnalysis(res.analysis);
    } finally {
      setRunning(false);
    }
  }, [tenantId, fundId, startDate, endDate]);

  const runGenerateSnapshot = useCallback(async () => {
    setSnapshotBusy(true);
    setSnapshotMessage(null);
    try {
      const end = endDate.trim();
      const res = await generateFreshAdjustedSnapshot({
        tenantId: tenantId.trim(),
        fundId: fundId.trim(),
        ...(end && /^\d{4}-\d{2}-\d{2}$/.test(end) ? { endDate: end } : {}),
      });
      if (!res.ok) {
        setSnapshotMessage(res.error);
        return;
      }
      setSnapshotMessage(
        `Step 6 snapshot saved as_of ${res.as_of_date} (id ${res.snapshot_id.slice(0, 8)}…, balanced: ${res.balanced ? 'yes' : 'no'}). Run CFO analysis again to refresh.`,
      );
    } catch (error) {
      setSnapshotMessage(error instanceof Error ? error.message : 'Snapshot failed.');
    } finally {
      setSnapshotBusy(false);
    }
  }, [tenantId, fundId, endDate]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 text-zinc-100">
      <header className="space-y-2 border-b border-zinc-800 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Ministry finance</p>
        <h1 className="text-2xl font-semibold text-white">Fund performance — AI CFO</h1>
        <p className="text-sm text-zinc-400">
          Statement of Activities by fund (Step 7 snapshot). No donor PII is loaded or sent to the model—only GL
          summary JSON for the selected fund.
        </p>
      </header>

      <section className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="text-zinc-400">Tenant ID</span>
          <input
            className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            placeholder="parable_ledger tenant uuid"
          />
        </label>
        <div className="flex flex-col gap-2 md:col-span-2">
          <div className="flex flex-wrap items-end gap-2">
            <button
              type="button"
              onClick={() => void loadFunds()}
              disabled={loadingFunds || !tenantId.trim()}
              className="rounded-lg border border-zinc-600 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
            >
              {loadingFunds ? 'Loading funds…' : 'Refresh fund list'}
            </button>
            {fundsError ? <span className="text-sm text-red-400">{fundsError}</span> : null}
          </div>
        </div>
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="text-zinc-400">Fund</span>
          <select
            className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan"
            value={fundId}
            onChange={(e) => setFundId(e.target.value)}
            disabled={!funds.length}
          >
            {!funds.length ? <option value="">Load funds first</option> : null}
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.fund_code ? `[${f.fund_code}] ` : ''}
                {f.fund_name} ({f.id.slice(0, 8)}…)
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-end gap-4 md:col-span-2">
          <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm">
            <span className="text-zinc-400">Start date</span>
            <input
              type="date"
              className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan [color-scheme:dark]"
              value={startDate}
              onChange={(e) => setPeriod((p) => ({ ...p, startDate: e.target.value }))}
            />
          </label>
          <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm">
            <span className="text-zinc-400">End date</span>
            <input
              type="date"
              className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan [color-scheme:dark]"
              value={endDate}
              onChange={(e) => setPeriod((p) => ({ ...p, endDate: e.target.value }))}
            />
          </label>
        </div>
        <p className="text-xs text-zinc-500 md:col-span-2">
          GL-backed totals include only journals with txn_date in this range. Snapshot fallback picks the latest Step 6
          snapshot on or before the end date. Step 6 snapshot generation uses the end date as an inclusive cap when set.
        </p>
        <div className="flex flex-col gap-2 md:col-span-2 md:flex-row md:flex-wrap md:items-center">
          <button
            type="button"
            onClick={() => void runAnalysis()}
            disabled={running || !tenantId.trim() || !fundId.trim()}
            className="rounded-lg bg-parable-cyan px-4 py-2 text-sm font-medium text-parable-space hover:bg-parable-azure disabled:opacity-40"
          >
            {running ? 'Analyzing…' : 'Run CFO analysis'}
          </button>
          <button
            type="button"
            onClick={() => void runGenerateSnapshot()}
            disabled={snapshotBusy || !tenantId.trim() || !fundId.trim()}
            className="rounded-lg border border-zinc-500 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 disabled:opacity-40"
          >
            {snapshotBusy ? 'Generating snapshot…' : 'Generate fresh snapshot (Step 6)'}
          </button>
          {runError ? <p className="w-full text-sm text-red-400">{runError}</p> : null}
          {snapshotMessage ? (
            <p
              className={`w-full text-sm ${snapshotMessage.includes('saved') ? 'text-emerald-300/90' : 'text-amber-200/90'}`}
              role="status"
            >
              {snapshotMessage}
            </p>
          ) : null}
        </div>
      </section>

      {rawData ? (
        <Card className="border border-zinc-800 bg-zinc-900/90 ring-0">
          <Title className="text-white">Expenses by account (fund slice, top 12)</Title>
          <Text className="text-zinc-400">
            {rawData.meta.period_start_date && rawData.meta.period_end_date ? (
              <>
                Period {rawData.meta.period_start_date}–{rawData.meta.period_end_date}
                {' · '}
              </>
            ) : null}
            As of {rawData.meta.as_of_date ?? '—'} · Net {formatMoney(rawData.rollup.net_income_cents)}
            {rawData.meta.data_source ? (
              <>
                {' '}
                · Source: {rawData.meta.data_source.replace(/_/g, ' ')}
              </>
            ) : null}
          </Text>
          {rawData.meta.data_load_note ? (
            <Text className="mt-1 text-xs text-amber-200/80">{rawData.meta.data_load_note}</Text>
          ) : null}
          {chartData.length ? (
            <BarChart
              className="mt-4 h-72"
              data={chartData}
              index="name"
              categories={['Expenses']}
              colors={['cyan']}
              yAxisWidth={56}
              valueFormatter={(v) =>
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                  v,
                )
              }
              onValueChange={(item) => {
                const code = item && typeof item === 'object' && 'account_code' in item && item.account_code;
                if (typeof code === 'string') void openDrillDown(code, 'expense');
              }}
            />
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No expense lines in this fund slice for the snapshot.</p>
          )}
        </Card>
      ) : null}

      {rawData ? (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <h2 className="mb-3 text-lg font-semibold text-white">Statement of Activities — drill down</h2>
          <p className="mb-3 text-xs text-zinc-500">
            Click a row to load recent <code className="text-zinc-400">ministry_gl_journal_lines</code> for this fund
            and account (read-only; text fields masked before AI).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="py-2 pr-3 font-medium">Kind</th>
                  <th className="py-2 pr-3 font-medium">Account</th>
                  <th className="py-2 pr-3 font-medium">Name</th>
                  <th className="py-2 pr-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rawData.statement.lines.map((l, idx) => (
                  <tr
                    key={`${l.kind}-${l.account_code}-${idx}`}
                    className="cursor-pointer border-b border-zinc-800/80 hover:bg-zinc-900/80"
                    onClick={() => void openDrillDown(l.account_code, l.kind)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        void openDrillDown(l.account_code, l.kind);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <td className="py-2 pr-3 capitalize text-zinc-400">{l.kind}</td>
                    <td className="py-2 pr-3 font-mono text-parable-azure">{l.account_code}</td>
                    <td className="py-2 pr-3 text-zinc-300">{l.account_name}</td>
                    <td className="py-2 text-right tabular-nums text-zinc-200">{formatMoney(l.amount_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {analysis ? (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">AI CFO analysis</h2>
          <div
            className="markdown-cfo text-sm leading-relaxed text-zinc-300 [&_a]:text-parable-azure [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-white [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:text-zinc-100 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:text-zinc-100 [&_ul]:list-disc [&_ul]:pl-5"
          >
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </section>
      ) : null}

      {drillOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={closeDrillDown}
          onKeyDown={(e) => e.key === 'Escape' && closeDrillDown()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="drill-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="drill-title" className="text-lg font-semibold text-white">
                  Audit drill-down
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {drillLineKind ? `${drillLineKind} · ` : ''}
                  <span className="font-mono text-parable-azure">{drillAccount}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeDrillDown}
                className="rounded-lg border border-zinc-600 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Close
              </button>
            </div>

            {drillLoading ? <p className="text-sm text-zinc-400">Loading journal lines…</p> : null}
            {drillError ? <p className="text-sm text-red-400">{drillError}</p> : null}

            {drillNarrative ? (
              <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="mb-2 text-sm font-medium text-zinc-300">AI auditor narrative</h3>
                <div className="markdown-cfo text-sm leading-relaxed text-zinc-300 [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:text-white [&_li]:my-0.5 [&_ul]:list-disc [&_ul]:pl-5">
                  <ReactMarkdown>{drillNarrative}</ReactMarkdown>
                </div>
              </div>
            ) : null}

            {drillEntries.length ? (
              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-300">Recent journal lines (masked)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500">
                        <th className="py-2 pr-2">Txn date</th>
                        <th className="py-2 pr-2">Dr</th>
                        <th className="py-2 pr-2">Cr</th>
                        <th className="py-2 pr-2">Reference</th>
                        <th className="py-2 pr-2">Memo</th>
                        <th className="py-2 pr-2">Project</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillEntries.map((r) => (
                        <tr key={r.line_id} className="border-b border-zinc-800/80">
                          <td className="py-2 pr-2 text-zinc-400">{r.txn_date ?? '—'}</td>
                          <td className="py-2 pr-2 tabular-nums text-zinc-200">{centsCell(r.debit_cents)}</td>
                          <td className="py-2 pr-2 tabular-nums text-zinc-200">{centsCell(r.credit_cents)}</td>
                          <td className="max-w-[140px] truncate font-mono text-zinc-400" title={r.reference_display ?? ''}>
                            {r.reference_display ?? '—'}
                          </td>
                          <td className="max-w-[200px] text-zinc-300" title={r.journal_memo ?? ''}>
                            {r.journal_memo ?? '—'}
                          </td>
                          <td className="max-w-[100px] truncate text-zinc-500" title={r.project_id ?? ''}>
                            {r.project_id ? `${r.project_id.slice(0, 8)}…` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : !drillLoading && !drillError && drillOpen ? (
              <p className="text-sm text-zinc-500">No matching lines returned for this fund and account.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function centsCell(n: number): string {
  if (!n) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100);
}
