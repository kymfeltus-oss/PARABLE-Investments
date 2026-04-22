'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

const VIDEO_SRC = '/videos/Welcome.mp4';

export type InfoIntroVideoPageProps = {
  /** “Back” link in the header (default: choice hub). */
  backHref?: string;
  /** Route after Skip, Continue, or when the video ends (default: `/info`). */
  continueHref?: string;
  /** Primary CTA under the player. */
  continueButtonLabel?: string;
};

/**
 * Welcome video — used at `/info/intro` (→ materials) and `/investor/portal` (→ proposal deck).
 */
export function InfoIntroVideoPage({
  backHref = '/start',
  continueHref = '/info',
  continueButtonLabel = 'Continue to materials',
}: InfoIntroVideoPageProps = {}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const goNext = useCallback(() => {
    router.push(continueHref);
  }, [router, continueHref]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      el.volume = 1;
      el.muted = false;
      void el.play().catch(() => {
        el.muted = true;
        void el.play().catch(() => {});
      });
    };

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) tryPlay();
    else el.addEventListener('canplay', tryPlay, { once: true });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#060708] text-white">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <Link href={backHref} className="parable-eyebrow text-xs hover:text-[#00f2ff]">
          ← Choice hub
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:bg-white/10"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(0,242,255,0.12)_0%,#060708_70%)]"
          aria-hidden
        />
        <video
          ref={videoRef}
          className="relative z-10 max-h-[min(72dvh,720px)] max-w-full rounded-lg object-contain mix-blend-lighten shadow-2xl"
          src={VIDEO_SRC}
          playsInline
          preload="auto"
          onEnded={goNext}
        />
      </div>

      <div className="shrink-0 space-y-4 border-t border-white/10 px-4 py-6 text-center">
        <button
          type="button"
          onClick={() => {
            const el = videoRef.current;
            if (el) el.muted = !el.muted;
          }}
          className="text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff]/80 hover:text-[#00f2ff]"
        >
          Toggle sound
        </button>
        <div>
          <button
            type="button"
            onClick={goNext}
            className="rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-8 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.15)] transition hover:bg-[#00f2ff]/20"
          >
            {continueButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
