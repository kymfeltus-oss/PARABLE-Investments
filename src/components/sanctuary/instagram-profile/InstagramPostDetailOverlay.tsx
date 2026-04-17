"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { enforceRenderUrlOrPlaceholder } from "@/lib/supabase-storage-image";
import type { ProfileGridItem } from "./types";

type Props = {
  post: ProfileGridItem | null;
  username: string;
  onClose: () => void;
};

function safeFullSrc(url: string): string {
  if (!url || url.startsWith("data:")) return url;
  return enforceRenderUrlOrPlaceholder(url, 1080);
}

export default function InstagramPostDetailOverlay({ post, username, onClose }: Props) {
  return (
    <AnimatePresence>
      {post ? (
        <motion.div
          key={post.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col bg-black"
          role="dialog"
          aria-modal
          aria-label="Post"
        >
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.1] px-2">
            <span className="w-10" />
            <span className="truncate text-[15px] font-semibold text-white">{username}</span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto">
            <div className="relative w-full bg-black sm:mx-auto sm:max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
                className="w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeFullSrc(post.imageUrl)} alt="" className="w-full object-contain" />
              </motion.div>
            </div>
            <div className="border-t border-white/[0.08] px-4 py-3">
              <p className="text-[14px] text-white">
                <span className="font-semibold">{username}</span>{" "}
                <span className="font-normal text-neutral-300">{post.source.caption}</span>
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
