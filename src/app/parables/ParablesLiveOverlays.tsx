"use client";



import { useReducedMotion } from "framer-motion";

import { PARABLE_PAYMENT_ALERTS } from "@/lib/parableMockData";



const EMOJI_LOOP = ["❤️", "🔥", "👏", "✨", "💎", "⚡", "🎭", "🌊", "🎞️", "💫", "🖤", "✨"];



export default function ParablesLiveOverlays() {

  const reduceMotion = useReducedMotion();



  const emojiTrack = [...EMOJI_LOOP, ...EMOJI_LOOP];

  const payTrack = [...PARABLE_PAYMENT_ALERTS, ...PARABLE_PAYMENT_ALERTS];



  return (

    <div className="pointer-events-none relative z-[2] mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,242,254,0.06)] backdrop-blur-xl">

        <div className="flex items-center gap-3 px-3 py-2">

          <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.3em] text-amber-300/90">

            Emoji stream

          </span>

          <div className="relative min-h-[28px] flex-1 overflow-hidden">

            <div

              className={[

                "flex min-w-max gap-6 pr-8 text-lg leading-none opacity-90",

                reduceMotion ? "" : "animate-[parableEmojiDrift_28s_linear_infinite]",

              ].join(" ")}

              aria-hidden

            >

              {emojiTrack.map((e, i) => (

                <span key={`${e}-${i}`} className="select-none drop-shadow-[0_0_12px_rgba(0,242,254,0.25)]">

                  {e}

                </span>

              ))}

            </div>

          </div>

        </div>

      </div>



      <div className="overflow-hidden rounded-2xl border border-[#00f2fe]/15 bg-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(251,191,36,0.05)] backdrop-blur-xl">

        <div className="flex items-center gap-3 px-3 py-2">

          <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.3em] text-[#00f2fe]/85">

            Donation ticker

          </span>

          <div className="relative min-h-[28px] flex-1 overflow-hidden">

            <div

              className={[

                "flex min-w-max gap-10",

                reduceMotion ? "" : "animate-[parablePayDrift_32s_linear_infinite]",

              ].join(" ")}

              aria-hidden

            >

              {payTrack.map((p, i) => (

                <span

                  key={`${p.id}-${i}`}

                  className="whitespace-nowrap text-[11px] font-semibold text-white/72"

                >

                  <span className="text-amber-200/90">●</span>{" "}

                  <span className="text-white/65">{p.label}</span>

                </span>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

