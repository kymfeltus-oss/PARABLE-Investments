/**
 * Pitch Lock flash landing — responsive layout contract.
 *
 * ARTWORK (source of truth):
 * - Master canvas 9∶16 @ 2160×3840
 * - Safe zone 70% × 70% centered (see docs/flash-artwork-9x16-spec.md)
 * - Display: object-fit: contain on all viewports
 * - Asset: public/brand/pitchlock-flash.mp4
 * - Designer template: public/brand/flash-artwork-master-9x16.svg
 */

/** Min width treated as laptop/desktop reference */
export const FLASH_REFERENCE_MIN_WIDTH_PX = 1024;

/** Large desktop enhancement */
export const FLASH_LARGE_DESKTOP_MIN_WIDTH_PX = 1440;

/** Tablet / iPad (below reference) */
export const FLASH_TABLET_MAX_WIDTH_PX = 1023;

/** Mobile phone */
export const FLASH_MOBILE_MAX_WIDTH_PX = 767;

/** Master artwork aspect ratio (width / height) */
export const FLASH_ARTWORK_ASPECT = "9 / 16";

export const FLASH_MASTER_SIZE = {
  width: 2160,
  height: 3840,
} as const;

export const FLASH_SAFE_ZONE_FRACTION = {
  inset: 0.15,
  size: 0.7,
} as const;
