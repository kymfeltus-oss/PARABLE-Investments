"use client";

import { motion } from "framer-motion";

export type SanctuaryViewMode = "social" | "game";

type SanctuaryModeToggleProps = {
  mode: SanctuaryViewMode;
  onChange: (mode: SanctuaryViewMode) => void;
};

export default function SanctuaryModeToggle({ mode, onChange }: SanctuaryModeToggleProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40">Focus</p>
      <div
        className="relative flex w-full max-w-md rounded-[22px] border border-white/[0.1] bg-black/50 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:ml-auto"
        role="tablist"
        aria-label="Page focus"
      >
        <motion.div
          layout
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[18px] bg-gradient-to-r from-[#00f2ff]/25 to-amber-400/15 shadow-[0_0_32px_rgba(0,242,255,0.2)]"
          style={{ left: mode === "social" ? 6 : "calc(50% + 3px)" }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
        <button
          type="button"
          role="tab"
          aria-selected={mode === "social"}
          onClick={() => onChange("social")}
          className="relative z-10 flex-1 rounded-[18px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.22em] transition-colors text-white/90"
        >
          Social feed
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "game"}
          onClick={() => onChange("game")}
          className="relative z-10 flex-1 rounded-[18px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.22em] transition-colors text-white/90"
        >
          Game room
        </button>
      </div>
    </div>
  );
}
