'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HubBackground from '@/components/HubBackground';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';

/** Five strategic pillars — each maps to one bottom-nav destination in this preview. */
export type PillarTab = 'live' | 'hybrid' | 'studio' | 'fellowship' | 'economy';

const PILLAR_NAV: { id: PillarTab; label: string; subtitle: string }[] = [
  { id: 'live', label: 'Live', subtitle: 'Faith & broadcast' },
  { id: 'hybrid', label: 'Hybrid', subtitle: 'One surface' },
  { id: 'studio', label: 'Studio', subtitle: 'Shed & story' },
  { id: 'fellowship', label: 'Gather', subtitle: 'Fellowship' },
  { id: 'economy', label: 'Money', subtitle: 'PM · tickets · seeds' },
];

const SERMON_SNIPPET = `Opening: gratitude for gathering in one spirit.

Today we sit with a simple question: what does faith ask of us when the world is loud?

Three movements — acknowledge the noise, listen for the still voice, carry one actionable mercy into the week ahead.`;

const PULSE_EVENTS = [
  'Austin · Amen burst',
  'Nashville · Shed session',
  'Lagos · ticket purchase',
  'Seoul · praise break',
  'London · seed sown',
] as const;

function haptic(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

function NavIcon({ id, active }: { id: PillarTab; active: boolean }) {
  const c = active ? 'text-[#00f2ff]' : 'text-white/40';
  const sw = 1.6;
  switch (id) {
    case 'live':
      return (
        <svg className={`h-6 w-6 ${c}`} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 12a8 8 0 018-8M4 4v4h4M20 12a8 8 0 01-8 8m8-4v4h-4"
            stroke="currentColor"
            strokeWidth={sw}
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={sw} />
        </svg>
      );
    case 'hybrid':
      return (
        <svg className={`h-6 w-6 ${c}`} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3a7 7 0 100 14 7 7 0 000-14zm0 0v4m0 6v4M3 12h4m10 0h4"
            stroke="currentColor"
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case 'studio':
      return (
        <svg className={`h-6 w-6 ${c}`} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zM10 9h4M9 15h6"
            stroke="currentColor"
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case 'fellowship':
      return (
        <svg className={`h-6 w-6 ${c}`} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke="currentColor"
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg className={`h-6 w-6 ${c}`} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2v4m0 12v4M4 12H2m6 0H6m12 0h2m-6 0h-2M19.07 4.93l-2.83 2.83m-8.48 8.48l-2.83 2.83m0-14.14l2.83 2.83m8.48 8.48l2.83 2.83"
            stroke="currentColor"
            strokeWidth={sw}
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={sw} />
        </svg>
      );
  }
}

export type ParableInteractiveDemoProps = {
  previewBadge?: boolean;
};

export function ParableInteractiveDemo({ previewBadge = true }: ParableInteractiveDemoProps) {
  const [tab, setTab] = useState<PillarTab>('live');
  const [liveOn, setLiveOn] = useState(false);
  const [liveSec, setLiveSec] = useState(0);
  const [telePlaying, setTelePlaying] = useState(false);
  const [sermonDraft, setSermonDraft] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [xp, setXp] = useState(120);
  const [signals, setSignals] = useState(42);
  const [seedsSent, setSeedsSent] = useState(0);
  const [seedAmount, setSeedAmount] = useState(25);
  const [praiseBreak, setPraiseBreak] = useState(false);
  const [altarCall, setAltarCall] = useState(false);
  const [bpm, setBpm] = useState(148);
  const [socialPosts] = useState([
    { id: '1', user: 'River Valley', text: 'Posted a clip from last night’s stream — join the replay thread.' },
    { id: '2', user: 'Studio North', text: 'Casting call: drama episode 3, two roles open.' },
  ]);
  const [projectKind, setProjectKind] = useState<'short' | 'drama'>('short');
  const [castKind, setCastKind] = useState<'ai' | 'real'>('ai');
  const [shedOpen, setShedOpen] = useState(false);
  const [chat, setChat] = useState<{ id: string; from: string; text: string }[]>([
    { id: '0', from: 'Host', text: 'Welcome to Fellowship — say hi and your city.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [pmBalance, setPmBalance] = useState(500);
  const [ticketOwned, setTicketOwned] = useState(false);
  const [ticker, setTicker] = useState(0);
  const teleRef = useRef<HTMLDivElement>(null);

  const emitSignal = useCallback((weight = 1) => {
    setSignals((s) => s + weight);
    haptic(weight > 1 ? [12, 40, 12] : 15);
  }, []);

  useEffect(() => {
    if (!liveOn) return;
    const id = window.setInterval(() => setLiveSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [liveOn]);

  useEffect(() => {
    const id = window.setInterval(() => setTicker((t) => (t + 1) % PULSE_EVENTS.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!praiseBreak) return;
    const id = window.setInterval(() => haptic(8), 500);
    return () => window.clearInterval(id);
  }, [praiseBreak]);

  const onAiAssist = useCallback(() => {
    setAiBusy(true);
    haptic(20);
    window.setTimeout(() => {
      setSermonDraft(SERMON_SNIPPET);
      setAiBusy(false);
      emitSignal(2);
    }, 900);
  }, [emitSignal]);

  useEffect(() => {
    if (!telePlaying || !teleRef.current) return;
    const el = teleRef.current;
    const id = window.setInterval(() => {
      el.scrollTop = Math.min(el.scrollTop + 1.2, el.scrollHeight - el.clientHeight);
    }, 80);
    return () => window.clearInterval(id);
  }, [telePlaying]);

  const buyTicket = useCallback(() => {
    const price = 25;
    if (pmBalance < price) return;
    setPmBalance((b) => b - price);
    setTicketOwned(true);
    emitSignal(3);
    haptic([10, 30, 10, 30, 10]);
  }, [pmBalance, emitSignal]);

  const sendChat = useCallback(() => {
    const t = chatInput.trim();
    if (!t) return;
    setChat((c) => [...c, { id: `${Date.now()}-${Math.random()}`, from: 'You', text: t }]);
    setChatInput('');
    emitSignal(1);
  }, [chatInput, emitSignal]);

  const sendSeeds = useCallback(() => {
    if (seedAmount < 1) return;
    setSeedsSent((n) => n + seedAmount);
    emitSignal(Math.min(5, Math.ceil(seedAmount / 20)));
    haptic([12, 24, 12]);
  }, [seedAmount, emitSignal]);

  const hybridPanels = useMemo(
    () => (
      <div className="flex flex-col gap-3">
        <div className="parable-glass-panel p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/80">Now playing</p>
          <div className="relative mt-3 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-[#0a1628] to-[#070708] ring-1 ring-white/10">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(circle at 30% 40%, rgba(0,242,255,0.25), transparent 55%), radial-gradient(circle at 70% 60%, rgba(212,175,55,0.12), transparent 50%)',
              }}
            />
            {liveOn ? (
              <span className="absolute left-2 top-2 rounded bg-red-600/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                Live
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-white/45">Presence, layout, session energy.</p>
        </div>
        <div className="parable-glass-panel p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/80">Session XP</p>
          <div className="mt-3 flex items-end gap-2">
            <div className="h-24 flex-1 rounded-lg bg-[#00f2ff]/10 ring-1 ring-[#00f2ff]/25">
              <div className="flex h-full flex-col justify-end p-2">
                <div
                  className="rounded bg-[#00f2ff]/35 shadow-[0_0_20px_rgba(0,242,255,0.25)] transition-[height] duration-300"
                  style={{ height: `${Math.min(95, 25 + (xp % 180))}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setXp((x) => x + 15);
                emitSignal(1);
                haptic(12);
              }}
              className="shrink-0 rounded-lg border border-[#00f2ff]/35 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#00f2ff] hover:bg-[#00f2ff]/10"
            >
              Boost
            </button>
          </div>
          <p className="mt-2 font-mono text-xs text-[#00f2ff]/90">{xp} XP</p>
        </div>
        <div className="parable-glass-panel p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/80">Social</p>
          <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto text-left text-[13px] text-white/55">
            {socialPosts.map((p) => (
              <li key={p.id} className="rounded-lg border border-white/[0.06] bg-black/40 px-2 py-2">
                <span className="font-semibold text-white/75">{p.user}</span> — {p.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    [socialPosts, xp, liveOn, emitSignal],
  );

  const atmosphereClass =
    altarCall && praiseBreak
      ? 'from-[#1a0a2e]/90 via-[#0a1628]/80 to-black/90'
      : altarCall
        ? 'from-[#1e1035]/85 via-[#0d0a14]/80 to-black/90'
        : praiseBreak
          ? 'from-[#2a1f08]/80 via-[#0a1628]/75 to-black/90'
          : 'from-[#050505]/95 via-[#070708]/95 to-[#050506]/95';

  const setNav = (id: PillarTab) => {
    setTab(id);
    haptic(10);
  };

  const pillarHeading = (n: string, title: string, lead: string) => (
    <div className="mb-4 border-b border-white/[0.07] pb-3">
      <p className="font-mono text-[11px] font-bold text-[#00f2ff]/60">{n}</p>
      <h2 className="mt-1 text-lg font-black uppercase tracking-[0.08em] text-[#00f2ff]">{title}</h2>
      <p className="mt-2 text-[13px] leading-relaxed text-white/50">{lead}</p>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div
        className={`relative overflow-hidden rounded-[2.5rem] border border-[#00f2ff]/30 bg-gradient-to-b ${atmosphereClass} shadow-[0_0_60px_rgba(0,242,255,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]`}
      >
        <div className="pointer-events-none absolute inset-0 z-0 rounded-[2.5rem] overflow-hidden">
          <HubBackground contained />
        </div>

        {praiseBreak ? (
          <div
            className="parable-demo-praise-pulse pointer-events-none absolute inset-0 z-[1] mix-blend-screen opacity-[0.14]"
            style={{
              background:
                'linear-gradient(120deg, rgba(212,175,55,0.5), rgba(0,242,255,0.35), rgba(212,175,55,0.45))',
            }}
            aria-hidden
          />
        ) : null}
        {altarCall ? (
          <div
            className="pointer-events-none absolute inset-0 z-[1] rounded-[2.5rem] bg-[radial-gradient(ellipse_at_50%_100%,rgba(120,80,200,0.2),transparent_55%)]"
            aria-hidden
          />
        ) : null}

        <div className="relative z-10 flex max-h-[min(88dvh,820px)] min-h-[560px] flex-col pt-[env(safe-area-inset-top,0px)]">
          <div className="shrink-0 px-5 pt-3">
            <div className="flex items-center justify-between text-[11px] font-semibold tracking-widest text-white/35">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-4 rounded-sm border border-white/25" />
                <span className="h-2.5 w-6 rounded-sm bg-white/25" />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <ParableLogoMark className="opacity-[0.98]" maxWidthClass="max-w-[9.5rem]" />
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full border border-[#00f2ff]/35 bg-black/50 px-2.5 py-1 font-mono text-[10px] text-[#00f2ff]" title="Glory signals">
                  {signals}
                </span>
                <span className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] text-amber-200/90">
                  {pmBalance} PM
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setPraiseBreak((v) => !v);
                  haptic(25);
                }}
                className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                  praiseBreak
                    ? 'border-amber-400/60 bg-amber-500/20 text-amber-200 shadow-[0_0_24px_rgba(212,175,55,0.25)]'
                    : 'border-white/12 bg-black/40 text-white/50 hover:border-amber-400/35'
                }`}
              >
                Praise break
              </button>
              <button
                type="button"
                onClick={() => {
                  setAltarCall((v) => !v);
                  haptic([30, 50, 30]);
                }}
                className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                  altarCall
                    ? 'border-purple-400/55 bg-purple-950/50 text-purple-100 shadow-[0_0_26px_rgba(120,80,200,0.25)]'
                    : 'border-white/12 bg-black/40 text-white/50 hover:border-purple-400/35'
                }`}
              >
                Altar call
              </button>
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-2 [-webkit-overflow-scrolling:touch]">
            {tab === 'live' && (
              <div className="space-y-5 pb-2">
                {pillarHeading(
                  '01',
                  'Live faith & broadcast',
                  'Services and teaching with tools built for real gatherings—teleprompter, AI assist, Glory signals, not generic streaming.',
                )}
                <p className="text-2xl font-black uppercase italic tracking-[0.06em] text-[#00f2ff] drop-shadow-[0_0_18px_rgba(0,242,255,0.25)]">
                  Streaming · Creating · Believing
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLiveOn((v) => !v);
                      setLiveSec(0);
                      haptic(35);
                      if (!liveOn) emitSignal(4);
                    }}
                    className={`rounded-xl px-5 py-3 text-sm font-black uppercase tracking-[0.15em] transition ${
                      liveOn
                        ? 'bg-red-600 text-white shadow-[0_0_28px_rgba(220,38,38,0.35)]'
                        : 'bg-[#00f2ff]/20 text-[#00f2ff] ring-1 ring-[#00f2ff]/40'
                    }`}
                  >
                    {liveOn ? 'End live' : 'Go live'}
                  </button>
                  {liveOn ? (
                    <span className="font-mono text-sm text-red-300/90">
                      ● {String(Math.floor(liveSec / 60)).padStart(2, '0')}:{String(liveSec % 60).padStart(2, '0')}
                    </span>
                  ) : (
                    <span className="text-sm text-white/40">Offline</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      emitSignal(2);
                      haptic([15, 25, 15]);
                    }}
                    className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-amber-100/95 hover:bg-amber-500/20"
                  >
                    Amen
                  </button>
                </div>

                <div className="parable-glass-panel p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Teleprompter</p>
                  <div
                    ref={teleRef}
                    className="mt-2 max-h-36 overflow-y-auto rounded-lg border border-white/10 bg-black/60 p-3 text-sm leading-relaxed text-white/75"
                  >
                    {SERMON_SNIPPET}
                    <p className="mt-4 text-white/50">… scroll continues with your cadence.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTelePlaying((p) => !p);
                      haptic(10);
                    }}
                    className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#00f2ff] hover:underline"
                  >
                    {telePlaying ? 'Pause' : 'Play scroll'}
                  </button>
                </div>

                <div className="parable-glass-panel p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">AI assist</p>
                  <textarea
                    value={sermonDraft}
                    onChange={(e) => setSermonDraft(e.target.value)}
                    placeholder="Outline appears here…"
                    rows={6}
                    className="mt-2 w-full resize-none rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white/85 placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    disabled={aiBusy}
                    onClick={onAiAssist}
                    className="mt-2 rounded-lg border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#00f2ff] disabled:opacity-40"
                  >
                    {aiBusy ? 'Working…' : 'Generate outline'}
                  </button>
                </div>

                <div className="parable-glass-panel px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00f2ff]/65">Global pulse</p>
                  <p key={ticker} className="mt-2 font-mono text-[12px] leading-snug text-white/55">
                    {PULSE_EVENTS[ticker]}
                  </p>
                </div>
              </div>
            )}

            {tab === 'hybrid' && (
              <div className="space-y-3 pb-2">
                {pillarHeading(
                  '02',
                  'One hybrid surface',
                  'Live video, light session play, and social context in one app—no juggling three products.',
                )}
                {hybridPanels}
              </div>
            )}

            {tab === 'studio' && (
              <div className="space-y-5 pb-2">
                {pillarHeading(
                  '03',
                  'Creator studio & Shed',
                  'Shorts or episodic drama, flexible casting, and a low-latency lane for musicians and artists.',
                )}
                <div className="flex flex-wrap gap-4">
                  <label className="flex flex-col gap-2 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Project
                    <select
                      value={projectKind}
                      onChange={(e) => setProjectKind(e.target.value as 'short' | 'drama')}
                      className="rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-sm font-normal normal-case text-white"
                    >
                      <option value="short">Short</option>
                      <option value="drama">Episodic drama</option>
                    </select>
                  </label>
                  <div className="flex flex-col gap-2 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Cast
                    <div className="flex gap-3 text-sm font-normal normal-case">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="cast"
                          checked={castKind === 'ai'}
                          onChange={() => setCastKind('ai')}
                          className="border-[#00f2ff]/50 text-[#00f2ff]"
                        />
                        AI
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="cast"
                          checked={castKind === 'real'}
                          onChange={() => setCastKind('real')}
                          className="border-[#00f2ff]/50 text-[#00f2ff]"
                        />
                        Live talent
                      </label>
                    </div>
                  </div>
                </div>
                <div className="parable-glass-panel px-4 py-4 text-sm text-white/60">
                  <strong className="text-white/85">Timeline:</strong>{' '}
                  {projectKind === 'short' ? 'Vertical short' : 'Episode storyboard'} ·{' '}
                  <span className="text-[#00f2ff]">{castKind === 'ai' ? 'AI-assisted' : 'On-camera'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShedOpen(true);
                    haptic(22);
                  }}
                  className="w-full rounded-xl border border-[#00f2ff]/40 bg-black/50 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#00f2ff] hover:bg-[#00f2ff]/10"
                >
                  Enter Shed
                </button>
                {shedOpen ? (
                  <div className="parable-glass-panel p-4 text-sm text-white/70">
                    <p className="font-semibold text-[#00f2ff]">Shed</p>
                    <p className="mt-2 text-white/60">Rehearsal & jam—ultra-low-latency audio lane.</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                      <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-white/45">
                        BPM
                        <input
                          type="range"
                          min={60}
                          max={200}
                          value={bpm}
                          onChange={(e) => setBpm(Number(e.target.value))}
                          className="w-full max-w-[200px] accent-[#00f2ff]"
                        />
                      </label>
                      <span className="font-mono text-sm text-[#00f2ff]/90">{bpm}</span>
                      <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200/90">
                        ~72ms
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShedOpen(false)}
                      className="mt-4 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white/80"
                    >
                      Close
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {tab === 'fellowship' && (
              <div className="space-y-5 pb-2">
                {pillarHeading(
                  '04',
                  'Fellowship & gatherings',
                  'Chat and real-time layers for groups—how people stay together before and after the stream.',
                )}
                <div className="parable-glass-panel p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/80">Room</p>
                  <div className="mt-2 flex max-h-52 flex-col gap-2 overflow-y-auto text-sm">
                    {chat.map((m) => (
                      <div key={m.id} className="text-white/75">
                        <span className="font-semibold text-[#00f2ff]/90">{m.from}:</span> {m.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                      placeholder="Message…"
                      className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={sendChat}
                      className="rounded-lg border border-[#00f2ff]/35 px-4 py-2 text-xs font-bold uppercase text-[#00f2ff]"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'economy' && (
              <div className="space-y-5 pb-2">
                {pillarHeading(
                  '05',
                  'In-app economy & access',
                  'Parable Money, tickets, and seeds—value that can move inside PARABLE, not only off-platform.',
                )}
                <div className="parable-glass-panel p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/75">Seeds</p>
                  <p className="mt-1 text-xs text-white/45">Support creators in the moment—demo ledger only.</p>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-white/45">
                      Amount
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={seedAmount}
                        onChange={(e) => setSeedAmount(Math.max(1, Number(e.target.value) || 1))}
                        className="w-24 rounded-lg border border-white/15 bg-black/60 px-3 py-2 font-mono text-sm font-normal normal-case text-white"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={sendSeeds}
                      className="rounded-lg border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#00f2ff] hover:bg-[#00f2ff]/18"
                    >
                      Sow seeds
                    </button>
                    <span className="text-sm text-white/45">
                      <span className="font-mono text-[#00f2ff]">{seedsSent}</span> sent
                    </span>
                  </div>
                </div>

                <div className="parable-glass-panel p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-white/60">Parable Money</span>
                    <span className="font-mono text-lg text-[#00f2ff]">{pmBalance} PM</span>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="font-semibold text-white/90">Night of worship</p>
                    <p className="mt-1 text-xs text-white/45">Ticketed stream · 25 PM</p>
                    <button
                      type="button"
                      onClick={buyTicket}
                      disabled={ticketOwned || pmBalance < 25}
                      className="mt-3 w-full rounded-lg border border-[#00f2ff]/40 bg-[#00f2ff]/15 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-[#00f2ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {ticketOwned ? 'Ticket secured' : 'Get ticket'}
                    </button>
                    {ticketOwned ? (
                      <p className="mt-2 text-center text-xs text-emerald-400/90">You&apos;re on the list.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>

          <nav
            className="shrink-0 border-t border-white/[0.08] bg-black/55 px-0.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md"
            aria-label="PARABLE pillars"
          >
            <ul className="flex items-stretch justify-between gap-0">
              {PILLAR_NAV.map((item) => {
                const active = tab === item.id;
                return (
                  <li key={item.id} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setNav(item.id)}
                      title={`${item.label}: ${item.subtitle}`}
                      className={`flex w-full flex-col items-center gap-0.5 rounded-lg py-1.5 transition sm:py-2 ${
                        active ? 'bg-[#00f2ff]/10 text-[#00f2ff]' : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
                      }`}
                    >
                      <NavIcon id={item.id} active={active} />
                      <span className="max-w-full truncate px-0.5 text-[8px] font-black uppercase leading-tight tracking-[0.06em] sm:text-[9px] sm:tracking-[0.1em]">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {previewBadge ? (
              <p className="mt-1 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                Preview · five pillars · local data
              </p>
            ) : null}
          </nav>
        </div>
      </div>
    </div>
  );
}
