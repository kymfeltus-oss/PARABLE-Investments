"use client";

import { memo, useMemo } from "react";
import type { SanctuaryPost } from "@/lib/sanctuary-posts-storage";
import { enforceRenderUrlOrPlaceholder } from "@/lib/supabase-storage-image";
import { MY_SANCTUARY_POST_FLOW_CLEAN_ROOM } from "@/lib/my-sanctuary-clean-room";

export type FeedPost = SanctuaryPost & { isPendingSave?: boolean };

function aspectClassFor(a: SanctuaryPost["aspect"]) {
  return a === "4x5" ? "aspect-[4/5]" : "aspect-square";
}

type Props = {
  post: FeedPost;
  onOpen: (p: SanctuaryPost) => void;
  virtualized?: boolean;
  avatarUrl?: string | null;
  /** Flush square tiles like Instagram profile grid */
  layout?: "default" | "instagram";
};

const SanctuaryPostGridItem = memo(function SanctuaryPostGridItem({
  post,
  onOpen,
  virtualized = false,
  avatarUrl = null,
  layout = "default",
}: Props) {
  const ig = layout === "instagram";
  const safePostSrc = useMemo(
    () => enforceRenderUrlOrPlaceholder(post.imageDataUrl, 640),
    [post.imageDataUrl],
  );

  const safeAvatarSrc = useMemo(
    () => (avatarUrl?.trim() ? enforceRenderUrlOrPlaceholder(avatarUrl.trim(), 96) : ""),
    [avatarUrl],
  );

  if (MY_SANCTUARY_POST_FLOW_CLEAN_ROOM) {
    return (
      <button
        type="button"
        onClick={() => onOpen(post)}
        className={[
          "group relative h-full w-full min-h-0 overflow-hidden bg-black [contain:content] [content-visibility:auto] [contain-intrinsic-size:500px]",
          ig ? "rounded-none border-0" : "rounded-xl border border-white/[0.1] bg-black/60",
          virtualized ? "" : "transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]",
          virtualized || ig ? (ig ? "aspect-square" : "") : aspectClassFor(post.aspect),
        ].join(" ")}
      >
        <div className="absolute left-2 top-2 z-[1] h-[50px] w-[50px] shrink-0 rounded-lg bg-zinc-600" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-violet-900/55 via-[#0a1628] to-black"
          aria-hidden
        />
        {post.isPendingSave ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
            <span className="rounded-full border border-[#00f2ff]/35 bg-black/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#00f2ff]">
              Saving…
            </span>
          </div>
        ) : null}
        {!ig && post.caption ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2">
            <p className="line-clamp-2 text-left text-[10px] leading-snug text-white/90">{post.caption}</p>
          </div>
        ) : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(post)}
      className={[
        "group relative h-full w-full min-h-0 overflow-hidden bg-black [contain:content] [content-visibility:auto] [contain-intrinsic-size:500px]",
        ig ? "rounded-none border-0" : "rounded-xl border border-white/[0.1] bg-black/60",
        virtualized ? "" : "transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]",
        virtualized || ig ? (ig ? "aspect-square" : "") : aspectClassFor(post.aspect),
      ].join(" ")}
    >
      {!ig && safeAvatarSrc ? (
        <div className="absolute left-2 top-2 z-[1] h-[50px] w-[50px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={safeAvatarSrc} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </div>
      ) : !ig ? (
        <div className="absolute left-2 top-2 z-[1] h-[50px] w-[50px] shrink-0 rounded-lg bg-zinc-600" aria-hidden />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={safePostSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      {post.isPendingSave ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
          <span
            className={[
              "rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-100",
              ig ? "border border-white/20" : "border border-[#00f2ff]/35 text-[#00f2ff]",
            ].join(" ")}
          >
            Saving…
          </span>
        </div>
      ) : null}
      {!ig && post.caption ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2">
          <p className="line-clamp-2 text-left text-[10px] leading-snug text-white/90">{post.caption}</p>
        </div>
      ) : null}
    </button>
  );
});

export default SanctuaryPostGridItem;
