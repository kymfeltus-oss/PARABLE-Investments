/** pitchlock-flash.mp4 frame aspect (width / height). */
export const FLASH_MEDIA_ASPECT = 8 / 9;

/**
 * Portal pill positions on pitchlock-flash.mp4 (0–1 of source frame).
 * Tuned to baked-in pills under object-fit: cover.
 */
export const FLASH_PORTAL_HITS_ON_MEDIA = {
  investor: { x: 0.125, y: 0.635, w: 0.355, h: 0.092 },
  presenter: { x: 0.505, y: 0.635, w: 0.37, h: 0.092 },
} as const;

export type PortalHitBoxPx = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type CoverPortalLayout = {
  cover: { offsetX: number; offsetY: number; width: number; height: number };
  investor: PortalHitBoxPx;
  presenter: PortalHitBoxPx;
};

/** Map video-frame coordinates to screen pixels when object-fit is cover. */
export function computeCoverPortalLayout(
  containerWidth: number,
  containerHeight: number,
): CoverPortalLayout {
  const containerAspect = containerWidth / containerHeight;
  let renderWidth: number;
  let renderHeight: number;
  let offsetX: number;
  let offsetY: number;

  /* object-fit: cover — scale to fill; crop overflow on the long axis */
  if (containerAspect > FLASH_MEDIA_ASPECT) {
    renderWidth = containerWidth;
    renderHeight = containerWidth / FLASH_MEDIA_ASPECT;
    offsetX = 0;
    offsetY = (containerHeight - renderHeight) / 2;
  } else {
    renderHeight = containerHeight;
    renderWidth = containerHeight * FLASH_MEDIA_ASPECT;
    offsetX = (containerWidth - renderWidth) / 2;
    offsetY = 0;
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
    cover: { offsetX, offsetY, width: renderWidth, height: renderHeight },
    investor: toPx(inv.x, inv.y, inv.w, inv.h),
    presenter: toPx(pres.x, pres.y, pres.w, pres.h),
  };
}

/** object-fit: contain — full artwork visible, letterboxed */
export function computeContainPortalLayout(
  containerWidth: number,
  containerHeight: number,
): CoverPortalLayout {
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
    cover: { offsetX, offsetY, width: renderWidth, height: renderHeight },
    investor: toPx(inv.x, inv.y, inv.w, inv.h),
    presenter: toPx(pres.x, pres.y, pres.w, pres.h),
  };
}

export function shouldUseContainPortalLayout(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 760px) and (orientation: portrait)").matches;
}
