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
    const onReady = () => tryPlayPreferSound();
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();
    else el.addEventListener('canplay', onReady, { once: true });
    return () => {
      el.removeEventListener('canplay', onReady);
    };
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
          loop
          playsInline
          preload="auto"
          aria-label="Welcome to Parable"
        />
      </div>
      {soundBlocked || muted ? (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center px-3">
          <button
            type="button"
            onClick={enableSound}
            className="rounded-lg border border-[#00f2ff]/40 bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff] backdrop-blur-sm hover:bg-[#00f2ff]/10"
          >
            Enable sound
          </button>
        </div>
      ) : null}
    </div>
  );
}
