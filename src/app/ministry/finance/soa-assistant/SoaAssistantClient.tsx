'use client';

import { useCallback, useState } from 'react';
import type { StatementOfActivitiesFundSummaryJson } from '@/lib/ministry-finance/statement-of-activities-summary';
import {
  askStatementOfActivitiesAssistantAction,
  loadStatementOfActivitiesFundSummaryAction,
} from './actions';

type ChatTurn = { role: 'user' | 'assistant'; content: string };

type Props = {
  initialTenantId: string;
  initialFundId: string;
  initialSnapshotId: string;
};

export function SoaAssistantClient({ initialTenantId, initialFundId, initialSnapshotId }: Props) {
  const [tenantId, setTenantId] = useState(initialTenantId);
  const [fundId, setFundId] = useState(initialFundId);
  const [snapshotId, setSnapshotId] = useState(initialSnapshotId);
  const [sharedSecret, setSharedSecret] = useState('');
  const [summary, setSummary] = useState<StatementOfActivitiesFundSummaryJson | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [chatError, setChatError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoadError(null);
    setLoadingSummary(true);
    setSummary(null);
    setMessages([]);
    try {
      const snap = snapshotId.trim() || undefined;
      const res = await loadStatementOfActivitiesFundSummaryAction({
        tenantId,
        fundId,
        snapshotId: snap ?? null,
        sharedSecret: sharedSecret.trim() || undefined,
      });
      if (!res.ok) {
        setLoadError(res.error);
        return;
      }
      setSummary(res.summary);
    } finally {
      setLoadingSummary(false);
    }
  }, [tenantId, fundId, snapshotId, sharedSecret]);

  const sendQuestion = useCallback(async () => {
    const q = input.trim();
    if (!summary || !q) return;
    const conv: ChatTurn[] = [...messages, { role: 'user', content: q }];
    setChatError(null);
    setSending(true);
    setInput('');
    setMessages(conv);
    try {
      const res = await askStatementOfActivitiesAssistantAction({
        summary,
        conversation: conv,
        sharedSecret: sharedSecret.trim() || undefined,
      });
      if (!res.ok) {
        setChatError(res.error);
        setMessages((m) => m.slice(0, -1));
        return;
      }
      setMessages([...conv, { role: 'assistant', content: res.reply }]);
    } catch (e) {
      setChatError(e instanceof Error ? e.message : String(e));
      setMessages((m) => m.slice(0, -1));
    } finally {
      setSending(false);
    }
  }, [summary, messages, input, sharedSecret]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col gap-6 px-4 py-8 text-zinc-100">
      <header className="space-y-2 border-b border-zinc-800 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Ministry finance</p>
        <h1 className="text-2xl font-semibold text-white">Statement of Activities — leader Q&amp;A</h1>
        <p className="text-sm text-zinc-400">
          Load a fund&apos;s P&amp;L from a trial balance snapshot, then ask questions like why expenses exceed
          donations for the period.
        </p>
      </header>

      <section className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Tenant ID</span>
          <input
            className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400">Fund ID</span>
          <input
            className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan"
            value={fundId}
            onChange={(e) => setFundId(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="text-zinc-400">Snapshot ID (optional — latest as_of_date if empty)</span>
          <input
            className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan"
            value={snapshotId}
            onChange={(e) => setSnapshotId(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          <span className="text-zinc-400">MINISTRY_SOA_ASSISTANT_SECRET (if required)</span>
          <input
            type="password"
            className="rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-white outline-none focus:border-parable-cyan"
            value={sharedSecret}
            onChange={(e) => setSharedSecret(e.target.value)}
            autoComplete="off"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => void loadSummary()}
            disabled={loadingSummary || !tenantId.trim() || !fundId.trim()}
            className="rounded-lg bg-parable-cyan px-4 py-2 text-sm font-medium text-parable-space hover:bg-parable-azure disabled:opacity-40"
          >
            {loadingSummary ? 'Loading snapshot…' : 'Load Statement of Activities'}
          </button>
          {loadError ? <p className="mt-2 text-sm text-red-400">{loadError}</p> : null}
        </div>
      </section>

      {summary ? (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm">
          <h2 className="mb-2 font-medium text-white">Loaded summary</h2>
          <dl className="grid gap-1 text-zinc-400 sm:grid-cols-2">
            <div>
              <dt className="text-zinc-500">Fund</dt>
              <dd className="text-zinc-200">{summary.header.fund_name ?? summary.meta.fund_id}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Restriction</dt>
              <dd className="text-zinc-200">
                {summary.header.restriction_status}
                {summary.header.restriction_label ? ` — ${summary.header.restriction_label}` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">As of</dt>
              <dd className="text-zinc-200">{summary.meta.as_of_date ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Net (fund slice)</dt>
              <dd className="text-zinc-200">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  summary.rollup.net_income_cents / 100,
                )}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section className="flex flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-950/80">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h2 className="text-sm font-medium text-white">Chat</h2>
          <p className="text-xs text-zinc-500">Questions use only the loaded JSON; no donor PII is sent.</p>
        </div>
        <div className="max-h-[420px] flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {!summary ? (
            <p className="text-sm text-zinc-500">Load a report to start the conversation.</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Example: &quot;Why are our mission fund expenses higher than our donations this quarter?&quot;
            </p>
          ) : null}
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`rounded-lg px-3 py-2 text-sm ${
                m.role === 'user' ? 'ml-8 bg-parable-navy/60 text-parable-cyan' : 'mr-8 bg-parable-midnight text-[#F8FAFC]/90'
              }`}
            >
              <span className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">
                {m.role === 'user' ? 'Leader' : 'Assistant'}
              </span>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>
        {chatError ? <p className="px-4 text-sm text-red-400">{chatError}</p> : null}
        <div className="flex gap-2 border-t border-zinc-800 p-4">
          <textarea
            className="min-h-[72px] flex-1 resize-y rounded-lg border border-parable-navy/80 bg-parable-midnight px-3 py-2 text-sm text-white outline-none focus:border-parable-cyan"
            placeholder="Ask about revenue, expenses, or net for this fund…"
            value={input}
            disabled={!summary || sending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void sendQuestion();
              }
            }}
          />
          <button
            type="button"
            disabled={!summary || sending || !input.trim()}
            onClick={() => void sendQuestion()}
            className="self-end rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-40"
          >
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </section>
    </div>
  );
}
