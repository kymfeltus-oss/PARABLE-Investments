'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tries unmuted autoplay with volume 1; falls back to muted if the browser blocks it.
 * Re-run when `playKey` changes (e.g. new `src`).
 */
export function useParableVideoAudio(playKey: string | number) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

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
    const onReady = () => tryPlayPreferSound();
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();
    else el.addEventListener('canplay', onReady, { once: true });
    return () => el.removeEventListener('canplay', onReady);
  }, [playKey, tryPlayPreferSound]);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    el.volume = 1;
    setMuted(next);
    void el.play().catch(() => {});
  }, []);

  return { videoRef, muted, toggleMute };
}
