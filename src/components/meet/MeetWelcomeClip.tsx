'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const WELCOME_SRC = '/videos/Welcome.mp4';

type Props = {
  /** Edge-to-edge viewport video (welcome step overlay). */
  fullscreen?: boolean;
};

/**
 * Welcome loop before joining — volume on by default when autoplay allows; otherwise muted until Unmute.
 * Mute / Unmute is always available.
 */
export function MeetWelcomeClip({ fullscreen = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const tryPlayPreferSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = 1;
    el.muted = false;
    setMuted(false);
    void el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      void el.play().catch(() => {});
    });
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onReady = () => {
      setHasEnded(false);
      tryPlayPreferSound();
    };
    const onEnded = () => setHasEnded(true);
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();
    else el.addEventListener('canplay', onReady, { once: true });
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('canplay', onReady);
      el.removeEventListener('ended', onEnded);
    };
  }, [tryPlayPreferSound]);

  const replay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setHasEnded(false);
    el.currentTime = 0;
    tryPlayPreferSound();
  }, [tryPlayPreferSound]);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.muted) {
      el.volume = 1;
      el.muted = false;
      setMuted(false);
      void el.play().catch(() => {
        el.muted = true;
        setMuted(true);
        void el.play().catch(() => {});
      });
    } else {
      el.muted = true;
      setMuted(true);
    }
  }, []);

  if (fullscreen) {
    return (
      <div className="absolute inset-0 min-h-[100dvh] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 min-h-full min-w-full object-cover"
          src={WELCOME_SRC}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          aria-label="Welcome to Parable"
        />
        <div className="absolute bottom-[max(7.5rem,calc(env(safe-area-inset-bottom)+6rem))] left-0 right-0 z-20 flex flex-wrap items-center justify-center gap-2 px-3">
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={muted}
            className="rounded-lg border border-[#00f2ff]/40 bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff] backdrop-blur-sm hover:bg-[#00f2ff]/10"
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
          {hasEnded ? (
            <button
              type="button"
              onClick={replay}
              className="rounded-lg border border-white/25 bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm hover:bg-white/10"
            >
              Replay welcome
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] shadow-inner">
      <div className="aspect-video w-full bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={WELCOME_SRC}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          aria-label="Welcome to Parable"
        />
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex flex-wrap items-center justify-center gap-2 px-3">
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={muted}
          className="rounded-lg border border-[#00f2ff]/40 bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff] backdrop-blur-sm hover:bg-[#00f2ff]/10"
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
        {hasEnded ? (
          <button
            type="button"
            onClick={replay}
            className="rounded-lg border border-white/25 bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm hover:bg-white/10"
          >
            Replay welcome
          </button>
        ) : null}
      </div>
    </div>
  );
}
