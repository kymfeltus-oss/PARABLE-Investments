import type { Metadata } from "next";
import Link from "next/link";
import { NdaGate } from "@/components/investor/NdaGate";
import { ParableAppSimulation } from "@/components/demo/ParableAppSimulation";

export const metadata: Metadata = {
  title: "PARABLE app simulation | Parable Investments",
  description:
    "Click-through mock of core PARABLE flows for qualified investors — no production backend.",
};

export default function ParableAppSimulationPage() {
  return (
    <NdaGate>
      <div className="relative min-h-screen bg-black text-white">
        <div
          className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,242,255,0.08),transparent_50%)]"
          aria-hidden
        />
        <div className="relative z-10 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <Link
              href="/start"
              className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00f2ff]/80 hover:text-[#00f2ff]"
            >
              ← Investor hub
            </Link>
            <Link
              href="/parable-demo"
              className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40 hover:text-white/65"
            >
              Five-pillar demo
            </Link>
          </div>
        </div>
        <ParableAppSimulation />
      </div>
    </NdaGate>
  );
}
