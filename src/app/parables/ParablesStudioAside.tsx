"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ParableStudioHub = dynamic(
  () => import("@/components/studio-hub/ParableStudioHub"),
  {
    ssr: false,
    loading: () => (
      <div
        className="hidden lg:block lg:min-h-[320px] lg:rounded-[28px] lg:border lg:border-white/10 lg:bg-white/[0.03] animate-pulse"
        aria-hidden
      />
    ),
  }
);

export default function ParablesStudioAside() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  if (desktop !== true) return null;

  return (
    <aside className="relative min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 [scrollbar-width:thin]">
      <div className="rounded-[28px] border border-amber-500/15 bg-gradient-to-b from-zinc-950/90 to-black/80 p-1 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <ParableStudioHub variant="dashboard" />
      </div>
    </aside>
  );
}
