'use client';

import { useCallback, useMemo, useState } from 'react';
import { getLiveMeetingVideoCandidateUrls } from '@/lib/meet-live-meeting-video';
import { useParableVideoAudio } from '@/hooks/useParableVideoAudio';

type Props = {
  /** Match prior welcome clip behavior while the user reads overlays. */
  loop?: boolean;
  className?: string;
};

const CANDIDATES = getLiveMeetingVideoCandidateUrls();

/**
 * Full-bleed **Live Meeting.mp4** (or `NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL`) behind meet UI.
 * Mute control is pointer-events so overlays can sit above in a portal.
 */
export function LiveMeetingVideoBackdrop({ loop = true, className = '' }: Props) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const videoSrc = useMemo(
    () => CANDIDATES[Math.min(srcIndex, CANDIDATES.length - 1)]!,
    [srcIndex],
  );

  const { videoRef, muted, toggleMute } = useParableVideoAudio(videoSrc);

  const onVideoError = useCallback(() => {
    setSrcIndex((prev) => {
      const next = prev + 1;
      if (next < CANDIDATES.length) {
        queueMicrotask(() => setLoadError(false));
        return next;
      }
      queueMicrotask(() => setLoadError(true));
      return prev;
    });
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-black ${className}`}>
      <video
        key={videoSrc}
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        src={videoSrc}
        playsInline
        preload="auto"
        muted={muted}
        loop={loop}
        onError={onVideoError}
        aria-label="Live meeting briefing"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/20 to-black/85"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[min(34vh,11rem)] w-[min(60vw,17rem)] bg-gradient-to-tl from-black from-[8%] via-black/93 to-transparent md:hidden"
        aria-hidden
      />

      {loadError ? (
        <p className="pointer-events-none absolute left-4 right-4 top-[max(4rem,env(safe-area-inset-top)+2rem)] z-[5] text-pretty text-center text-[11px] leading-relaxed text-amber-200/90 drop-shadow-md sm:text-xs">
          Add <code className="rounded bg-black/50 px-1">public/videos/Live Meeting.mp4</code> or set{' '}
          <code className="rounded bg-black/50 px-1">NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL</code>.
        </p>
      ) : null}

      <div className="pointer-events-auto absolute bottom-[max(6.5rem,env(safe-area-inset-bottom)+5rem)] left-4 z-[5] sm:left-6">
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={muted}
          className="rounded-lg border border-white/25 bg-black/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm hover:bg-black/75"
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  );
}
