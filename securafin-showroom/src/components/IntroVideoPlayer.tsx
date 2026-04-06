"use client";

import { parseIntroVideoUrl, type ParsedIntroVideo } from "@/lib/intro-video";

const TITLE =
  "Securafin-AI company introduction video presented by your AI host";

export default function IntroVideoPlayer({
  videoUrl,
  posterUrl,
}: {
  videoUrl: string | undefined;
  posterUrl: string | undefined;
}) {
  const parsed: ParsedIntroVideo = parseIntroVideoUrl(videoUrl);

  if (parsed?.mode === "youtube" || parsed?.mode === "vimeo") {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_80px_rgba(124,58,237,0.12)]">
        <iframe
          src={parsed.embedUrl}
          title={TITLE}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (parsed?.mode === "file") {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_80px_rgba(20,184,166,0.1)]">
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster={posterUrl || undefined}
          aria-label={TITLE}
        >
          <source src={parsed.src} />
          Your browser does not support embedded video.
        </video>
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/15 bg-gradient-to-br from-violet-950/40 via-[#0a0a12] to-teal-950/30 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      role="region"
      aria-label="Video placeholder"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-teal-400/30 bg-teal-500/10 text-teal-300">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7L8 5Z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-white/85">Add your intro video</p>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-white/45">
          Set{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-teal-200/90">
            NEXT_PUBLIC_INTRO_VIDEO_URL
          </code>{" "}
          in{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">
            .env.local
          </code>
          : a YouTube or Vimeo link, or a direct path to an MP4/WebM file.
        </p>
      </div>
    </div>
  );
}
