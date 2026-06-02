/**
 * Flash intro media — 9∶16 master canvas (2160×3840).
 * Display: object-fit: contain (see flash-landing.module.css).
 * Safe zone: 70% × 70% centered — see docs/flash-artwork-9x16-spec.md
 */

/** Master canvas width / height */
export const FLASH_MASTER_WIDTH = 2160;
export const FLASH_MASTER_HEIGHT = 3840;

/** Width / height for layout math */
export const FLASH_MEDIA_ASPECT = 9 / 16;

/** Centered safe zone — fraction of full frame */
export const FLASH_SAFE_ZONE = {
  x: 0.15,
  y: 0.15,
  width: 0.7,
  height: 0.7,
} as const;

/**
 * Portal pill positions on pitchlock-flash.mp4 (0–1 of source frame).
 * Tuned for 9∶16 safe-zone layout under object-fit: contain.
 * Re-measure when the final MP4 is exported.
 */
export const FLASH_PORTAL_HITS_ON_MEDIA = {
  investor: { x: 0.17, y: 0.585, w: 0.3, h: 0.07 },
  presenter: { x: 0.53, y: 0.585, w: 0.3, h: 0.07 },
} as const;

export type PortalHitBoxPx = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ContainPortalLayout = {
  frame: { offsetX: number; offsetY: number; width: number; height: number };
  investor: PortalHitBoxPx;
  presenter: PortalHitBoxPx;
};

/** Map video-frame coordinates to screen pixels when object-fit is contain. */
export function computeContainPortalLayout(
  containerWidth: number,
  containerHeight: number,
): ContainPortalLayout {
  const containerAspect = containerWidth / containerHeight;
  let renderWidth: number;
  let renderHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (containerAspect > FLASH_MEDIA_ASPECT) {
    renderHeight = containerHeight;
    renderWidth = containerHeight * FLASH_MEDIA_ASPECT;
    offsetX = (containerWidth - renderWidth) / 2;
    offsetY = 0;
  } else {
    renderWidth = containerWidth;
    renderHeight = containerWidth / FLASH_MEDIA_ASPECT;
    offsetX = 0;
    offsetY = (containerHeight - renderHeight) / 2;
  }

  const toPx = (x: number, y: number, w: number, h: number): PortalHitBoxPx => ({
    left: offsetX + x * renderWidth,
    top: offsetY + y * renderHeight,
    width: w * renderWidth,
    height: h * renderHeight,
  });

  const inv = FLASH_PORTAL_HITS_ON_MEDIA.investor;
  const pres = FLASH_PORTAL_HITS_ON_MEDIA.presenter;

  return {
    frame: { offsetX, offsetY, width: renderWidth, height: renderHeight },
    investor: toPx(inv.x, inv.y, inv.w, inv.h),
    presenter: toPx(pres.x, pres.y, pres.w, pres.h),
  };
}

/** @deprecated Use computeContainPortalLayout — cover is not used for 9∶16 intro */
export function computeCoverPortalLayout(
  containerWidth: number,
  containerHeight: number,
): ContainPortalLayout {
  return computeContainPortalLayout(containerWidth, containerHeight);
}

/** Production intro always uses contain */
export function shouldUseContainPortalLayout(): boolean {
  return true;
}
