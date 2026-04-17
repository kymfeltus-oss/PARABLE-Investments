"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Radio, ArrowRight } from "lucide-react";
import type { ParableLiveSession } from "@/lib/parableMockData";

type ParableLiveBannerProps = {
  session: ParableLiveSession;
};

export default function ParableLiveBanner({ session }: ParableLiveBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative mb-5 overflow-hidden rounded-[28px] border border-[#00f2fe]/25 bg-gradient-to-br from-zinc-950/95 via-black/90 to-zinc-950/90 p-[1px] shadow-[0_20px_80px_rgba(0,242,254,0.12)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[27px] bg-[radial-gradient(circle_at_12%_40%,rgba(0,242,254,0.14),transparent_45%),radial-gradient(circle_at_88%_60%,rgba(251,191,36,0.1),transparent_50%)]" />
      <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-[0_0_40px_rgba(0,242,254,0.15)] ring-2 ring-[#00f2fe]/20">
            <Image
              src={session.figureImage}
              alt="Session host"
              width={160}
              height={160}
              className="h-full w-full object-cover"
              sizes="64px"
              priority={false}
              unoptimized
            />
            <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]">
              <Radio className="h-3 w-3 text-white" aria-hidden />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-red-500/35 bg-red-500/15 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.28em] text-red-200/95">
                Live
              </span>
              <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.28em] text-amber-100/90">
                {session.badge}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-black tracking-tight text-white sm:text-xl">{session.title}</h2>
            <p className="mt-1 text-sm text-white/60">{session.subtitle}</p>
            <p className="mt-1 text-[11px] font-semibold text-[#00f2fe]/90">{session.host}</p>
          </div>
        </div>
        <Link
          href="/studio-hub"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[20px] bg-[#00f2fe] px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] text-black shadow-[0_12px_40px_rgba(0,242,254,0.25)] transition hover:brightness-110"
        >
          Join session
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
