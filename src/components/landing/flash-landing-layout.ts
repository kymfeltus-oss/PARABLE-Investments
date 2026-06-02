/**
 * Pitch Lock flash landing — responsive layout contract.
 *
 * REFERENCE VIEWPORT (source of truth):
 * - Laptop / desktop landscape, min-width 1024px, aspect wider than 8∶9
 * - Hotspot % positions in PitchLockFlashPage are tuned against this size
 * - Art: public/brand/pitchlock-flash.mp4 (hero loop; ~8∶9)
 *
 * Smaller viewports only scale the stage down via transform — do not redesign
 * hotspot coordinates per device unless the PNG asset changes.
 */

/** Min width treated as laptop/desktop reference */
export const FLASH_REFERENCE_MIN_WIDTH_PX = 1024;

/** Large desktop enhancement */
export const FLASH_LARGE_DESKTOP_MIN_WIDTH_PX = 1440;

/** Tablet / iPad (below reference) */
export const FLASH_TABLET_MAX_WIDTH_PX = 1023;

/** Mobile phone */
export const FLASH_MOBILE_MAX_WIDTH_PX = 767;

/** Flyer aspect ratio (width / height) */
export const FLASH_ARTWORK_ASPECT = "8 / 9";

/**
 * Stage scale relative to reference (1 = design size on laptop/desktop).
 * Adjust reference scale here; tablet/mobile inherit proportionally.
 */
export const FLASH_STAGE_SCALE = {
  reference: 1.44,
  largeDesktop: 1.52,
  tablet: 1.18,
  mobile: 1.06,
  mobilePortrait: 1,
} as const;
