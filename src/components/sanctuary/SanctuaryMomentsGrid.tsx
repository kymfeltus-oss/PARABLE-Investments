"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SanctuaryMoment } from "@/lib/sanctuary-moments-mock";

type SanctuaryMomentsGridProps = {
  moments: SanctuaryMoment[];
};

export default function SanctuaryMomentsGrid({ moments }: SanctuaryMomentsGridProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.38em] text-white/45">Sanctuary moments</p>
          <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Your grid</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {moments.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(i * 0.04, 0.36), duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.1] bg-black/50 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <Image
              src={m.imageUrl}
              alt={m.alt}
              fill
              className="object-cover transition duration-500 group-hover:brightness-110"
              sizes="(max-width: 640px) 33vw, 200px"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
