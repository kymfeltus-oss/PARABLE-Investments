"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Radio, Sparkles, Users } from "lucide-react";

type Follow = { id: string; name: string; viewers: string };

type Props = {
  liveFollowed: Follow[];
  isLiveMock?: boolean;
};

export default function SanctuaryLiveStatusCard({ liveFollowed, isLiveMock = false }: Props) {
  const inShed = false;
  const broadcastActive = isLiveMock;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-[#00f2ff]/20 bg-gradient-to-br from-zinc-950/95 via-black/90 to-zinc-950/80 p-1 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(0,242,255,0.12)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(0,242,255,0.14),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(251,191,36,0.08),transparent_50%)]" />
      <div className="relative rounded-[26px] border border-white/[0.06] bg-black/40 p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/25 bg-[#00f2ff]/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f2ff] opacity-40" />
                <span className="relative h-2 w-2 rounded-full bg-[#00f2ff] shadow-[0_0_12px_rgba(0,242,255,0.9)]" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f2ff]/90">
                Live status
              </span>
            </div>
            <h3 className="mt-3 text-lg font-black tracking-tight text-white sm:text-xl">Studio presence</h3>
            <p className="mt-1 max-w-md text-sm text-white/50">
              Where you are in the stack — shed sessions, broadcast, and who is live in your network.
            </p>
          </div>
          <Link
            href="/live-studio"
            className="shrink-0 rounded-2xl bg-[#00f2ff] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_8px_28px_rgba(0,242,255,0.3)] transition hover:brightness-110"
          >
            Open studio
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-black/50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/15">
                <Sparkles className="h-5 w-5 text-violet-200" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Creator room</p>
                <p className="truncate text-sm font-bold text-white">Shed session</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
                inShed ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/40"
              }`}
            >
              {inShed ? "Live" : "Offline"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-black/50 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/25 bg-red-500/10">
                <Radio className="h-5 w-5 text-red-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Broadcast</p>
                <p className="truncate text-sm font-bold text-white">Streaming</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
                broadcastActive ? "bg-red-500/20 text-red-300" : "bg-white/5 text-white/45"
              }`}
            >
              {broadcastActive ? "On air" : "Ready"}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
            <Users className="h-4 w-4 text-[#00f2ff]/80" />
            Community live
          </div>
          <div className="mt-3 space-y-2.5">
            {liveFollowed.length === 0 ? (
              <p className="text-sm text-white/45">
                No one you follow is live right now. Discover creators on Streamers.
              </p>
            ) : (
              liveFollowed.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/35 px-3 py-2.5"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    <span className="truncate text-sm font-semibold text-white">{a.name}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-mono tabular-nums text-white/50">{a.viewers}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
