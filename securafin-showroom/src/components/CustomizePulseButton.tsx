"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CustomizePulseButton({
  href,
  label = "Customize this",
}: {
  href: string;
  label?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Link
        href={href}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-violet-400/40 bg-violet-600/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-100 outline-none transition hover:border-violet-300/60 hover:bg-violet-500/25 focus-visible:ring-2 focus-visible:ring-violet-300"
      >
        <span
          className="pointer-events-none absolute inset-0 animate-pulse rounded-full bg-violet-400/10 opacity-60 group-hover:opacity-100"
          aria-hidden
        />
        <motion.span
          className="relative"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  );
}
