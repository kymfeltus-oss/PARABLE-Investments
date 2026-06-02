/**
 * Ambient loop for flash intro sound toggle.
 * Add `public/brand/pitchlock-ambient.mp3` or set NEXT_PUBLIC_FLASH_AMBIENT_URL.
 */
export const FLASH_AMBIENT_AUDIO_SRC =
  process.env.NEXT_PUBLIC_FLASH_AMBIENT_URL ?? "/brand/pitchlock-ambient.mp3";

export const FLASH_AMBIENT_VOLUME = 0.5;
