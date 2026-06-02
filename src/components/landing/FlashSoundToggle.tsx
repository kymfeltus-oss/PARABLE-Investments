"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FLASH_AMBIENT_AUDIO_SRC, FLASH_AMBIENT_VOLUME } from "@/config/flash-audio";
import styles from "@/components/landing/flash-landing.module.css";

type FlashSoundToggleProps = {
  className?: string;
};

/**
 * Top-right ambient sound control — starts muted (autoplay policy safe).
 */
export default function FlashSoundToggle({ className }: FlashSoundToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(FLASH_AMBIENT_AUDIO_SRC);
    audio.loop = true;
    audio.volume = FLASH_AMBIENT_VOLUME;
    audio.preload = "none";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggleSound = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Playback blocked by browser:", err);
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }, []);

  const label = isPlaying ? "Sound on" : "Sound";

  return (
    <button
      type="button"
      className={`${styles.soundToggle} ${isPlaying ? styles.soundToggleActive : ""} ${className ?? ""}`.trim()}
      onClick={() => void toggleSound()}
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
      aria-pressed={isPlaying}
    >
      <span className={styles.soundToggleLabel}>{label}</span>
      <span className={styles.soundWaveOrb} aria-hidden="true">
        <span className={`${styles.soundWaveBar} ${!isPlaying ? styles.pausedAnimation : ""}`} />
        <span className={`${styles.soundWaveBar} ${!isPlaying ? styles.pausedAnimation : ""}`} />
        <span className={`${styles.soundWaveBar} ${!isPlaying ? styles.pausedAnimation : ""}`} />
      </span>
    </button>
  );
}
