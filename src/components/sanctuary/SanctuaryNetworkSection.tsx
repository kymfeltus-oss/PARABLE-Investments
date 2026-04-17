"use client";

import { motion } from "framer-motion";
import { Network, Sparkles } from "lucide-react";

type Props = {
  children: React.ReactNode;
  tags: React.ReactNode;
};

export default function SanctuaryNetworkSection({ children, tags }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[28px] border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-black/40 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <div className="border-b border-white/[0.08] bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(0,242,255,0.1),transparent_55%)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#00f2ff]/25 bg-[#00f2ff]/10 shadow-[0_0_28px_rgba(0,242,255,0.15)]">
              <Network className="h-5 w-5 text-[#00f2ff]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#00f2ff]/75">Network</p>
              <h3 className="mt-0.5 text-lg font-black text-white sm:text-xl">Follows & discover</h3>
              <p className="mt-1 max-w-xl text-sm text-white/50">
                Curate who you follow, add custom channels, and browse suggestions.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-amber-100/90">
            <Sparkles className="h-3.5 w-3.5" />
            Synced locally
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-5">{children}</div>
      <div className="border-t border-white/[0.06] bg-black/25 px-5 py-4 sm:px-7">{tags}</div>
    </motion.section>
  );
}
