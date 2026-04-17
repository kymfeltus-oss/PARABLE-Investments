"use client";

import { useReducedMotion } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLivenessSimulationOptional } from "@/contexts/LivenessSimulationContext";
import { LIVE_EMOJI_POOL } from "@/lib/liveness-simulation-config";

function LiveEmojiColumn() {
  const ctx = useLivenessSimulationOptional();
  const reduceMotion = useReducedMotion();
  if (!ctx?.showLiveEmojiOverlay || reduceMotion) return null;

  const lanes = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    emoji: LIVE_EMOJI_POOL[i % LIVE_EMOJI_POOL.length],
    left: `${(i * 7 + 3) % 100}%`,
    delay: `${(i * 0.31) % 4}s`,
    duration: `${4.2 + (i % 5) * 0.35}s`,
  }));

  return (
    <>
      <div
        className="pointer-events-none fixed right-2 top-[20%] z-[60] hidden h-[55vh] w-10 overflow-hidden md:block lg:right-6"
        aria-hidden
      >
        <div className="relative h-full w-full opacity-75">
          {lanes.map((lane) => (
            <span
              key={lane.id}
              className="absolute text-base leading-none drop-shadow-[0_0_12px_rgba(0,242,254,0.4)] will-change-transform"
              style={{
                left: lane.left,
                bottom: "-10%",
                animation: `livenessEmojiRise ${lane.duration} linear ${lane.delay} infinite`,
              }}
            >
              {lane.emoji}
            </span>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes livenessEmojiRise {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, -115vh, 0) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

function ActivityTicker() {
  const ctx = useLivenessSimulationOptional();
  if (!ctx?.enabled) return null;
  const text =
    ctx.tickerLines.length > 0
      ? ctx.tickerLines.slice(-24).join("   ·   ")
      : "Community activity stream · Studio · Creators · Influencers";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[5.25rem] z-[55] lg:bottom-0">
      <div className="mx-auto max-w-[100vw] border-t border-white/[0.08] bg-black/55 px-3 py-2.5 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl md:py-2">
        <div className="flex items-center gap-3">
          <span className="shrink-0 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.35em] text-[#00f2ff]">
            Live
          </span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className="flex w-max will-change-transform"
              style={{ animation: "livenessTickerMarquee 42s linear infinite" }}
            >
              <span className="whitespace-nowrap pr-20 text-[11px] font-medium text-white/75">{text}</span>
              <span className="whitespace-nowrap pr-20 text-[11px] font-medium text-white/75" aria-hidden>
                {text}
              </span>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes livenessTickerMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}

function PaymentToasts() {
  const ctx = useLivenessSimulationOptional();
  if (!ctx?.enabled) return null;

  return (
    <div className="pointer-events-none fixed left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[70] flex flex-col items-end gap-2 sm:left-auto sm:right-4">
      <AnimatePresence mode="popLayout">
        {ctx.toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto max-w-[min(100%,360px)] rounded-2xl border border-amber-400/35 bg-gradient-to-br from-zinc-950/95 to-black/90 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(251,191,36,0.12)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-2">
              <p className="flex-1 text-[12px] font-semibold leading-snug text-white/95">{t.text}</p>
              <button
                type="button"
                onClick={() => ctx.dismissToast(t.id)}
                className="shrink-0 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.25em] text-amber-200/80">
              Community pulse
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Fixed overlays: emoji column, bottom ticker, top payment toasts. */
export default function LivenessGlobalLayer() {
  return (
    <>
      <LiveEmojiColumn />
      <ActivityTicker />
      <PaymentToasts />
    </>
  );
}
