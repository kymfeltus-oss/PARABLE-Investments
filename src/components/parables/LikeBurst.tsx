"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

const GLYPHS = ["❤️", "🔥", "👏", "✨", "💎", "⚡"];

type LikeBurstProps = {
  burstId: number;
  className?: string;
};

export default function LikeBurst({ burstId, className }: LikeBurstProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || burstId <= 0) return null;

  const n = 14;
  const items = Array.from({ length: n }, (_, i) => {
    const g = GLYPHS[i % GLYPHS.length];
    const angle = (i / n) * Math.PI * 2;
    const dist = 36 + (i % 5) * 10;
    return {
      id: `${burstId}-${i}`,
      g,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 20,
    };
  });

  return (
    <span className={["pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2", className].filter(Boolean).join(" ")}>
      {items.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1.15, 1],
            x: p.x,
            y: p.y,
          }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="absolute left-0 top-0 text-lg drop-shadow-[0_0_14px_rgba(0,242,254,0.55)]"
          aria-hidden
        >
          {p.g}
        </motion.span>
      ))}
    </span>
  );
}
