"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, PlusSquare, UserPlus } from "lucide-react";
import { domSafeSupabaseImageSrc } from "@/lib/supabase-storage-image";
import { fallbackAvatarOnError } from "@/lib/avatar-display";

type Props = {
  username: string;
  avatarUrl: string;
  postCount: number;
  followersDisplay: string;
  followingCount: number;
  fullName: string | null | undefined;
  bioText: string | null | undefined;
  onNewPost: () => void;
  menuContent: React.ReactNode;
};

export default function SanctuaryInstagramHeader({
  username,
  avatarUrl,
  postCount,
  followersDisplay,
  followingCount,
  fullName,
  bioText,
  onNewPost,
  menuContent,
}: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const safeAvatar = useMemo(() => {
    if (!avatarUrl || avatarUrl === "/logo.svg") return "/logo.svg";
    if (avatarUrl.startsWith("data:")) return avatarUrl;
    return domSafeSupabaseImageSrc("SanctuaryInstagramHeader.avatar", avatarUrl, {
      width: 192,
      quality: 82,
      format: "webp",
    });
  }, [avatarUrl]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/[0.12] bg-black">
        <div className="flex h-[44px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex min-w-0 items-center gap-1 py-2 text-left text-neutral-100"
            aria-label="Home"
          >
            <ChevronDown className="h-5 w-5 shrink-0 -rotate-90 opacity-90" strokeWidth={2.5} />
            <span className="truncate text-[15px] font-semibold tracking-tight">{username}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-5 pr-1">
            <button
              type="button"
              onClick={onNewPost}
              className="text-neutral-100"
              aria-label="New post"
            >
              <PlusSquare className="h-6 w-6" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="text-neutral-100"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 pb-5 pt-3">
        <div className="flex gap-6">
          <div className="shrink-0 pt-1">
            <div className="relative h-[86px] w-[86px] rounded-full border border-white/[0.15] bg-neutral-900 p-[2px]">
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
            <div className="grid grid-cols-3 gap-2 text-center">
              <button type="button" className="min-w-0 py-0.5">
                <p className="text-[15px] font-semibold leading-none text-neutral-100">{postCount}</p>
                <p className="mt-1 text-[11px] leading-none text-neutral-500">posts</p>
              </button>
              <button type="button" className="min-w-0 py-0.5">
                <p className="text-[15px] font-semibold leading-none text-neutral-100">{followersDisplay}</p>
                <p className="mt-1 text-[11px] leading-none text-neutral-500">followers</p>
              </button>
              <button type="button" className="min-w-0 py-0.5">
                <p className="text-[15px] font-semibold leading-none text-neutral-100">{followingCount}</p>
                <p className="mt-1 text-[11px] leading-none text-neutral-500">following</p>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {fullName ? <p className="text-[14px] font-semibold text-neutral-100">{fullName}</p> : null}
          {bioText ? (
            <p className="whitespace-pre-wrap text-[13px] leading-snug text-neutral-100">{bioText}</p>
          ) : (
            <p className="text-[13px] text-neutral-500">No bio yet.</p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            href="/profile"
            className="inline-flex min-h-[32px] flex-1 items-center justify-center rounded-[4px] bg-[#262626] px-3 text-[13px] font-semibold text-neutral-100"
          >
            Edit profile
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[32px] flex-1 items-center justify-center rounded-[4px] bg-[#262626] px-3 text-[13px] font-semibold text-neutral-100"
            onClick={() => {
              void navigator.clipboard?.writeText(`${window.location.origin}/my-sanctuary`).catch(() => {});
            }}
          >
            Share profile
          </button>
        </div>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            className="flex flex-col items-center gap-1 py-1 text-neutral-500"
            aria-label="Discover people"
          >
            <UserPlus className="h-6 w-6 opacity-90" strokeWidth={1.35} />
            <span className="text-[11px] font-medium">Discover people</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/65" role="presentation">
          <button type="button" className="h-full min-w-0 flex-1 cursor-default" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <div className="flex h-full w-[min(100%,280px)] flex-col border-l border-white/[0.12] bg-black shadow-2xl">
            <div className="flex h-[44px] items-center border-b border-white/[0.12] px-4">
              <p className="text-[16px] font-semibold text-neutral-100">Parable</p>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">{menuContent}</div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="border-t border-white/[0.12] py-4 text-center text-[15px] font-normal text-neutral-100"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
