'use client';

import { JetBrains_Mono } from 'next/font/google';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { SovereignYieldModeler } from '@/components/investor/SovereignYieldModeler';

const briefingMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const BG = '#050505';
const ACCENT = '#00FFFF';

/** Terminal-style briefing lines — replace with your approved copy. */
const BRIEFING_LINES = [
  'SESSION: Treat this portal as confidential. Do not forward URLs, tokens, or deck exports.',
  'VIEWER: Use an up-to-date Chromium/Safari/WebKit browser for best Gamma embed fidelity.',
  'CAPTURE: Screen recording, scraping, and unauthorized redistribution are prohibited.',
  'LOGGING: Access events (including IP) may be retained for security and compliance review.',
  'SUPPORT: If the embed fails to load, refresh once; avoid VPNs that strip third-party frames.',
] as const;

type Props = {
  clientIp: string;
};

export function InvestorPortalClient({ clientIp }: Props) {
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [embedReady, setEmbedReady] = useState(false);
  const briefingPanelId = useId();
  const gammaSrc = (process.env.NEXT_PUBLIC_GAMMA_PROPOSAL_URL ?? '').trim();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 28, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 28, damping: 18, mass: 0.6 });
  const gridTx = useTransform(sx, (v) => v * 0.35);
  const gridTy = useTransform(sy, (v) => v * 0.35);
  const glowTx = useTransform(sx, (v) => v * 0.12);
  const glowTy = useTransform(sy, (v) => v * 0.12);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mx.set((e.clientX - cx) / 40);
      my.set((e.clientY - cy) / 40);
    };

    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [mx, my]);

  useEffect(() => {
    if (!gammaSrc) {
      setEmbedReady(true);
      return;
    }
    setEmbedReady(false);
    const t = window.setTimeout(() => setEmbedReady(true), 28_000);
    return () => window.clearTimeout(t);
  }, [gammaSrc]);

  return (
    <div
      ref={frameRef}
      className="relative min-h-dvh overflow-x-hidden text-white antialiased"
      style={{ backgroundColor: BG }}
    >
      {/* Slow grid + vignette */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute inset-[-12%] opacity-[0.14]"
          style={{
            x: gridTx,
            y: gridTy,
            backgroundImage: `
              linear-gradient(to right, ${ACCENT} 1px, transparent 1px),
              linear-gradient(to bottom, ${ACCENT} 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
            animation: 'portalGridDrift 48s linear infinite',
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            x: glowTx,
            y: glowTy,
            background:
              'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(0,255,255,0.16), transparent 55%), radial-gradient(ellipse 60% 40% at 50% 110%, rgba(0,255,255,0.06), transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, #050505 72%)',
          }}
        />
      </div>

      <style>{`
        @keyframes portalGridDrift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 56px 56px, 56px 56px; }
        }
        @keyframes portalSecurityScan {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>

      <motion.div
        className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-10 pt-8 md:px-8 md:pt-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* System Briefing — terminal */}
        <div
          className={`${briefingMono.className} mb-6 w-full max-w-2xl self-center md:mb-8`}
        >
          <div
            className="overflow-hidden rounded-lg border shadow-[inset_0_1px_0_rgba(0,255,255,0.12)]"
            style={{
              borderColor: `${ACCENT}33`,
              background: 'linear-gradient(180deg, rgba(0,20,22,0.92), rgba(0,0,0,0.88))',
              boxShadow: `0 0 32px -8px ${ACCENT}18`,
            }}
          >
            <button
              type="button"
              className="flex w-full items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-[#00FFFF]/[0.06] md:px-3.5 md:py-2.5"
              aria-expanded={briefingOpen}
              aria-controls={briefingPanelId}
              onClick={() => setBriefingOpen((o) => !o)}
            >
              <span className="mt-0.5 select-none text-[#00FFFF]/55" aria-hidden>
                {briefingOpen ? '▼' : '▶'}
              </span>
              <span className="min-w-0">
                <span className="mb-0.5 block text-[8px] font-medium uppercase tracking-[0.26em] text-[#00FFFF]/45 md:text-[9px]">
                  System Briefing
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#00FFFF]/92 md:text-[11px]">
                  Operational Overview
                </span>
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: briefingOpen ? '1fr' : '0fr' }}
            >
              <div id={briefingPanelId} className="min-h-0 overflow-hidden">
                <div className="border-t border-[#00FFFF]/20 px-3 pb-3 pt-2 md:px-3.5 md:pb-3.5">
                  <ul className="space-y-1.5 text-[10px] leading-relaxed text-[#7eeeed]/90 md:text-[11px] md:leading-relaxed">
                    {BRIEFING_LINES.map((line) => (
                      <li key={line} className="flex gap-2 pl-0.5">
                        <span className="shrink-0 font-medium text-[#00FFFF]/45">
                          &gt;
                        </span>
                        <span className="min-w-0 break-words">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <header className="mb-8 flex flex-col items-center gap-4 md:mb-10">
          <div
            className="flex flex-col items-center gap-3"
            style={{
              filter: `drop-shadow(0 0 24px ${ACCENT}33) drop-shadow(0 0 48px ${ACCENT}22)`,
            }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#00FFFF]/75 md:text-[11px]"
              style={{ textShadow: `0 0 20px ${ACCENT}55` }}
            >
              Project PARABLE
            </p>
            <ParableLogoMark className="opacity-95" maxWidthClass="max-w-[min(280px,72vw)]" />
          </div>
          <div
            className="rounded-full border px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#00FFFF]/90 md:text-[11px]"
            style={{
              borderColor: `${ACCENT}44`,
              background: 'linear-gradient(180deg, rgba(0,255,255,0.08), rgba(0,0,0,0.35))',
              boxShadow: `0 0 28px ${ACCENT}22, inset 0 1px 0 ${ACCENT}33`,
            }}
          >
            Confidential Strategic Proposal
          </div>
        </header>

        <SovereignYieldModeler />

        {/* Glass shell — embed stack + terminal footer */}
        <div
          className="mx-auto w-full flex-1 overflow-hidden rounded-2xl border p-3 shadow-2xl backdrop-blur-xl md:p-4"
          style={{
            borderColor: `${ACCENT}28`,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.45))',
            boxShadow: `0 0 0 1px rgba(0,255,255,0.06) inset, 0 24px 80px -24px rgba(0,255,255,0.18)`,
          }}
        >
          {gammaSrc ? (
            <div className="flex min-w-0 flex-col">
              <div
                className={`${briefingMono.className} relative isolate w-full min-w-0 min-h-[85vh] overflow-hidden rounded-xl bg-[#050505]`}
                style={{
                  boxShadow: `
                    0 0 40px rgba(0,255,255,0.1),
                    inset 0 0 100px 32px rgba(0,0,0,0.88),
                    inset 0 0 0 1px rgba(0,255,255,0.08),
                    inset 0 0 48px rgba(0,255,255,0.04)
                  `,
                }}
                aria-busy={!embedReady}
              >
                <iframe
                  key={gammaSrc}
                  src={gammaSrc}
                  className="absolute inset-0 z-0 block h-full min-h-0 w-full min-w-0 rounded-xl border-none"
                  allowFullScreen
                  title="PROJECT PARABLE"
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setEmbedReady(true)}
                />
                <div
                  className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-xl bg-[#050505]/94 px-6 text-center backdrop-blur-md transition-opacity duration-500 ease-out ${
                    embedReady ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
                  }`}
                  aria-hidden={embedReady}
                >
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-40"
                    aria-hidden
                  >
                    <div
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent"
                      style={{ animation: 'portalSecurityScan 2.8s ease-in-out infinite' }}
                    />
                  </div>
                  <p className="relative text-[10px] font-semibold uppercase tracking-[0.42em] text-[#00FFFF]/80 md:text-[11px]">
                    Security check
                  </p>
                  <p className="relative max-w-sm text-[11px] leading-relaxed text-white/50 md:text-xs">
                    Establishing secure presentation channel…
                  </p>
                  <div className="relative flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FFFF] opacity-35" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FFFF] shadow-[0_0_12px_#00FFFF]" />
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-white/35">
                      Loading
                    </span>
                  </div>
                </div>
              </div>

              <footer
                className={`${briefingMono.className} border-t border-[#00FFFF]/35 px-3 py-3 text-center md:px-4 md:py-3.5`}
              >
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#00FFFF]/70 md:text-[10px]">
                  Tracking session
                </p>
                <p className="mt-2 text-[10px] leading-relaxed text-white/45 md:text-[11px]">
                  Secured via 256-bit encryption · Session IP{' '}
                  <span className="tabular-nums text-[#00FFFF]/85">{clientIp}</span>
                  <span className="text-white/35"> · </span>
                  Unauthorized capture prohibited
                </p>
              </footer>
            </div>
          ) : (
            <>
              <div
                className="flex min-h-[85vh] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed border-[#00FFFF]/25 bg-[#050505]/90 px-6 text-center"
                style={{
                  boxShadow: `0 0 40px rgba(0,255,255,0.1), inset 0 0 80px 24px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(0,255,255,0.06)`,
                }}
              >
                <p className="text-sm font-medium text-white/80">Proposal embed not configured</p>
                <p className="max-w-md text-xs leading-relaxed text-white/45">
                  Set{' '}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-[#00FFFF]/90">
                    NEXT_PUBLIC_GAMMA_PROPOSAL_URL
                  </code>{' '}
                  to load the interactive deck.
                </p>
              </div>
              <footer
                className={`${briefingMono.className} border-t border-[#00FFFF]/35 px-3 py-3 text-center md:px-4 md:py-3.5`}
              >
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#00FFFF]/70 md:text-[10px]">
                  Tracking session
                </p>
                <p className="mt-2 text-[10px] leading-relaxed text-white/45 md:text-[11px]">
                  Secured via 256-bit encryption · Session IP{' '}
                  <span className="tabular-nums text-[#00FFFF]/85">{clientIp}</span>
                  <span className="text-white/35"> · </span>
                  Unauthorized capture prohibited
                </p>
              </footer>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
