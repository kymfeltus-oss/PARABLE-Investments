"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import type { InstagramHomeFeedPost } from "./types";

type Props = {
  post: InstagramHomeFeedPost;
  initialLiked?: boolean;
};

export default function InstagramFeedPost({ post, initialLiked = false }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [burst, setBurst] = useState(false);

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  }, []);

  const handleDoubleTapLike = useCallback(() => {
    setLiked((prev) => {
      if (prev) return true;
      setLikeCount((c) => c + 1);
      queueMicrotask(() => setBurst(true));
      return true;
    });
  }, []);

  const aspectClass = post.mediaAspect === "portrait" ? "aspect-[4/5]" : "aspect-square";

  return (
    <article className="border-b border-neutral-900 bg-black">
      <div className="flex h-12 items-center justify-between px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <button type="button" className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-800">
            {post.avatarUrl ? (
              <Image src={post.avatarUrl} alt="" fill className="object-cover" sizes="32px" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] text-neutral-500">?</span>
            )}
          </button>
          <button type="button" className="min-w-0 truncate text-[14px] font-semibold text-neutral-100">
            {post.username}
          </button>
        </div>
        <button type="button" className="p-1 text-neutral-100" aria-label="Post options">
          <MoreHorizontal className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div className={`relative w-full bg-black ${aspectClass}`}>
        <button
          type="button"
          className="relative block h-full w-full"
          onDoubleClick={handleDoubleTapLike}
          aria-label="Double tap to like"
        >
          {post.mediaUrl ? (
            <Image src={post.mediaUrl} alt="" fill className="object-cover" sizes="100vw" />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )}
          <AnimatePresence>
            {burst ? (
              <motion.span
                key="burst"
                initial={{ scale: 0.6, opacity: 0.9 }}
                animate={{ scale: 1.15, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                onAnimationComplete={() => setBurst(false)}
              >
                <Heart className="h-24 w-24 fill-white text-white drop-shadow-lg" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </button>
      </div>

      <div className="space-y-2 px-3 pb-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.button
                type="button"
                onClick={toggleLike}
                aria-label={liked ? "Unlike" : "Like"}
                aria-pressed={liked}
                animate={liked ? { scale: [1, 1.22, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-neutral-100"
              >
                <Heart
                  className={[
                    "h-6 w-6",
                    liked ? "fill-[#ff3040] text-[#ff3040]" : "fill-none",
                  ].join(" ")}
                  strokeWidth={liked ? 0 : 1.75}
                />
              </motion.button>
            </div>
            <button type="button" className="text-neutral-100" aria-label="Comment">
              <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
            </button>
            <button type="button" className="text-neutral-100" aria-label="Share">
              <Send className="h-6 w-6 -translate-y-px" strokeWidth={1.75} />
            </button>
          </div>
          <button type="button" className="text-neutral-100" aria-label="Save">
            <Bookmark className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>

        <p className="text-[13px] font-semibold text-neutral-100">
          {likeCount.toLocaleString()} likes
        </p>
        <p className="text-[14px] leading-snug text-neutral-100">
          <button type="button" className="mr-1.5 font-semibold">
            {post.username}
          </button>
          <span className="font-normal">{post.caption}</span>
        </p>
        {post.timeLabel ? (
          <p className="text-[11px] uppercase tracking-wide text-neutral-500">{post.timeLabel}</p>
        ) : null}
      </div>
    </article>
  );
}
