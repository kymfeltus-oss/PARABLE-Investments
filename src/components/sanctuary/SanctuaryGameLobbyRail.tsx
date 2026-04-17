"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Radio } from "lucide-react";
import type { GameLobbyCard } from "@/lib/sanctuary-game-lobby-mock";

type SanctuaryGameLobbyRailProps = {
  title?: string;
  cards: GameLobbyCard[];
};

export default function SanctuaryGameLobbyRail({ title = "Your active streams", cards }: SanctuaryGameLobbyRailProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#00f2ff]/70">Game lobby</p>
          <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">{title}</h2>
        </div>
        <button
          type="button"
          onClick={() => router.push("/streamers")}
          className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00f2ff] hover:underline"
        >
          Browse all
        </button>
      </div>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 pt-1 [scrollbar-width:thin]">
        {cards.map((card, i) => (
          <motion.button
            key={card.id}
            type="button"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(card.href)}
            className="group relative w-[min(280px,78vw)] shrink-0 overflow-hidden rounded-[24px] border-2 border-[#00f2ff]/45 bg-black/70 text-left shadow-[0_0_40px_rgba(0,242,255,0.12),inset_0_0_0_1px_rgba(251,191,36,0.12)]"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90 ${card.gradient}`} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
            {card.live && !reduceMotion ? (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
                <div
                  className="absolute inset-y-[-20%] w-[55%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70"
                  style={{ animation: "sanctuaryLobbyShimmer 2.4s ease-in-out infinite" }}
                />
              </div>
            ) : null}
            <div className="relative flex min-h-[168px] flex-col justify-between gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-red-100">
                  <Radio className="h-3 w-3" aria-hidden />
                  Live
                </span>
                <span className="text-[10px] font-bold tabular-nums text-white/85">{card.viewers}</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{card.subtitle}</p>
                <p className="mt-1 line-clamp-2 text-base font-black leading-snug text-white">{card.title}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {card.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-[#00f2ff]/35 bg-black/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#00f2ff]"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes sanctuaryLobbyShimmer {
          0% {
            transform: translateX(-140%);
          }
          100% {
            transform: translateX(260%);
          }
        }
      `}</style>
    </section>
  );
}
