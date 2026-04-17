"use client";

import { Play, Layers } from "lucide-react";
import { enforceRenderUrlOrPlaceholder } from "@/lib/supabase-storage-image";
import type { ProfileGridItem } from "./types";

type Props = {
  posts: ProfileGridItem[];
  onPostClick: (post: ProfileGridItem) => void;
};

function safeThumbSrc(url: string): string {
  if (!url || url.startsWith("data:")) return url;
  return enforceRenderUrlOrPlaceholder(url, 640);
}

export default function InstagramProfileGrid({ posts, onPostClick }: Props) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center px-8 py-16 text-center">
        <p className="text-[14px] font-semibold text-neutral-400">No posts yet</p>
        <p className="mt-1 text-[13px] text-neutral-600">Photos you share appear here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="grid grid-cols-3 gap-[1px] md:gap-0.5">
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => onPostClick(post)}
            className="group relative aspect-square cursor-pointer overflow-hidden bg-neutral-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeThumbSrc(post.imageUrl)}
              alt=""
              className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
            />

            <div className="pointer-events-none absolute right-1.5 top-1.5 text-white drop-shadow-md">
              {post.type === "video" ? <Play size={18} fill="white" className="text-white" /> : null}
              {post.type === "carousel" ? <Layers size={18} /> : null}
            </div>

            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
              <div className="flex gap-4 text-[13px] font-bold text-white">
                <span className="flex items-center gap-1">❤️ {post.likes}</span>
                <span className="flex items-center gap-1">💬 {post.comments}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
