"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

const POOL = ["❤️", "🔥", "👏", "✨", "💫", "🎬", "⚡"];

function prand(seed: number) {
  return seed - Math.floor(seed);
}

export default function ParableSideEmojiStream() {
  const reduceMotion = useReducedMotion();

  const lanes = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const r = prand(Math.sin((i + 1) * 12.9898) * 43758.5453);
      const r2 = prand(Math.sin((i + 2) * 4.898) * 12345.678);
      return {
        id: i,
        emoji: POOL[i % POOL.length],
        left: `${(r * 100).toFixed(2)}%`,
        delay: `${(r2 * 4).toFixed(2)}s`,
        duration: `${4 + (i % 5) * 0.55}s`,
      };
    });
  }, []);

  if (reduceMotion) {
    return null;
  }

  return (
    <>
      <div
        className="pointer-events-none fixed right-4 top-[22%] z-[5] hidden h-[52vh] w-11 overflow-hidden md:block lg:right-6"
        aria-hidden
      >
        <div className="relative h-full w-full opacity-80">
          {lanes.map((lane) => (
            <span
              key={lane.id}
              className="absolute text-lg leading-none drop-shadow-[0_0_12px_rgba(0,242,254,0.35)]"
              style={{
                left: lane.left,
                bottom: "-12%",
                animation: `parableEmojiRise ${lane.duration} linear ${lane.delay} infinite`,
              }}
            >
              {lane.emoji}
            </span>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes parableEmojiRise {
          0% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0;
          }
          8% {
            opacity: 0.95;
          }
          100% {
            transform: translate3d(0, -120vh, 0) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
