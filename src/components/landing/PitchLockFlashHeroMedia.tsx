"use client";

import { useEffect, useRef } from "react";

/** Hero intro loop — `public/brand/pitchlock-flash.mp4` */
export const PITCHLOCK_FLASH_VIDEO_SRC = "/brand/pitchlock-flash.mp4";

type PitchLockFlashHeroMediaProps = {
  className?: string;
};

/**
 * Autoplaying muted hero loop for flash intro (browser policy-safe).
 */
export default function PitchLockFlashHeroMedia({ className }: PitchLockFlashHeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const play = () => {
      void video.play().catch(() => {
        /* autoplay blocked until user gesture — acceptable on strict browsers */
      });
    };
    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={PITCHLOCK_FLASH_VIDEO_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      style={{ pointerEvents: "none" }}
    />
  );
}
