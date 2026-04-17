"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { domSafeSupabaseImageSrc } from "@/lib/supabase-storage-image";
import { fallbackAvatarOnError } from "@/lib/avatar-display";

type Props = {
  avatarUrl: string;
  username: string;
  displayName: string;
  category: string | null;
  bio: string | null;
  postCount: number;
  followersDisplay: string;
  followingCount: number;
};

const BIO_PREVIEW_CHARS = 120;

export default function InstagramProfileHeader({
  avatarUrl,
  username,
  displayName,
  category,
  bio,
  postCount,
  followersDisplay,
  followingCount,
}: Props) {
  const [bioExpanded, setBioExpanded] = useState(false);

  const safeAvatar = useMemo(() => {
    if (!avatarUrl || avatarUrl === "/logo.svg") return "/logo.svg";
    if (avatarUrl.startsWith("data:")) return avatarUrl;
    return domSafeSupabaseImageSrc("InstagramProfileHeader.avatar", avatarUrl, {
      width: 192,
      quality: 82,
      format: "webp",
    });
  }, [avatarUrl]);

  const bioText = bio?.trim() ?? "";
  const needsTruncate = bioText.length > BIO_PREVIEW_CHARS;
  const bioShown =
    bioExpanded || !needsTruncate ? bioText : `${bioText.slice(0, BIO_PREVIEW_CHARS)}…`;

  return (
    <div className="px-4 pt-4 pb-3">
      <div className="flex gap-6">
        <div className="shrink-0 pt-1">
          <div className="relative h-[86px] w-[86px] rounded-full border border-white/[0.12] bg-neutral-900 p-[2px]">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
              {safeAvatar.startsWith("data:") || safeAvatar.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={safeAvatar}
                  alt=""
                  width={86}
                  height={86}
                  className="h-full w-full object-cover"
                  onError={fallbackAvatarOnError}
                />
              ) : (
                <Image src={safeAvatar} alt="" fill className="object-cover" sizes="86px" priority />
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-2">
          <div className="grid grid-cols-3 gap-1 text-center sm:gap-2">
            <div className="min-w-0 py-0.5">
              <p className="text-[15px] font-bold leading-none text-white tabular-nums">{postCount}</p>
              <p className="mt-1 text-[11px] leading-none text-neutral-500">Posts</p>
            </div>
            <div className="min-w-0 py-0.5">
              <p className="text-[15px] font-bold leading-none text-white tabular-nums">{followersDisplay}</p>
              <p className="mt-1 text-[11px] leading-none text-neutral-500">Followers</p>
            </div>
            <div className="min-w-0 py-0.5">
              <p className="text-[15px] font-bold leading-none text-white tabular-nums">{followingCount}</p>
              <p className="mt-1 text-[11px] leading-none text-neutral-500">Following</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[14px] font-bold text-white">{displayName || username}</p>
        {category ? <p className="text-[13px] text-neutral-500">{category}</p> : null}
        {bioText ? (
          <p className="whitespace-pre-wrap text-[13px] leading-snug text-white">
            {bioShown}
            {needsTruncate && !bioExpanded ? (
              <button
                type="button"
                onClick={() => setBioExpanded(true)}
                className="ml-1 font-semibold text-neutral-400 hover:text-neutral-300"
              >
                more
              </button>
            ) : null}
            {needsTruncate && bioExpanded ? (
              <button
                type="button"
                onClick={() => setBioExpanded(false)}
                className="ml-1 font-semibold text-neutral-400 hover:text-neutral-300"
              >
                less
              </button>
            ) : null}
          </p>
        ) : (
          <p className="text-[13px] text-neutral-600">No bio yet.</p>
        )}
      </div>
    </div>
  );
}
