"use client";

import { Activity } from "lucide-react";
import type { ParableRecentActivity as ParableRecentActivityItem } from "@/lib/parableMockData";

type ParableRecentActivityProps = {
  items: ParableRecentActivityItem[];
};

export default function ParableRecentActivity({ items }: ParableRecentActivityProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_60px_rgba(0,242,254,0.06)] backdrop-blur-2xl">
      <div className="flex items-center gap-2">
        <Activity className="text-[#00f2fe]" size={18} />
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/55">Recent activity</p>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="flex gap-3 rounded-2xl border border-white/[0.07] bg-black/40 px-3 py-3 text-[13px] leading-snug text-white/75"
          >
            <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2fe]/85">
              {row.time}
            </span>
            <span className="min-w-0 break-words">{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
