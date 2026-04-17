"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { ParableFeedItem } from "@/lib/parableMockData";
import { useFlashMobDisplay } from "@/contexts/LivenessSimulationContext";
import LikeBurst from "./LikeBurst";

function idSalt(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 3)) % 97;
  return h;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function SeedCard({ item }: { item: ParableFeedItem }) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const salt = idSalt(item.id);
  const hotLikes = useFlashMobDisplay(item.likes, salt);
  const hotComments = useFlashMobDisplay(item.comments, salt + 1);
  const hotShares = useFlashMobDisplay(item.shares, salt + 2);
  const displayLikes = hotLikes + (liked ? 1 : 0);

  const toggle = useCallback(() => {
    setLiked((was) => {
      const next = !was;
      if (next) setBurst((b) => b + 1);
      return next;
    });
  }, []);

  const tall = item.kind === "short";

  return (
    <motion.article
      layout
      className="relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] shadow-[0_12px_50px_rgba(0,242,254,0.06)] backdrop-blur-xl"
    >
      <div
        className={[
          "relative w-full overflow-hidden bg-black/50",
          tall ? "aspect-[9/16] max-h-[420px]" : "aspect-video max-h-[240px]",
        ].join(" ")}
      >
        <Image
          src={item.thumbUrl}
          alt=""
          fill
          className="object-cover"
          sizes={tall ? "(max-width:768px) 45vw, 280px" : "(max-width:768px) 45vw, 360px"}
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-white/85">
          {item.kind === "short" ? "Short" : "Post"}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#00f2fe]">{item.username}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/70">{item.caption}</p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">{item.createdLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
          <motion.button
            type="button"
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            className={`relative inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition ${
              liked
                ? "border-[#00f2fe]/35 bg-[#00f2fe]/15 text-[#00f2fe] shadow-[0_0_28px_rgba(0,242,254,0.25)]"
                : "border-white/12 bg-black/45 text-white/70 hover:border-[#00f2fe]/25"
            }`}
          >
            <Heart size={14} className={liked ? "fill-[#00f2fe] text-[#00f2fe]" : ""} />
            {formatCount(displayLikes)}
            {burst > 0 ? <LikeBurst key={burst} burstId={burst} /> : null}
          </motion.button>

          <span className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            <MessageCircle size={14} className="text-[#00f2fe]/80" />
            {formatCount(hotComments)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            <Share2 size={14} className="text-amber-200/90" />
            {formatCount(hotShares)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

type ParableSeedFeedProps = {
  shorts: ParableFeedItem[];
  posts: ParableFeedItem[];
};

export default function ParableSeedFeed({ shorts, posts }: ParableSeedFeedProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-white/45">Seed feed</p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Shorts</h2>
            <p className="mt-1 max-w-xl text-sm text-white/55">High-velocity clips from creators — likes, shares, and comments simulated for demo density.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {shorts.map((item) => (
            <SeedCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-black text-white sm:text-2xl">Posts</h2>
          <p className="mt-1 text-sm text-white/55">Production updates, calls, and studio drops.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {posts.map((item) => (
            <SeedCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
