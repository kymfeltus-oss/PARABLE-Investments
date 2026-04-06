"use client";

import { motion } from "framer-motion";

export default function AIPresenterAvatar({
  label = "AI host",
}: {
  label?: string;
}) {
  return (
    <div
      className="relative mx-auto flex w-full max-w-[200px] flex-col items-center"
      aria-hidden
    >
      <motion.div
        className="relative aspect-square w-full max-w-[180px]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-teal-400/30 bg-gradient-to-b from-violet-600/20 to-teal-500/10 shadow-[0_0_60px_rgba(20,184,166,0.15)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ opacity: 0.9 }}
        />
        <div className="absolute inset-[12%] rounded-full border border-white/10 bg-[#0a0a12]/90 backdrop-blur-sm">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full text-teal-400/90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <motion.path
              d="M100 48c-22 0-40 18-40 40v24c0 8 6 14 14 14h52c8 0 14-6 14-14V88c0-22-18-40-40-40Z"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.circle
              cx="78"
              cy="92"
              r="6"
              fill="currentColor"
              className="text-teal-300"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <motion.circle
              cx="122"
              cy="92"
              r="6"
              fill="currentColor"
              className="text-violet-300"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.15 }}
            />
            <path
              d="M82 118c8 10 28 10 36 0"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </div>
        <motion.div
          className="pointer-events-none absolute -right-1 top-1/4 h-16 w-16 rounded-full bg-teal-400/20 blur-2xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />
        <motion.div
          className="pointer-events-none absolute -left-2 bottom-1/4 h-14 w-14 rounded-full bg-violet-500/25 blur-2xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
      <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
        {label}
      </p>
    </div>
  );
}
