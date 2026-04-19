'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const WELCOME_SRC = '/videos/Welcome.mp4';

/**
 * Welcome loop before joining — prefers audible playback; falls back to muted autoplay
 * when the browser blocks sound until the user taps “Enable sound”.
 */
export function MeetWelcomeClip() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const tryPlayPreferSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    void el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      setSoundBlocked(true);
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

  const enableSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    setSoundBlocked(false);
    void el.play().catch(() => {});
  }, []);

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
      {soundBlocked || muted || hasEnded ? (
        <div className="absolute bottom-3 left-0 right-0 flex flex-wrap items-center justify-center gap-2 px-3">
          {soundBlocked || muted ? (
            <button
              type="button"
              onClick={enableSound}
              className="rounded-lg border border-[#00f2ff]/40 bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff] backdrop-blur-sm hover:bg-[#00f2ff]/10"
            >
              Enable sound
            </button>
          ) : null}
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
      ) : null}
    </div>
  );
}
