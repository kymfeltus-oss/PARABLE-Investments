"use client";

import { useMemo } from "react";
import Image from "next/image";
import { fallbackAvatarOnError } from "@/lib/avatar-display";
import { domSafeSupabaseImageSrc } from "@/lib/supabase-storage-image";

type Props = {
  avatarUrl: string;
  identityTitle: string;
  handle: string;
  followers: string;
  following: string;
  studioWins: string;
  suppressRemoteAvatar?: boolean;
};

export default function SanctuaryProfileHero({
  avatarUrl,
  identityTitle,
  handle,
  followers,
  following,
  studioWins,
  suppressRemoteAvatar = false,
}: Props) {
  const safeAvatar = useMemo(() => {
    if (suppressRemoteAvatar) return "/logo.svg";
    if (!avatarUrl || avatarUrl === "/logo.svg") return "/logo.svg";
    return domSafeSupabaseImageSrc("SanctuaryProfileHero.avatar", avatarUrl, {
      width: 160,
      quality: 78,
      format: "webp",
    });
  }, [suppressRemoteAvatar, avatarUrl]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#0a1628] via-black to-[#0a0a0c] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(0,242,255,0.12),transparent_55%)]" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
        <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#00f2ff]/25 bg-black shadow-[0_0_40px_rgba(0,242,255,0.15)] sm:mx-0 sm:h-32 sm:w-32">
          {safeAvatar.startsWith("data:") || safeAvatar.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={safeAvatar}
              alt=""
              width={128}
              height={128}
              className="h-full w-full object-cover"
              onError={fallbackAvatarOnError}
            />
          ) : (
            <Image src={safeAvatar} alt="" fill className="object-cover" sizes="128px" priority />
          )}
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f2ff]/75">{identityTitle}</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{handle}</h1>
          <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-2 text-center">
              <p className="text-lg font-black tabular-nums text-white">{followers}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/45">Followers</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-2 text-center">
              <p className="text-lg font-black tabular-nums text-white">{following}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/45">Following</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-2 text-center">
              <p className="text-lg font-black tabular-nums text-[#00f2ff]">{studioWins}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/45">Studio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
