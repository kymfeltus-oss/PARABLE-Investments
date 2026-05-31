'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const INTRO_IMAGE = '/intro/parable-ecosystem-intro.png';
const INTRO_SEEN_KEY = 'parable_intro_cinematic_seen_v1';

const BOOT_LINES = [
  'INITIALIZING KINGDOM PROTOCOLS…',
  'SYNCING FAITH INDEX NODES…',
  'CALIBRATING IMPACT METRICS…',
  'SECURE CHANNEL READY.',
] as const;

function subscribeIntroSeen() {
  return () => {};
}

function getIntroSeenSnapshot() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export type InfoIntroCinematicPageProps = {
  enterHref?: string;
  backHref?: string;
  backLabel?: string;
};

function useBootSequence(skipAnimation: boolean) {
  const [progress, setProgress] = useState(skipAnimation ? 100 : 0);
  const [lineIndex, setLineIndex] = useState(skipAnimation ? BOOT_LINES.length - 1 : 0);
  const [ready, setReady] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation) return;

    const start = performance.now();
    const duration = 4200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(nextProgress);
      setLineIndex(Math.min(BOOT_LINES.length - 1, Math.floor((elapsed / duration) * BOOT_LINES.length)));

      if (elapsed < duration) {
        requestAnimationFrame(tick);
        return;
      }

      setProgress(100);
      setReady(true);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [skipAnimation]);

  return { progress, lineIndex, ready };
}

function FaithIndexHud({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <motion.div
      className="intro-hud intro-hud-left glass-card pointer-events-none hidden select-none border-[var(--cyan)]/25 bg-black/40 px-3 py-2.5 sm:block sm:px-4 sm:py-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.7 }}
    >
      <p className="type-section-label mb-1 text-[10px] text-[var(--cyan)]/90">Faith Index</p>
      <div className="flex items-end gap-2">
        <span className="font-[family-name:var(--font-tech)] text-2xl font-bold leading-none text-white">
          {reducedMotion ? '87.4' : <AnimatedMetric target={87.4} decimals={1} />}
        </span>
        <span className="mb-0.5 text-xs font-semibold text-[var(--success-green)]">+12.8%</span>
      </div>
      <div className="intro-hud-sparkline mt-2" aria-hidden />
    </motion.div>
  );
}

function KingdomImpactHud({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <motion.div
      className="intro-hud intro-hud-right glass-card pointer-events-none hidden select-none border-[var(--purple)]/25 bg-black/40 px-3 py-2.5 sm:block sm:px-4 sm:py-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.7 }}
    >
      <p className="type-section-label mb-1 text-[10px] text-[var(--purple)]/90">Kingdom Impact</p>
      <div className="flex items-end gap-2">
        <span className="font-[family-name:var(--font-tech)] text-2xl font-bold leading-none text-white">
          {reducedMotion ? '+94%' : <AnimatedMetric target={94} suffix="%" />}
        </span>
      </div>
      <div className="intro-hud-bars mt-2" aria-hidden />
    </motion.div>
  );
}

function AnimatedMetric({
  target,
  decimals = 0,
  suffix = '',
}: {
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <>
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="url(#introRingGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-150"
      />
      <defs>
        <linearGradient id="introRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="100%" stopColor="var(--purple)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function InfoIntroCinematicPage({
  enterHref = '/info',
  backHref = '/start',
  backLabel = '← Choice hub',
}: InfoIntroCinematicPageProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const seenBefore = useSyncExternalStore(subscribeIntroSeen, getIntroSeenSnapshot, () => false);
  const [entering, setEntering] = useState(false);

  const fastPath = Boolean(reducedMotion) || seenBefore;
  const { progress, lineIndex, ready } = useBootSequence(fastPath);

  const handleEnter = useCallback(() => {
    setEntering(true);
    try {
      localStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
    window.setTimeout(() => {
      router.push(enterHref);
    }, 700);
  }, [router, enterHref]);

  const showEnter = ready || seenBefore;

  return (
    <div
      className={`intro-cinematic app-background relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden text-white ${entering ? 'intro-cinematic-exiting' : ''}`}
    >
      <div className="intro-cinematic-image-wrap pointer-events-none absolute inset-0 z-0">
        <Image
          src={INTRO_IMAGE}
          alt="SECURAFIN-AI presents Parable Ecosystem — The future of faith has a platform"
          fill
          priority
          sizes="100vw"
          className="intro-cinematic-image object-cover object-center"
        />
      </div>

      <div className="intro-cinematic-stars pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="intro-cinematic-sweep pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="intro-cinematic-cross-glow pointer-events-none absolute inset-0 z-[3]" aria-hidden />
      <div className="intro-cinematic-grid-scan pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[38vh]" aria-hidden />
      <div className="intro-cinematic-vignette pointer-events-none absolute inset-0 z-[5]" aria-hidden />

      <FaithIndexHud reducedMotion={reducedMotion} />
      <KingdomImpactHud reducedMotion={reducedMotion} />

      <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <Link href={backHref} className="nav-link rounded-lg bg-black/45 px-3 py-2 backdrop-blur-md hover:text-[var(--cyan)]">
          {backLabel}
        </Link>
        {showEnter ? (
          <button
            type="button"
            onClick={handleEnter}
            className="nav-link rounded-lg border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-md transition hover:border-[var(--cyan)]/40 hover:text-[var(--cyan)]"
          >
            Skip
          </button>
        ) : null}
      </header>

      <div className="relative z-10 min-h-0 flex-1" aria-hidden />

      <footer className="relative z-20 flex shrink-0 flex-col items-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6">
        {!showEnter ? (
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProgressRing progress={progress} />
            <p className="type-nav text-center text-[11px] text-[var(--white-muted)] sm:text-xs">
              {BOOT_LINES[lineIndex]}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="flex w-full max-w-md flex-col items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="type-section-label text-center text-[var(--cyan)]/80">Kingdom protocols online</p>
            <button type="button" onClick={handleEnter} className="primary-button type-nav max-w-sm">
              Enter ecosystem
            </button>
            <p className="type-body text-center text-xs text-[var(--white-faint)]">
              Confidential investor materials · NDA on file
            </p>
          </motion.div>
        )}
      </footer>
    </div>
  );
}
