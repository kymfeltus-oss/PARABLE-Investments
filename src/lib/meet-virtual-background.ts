/**
 * Helpers for LiveKit `@livekit/track-processors` virtual backgrounds:
 * blur strength, preset images, and upload normalization (cover-fit to HD frame).
 */

export const VIRTUAL_BG_WIDTH = 1280;
export const VIRTUAL_BG_HEIGHT = 720;

/** Tuned for background-only blur; higher values bleed past the segmentation edge. */
export const BLUR_STRENGTH = {
  light: 6,
  medium: 9,
  strong: 12,
} as const;

export type BlurStrength = keyof typeof BLUR_STRENGTH;

export const MEET_BG_PRESETS = [
  { id: 'dark-gradient', label: 'Dark gradient' },
  { id: 'navy', label: 'Deep navy' },
  { id: 'slate', label: 'Cool slate' },
  { id: 'warm-gray', label: 'Warm gray' },
  { id: 'cyan-mist', label: 'Cyan mist' },
] as const;

export type MeetBgPresetId = (typeof MEET_BG_PRESETS)[number]['id'];

function loadImageFromUrl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

/** Build a 1280×720 JPEG data URL for preset virtual backgrounds (no external assets). */
export function createPresetBackgroundDataUrl(preset: MeetBgPresetId): string {
  const w = VIRTUAL_BG_WIDTH;
  const h = VIRTUAL_BG_HEIGHT;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  switch (preset) {
    case 'dark-gradient': {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#0a0e14');
      g.addColorStop(0.45, '#121a22');
      g.addColorStop(1, '#050608');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'navy': {
      const g = ctx.createRadialGradient(w * 0.35, h * 0.2, 0, w * 0.5, h * 0.5, h * 0.85);
      g.addColorStop(0, '#1e3a5f');
      g.addColorStop(1, '#0a1628');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'slate': {
      const g = ctx.createLinearGradient(0, h, w, 0);
      g.addColorStop(0, '#2d3748');
      g.addColorStop(1, '#1a202c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'warm-gray': {
      const g = ctx.createLinearGradient(w, 0, 0, h);
      g.addColorStop(0, '#3d3830');
      g.addColorStop(1, '#1f1c18');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case 'cyan-mist': {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, h * 0.9);
      g.addColorStop(0, '#0c2a32');
      g.addColorStop(0.4, '#0a1a20');
      g.addColorStop(1, '#04080a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0, 242, 255, 0.06)';
      ctx.fillRect(0, 0, w, h);
      break;
    }
    default:
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, w, h);
  }

  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Scale/crop user image to 16:9 HD cover (matches typical webcam frame), so VirtualBackground fills the frame cleanly.
 */
export async function prepareUploadedBackgroundImage(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImageFromUrl(objectUrl);
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) throw new Error('Invalid image size');

    const W = VIRTUAL_BG_WIDTH;
    const H = VIRTUAL_BG_HEIGHT;
    const scale = Math.max(W / iw, H / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (W - dw) / 2;
    const dy = (H - dh) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, dx, dy, dw, dh);
    return canvas.toDataURL('image/jpeg', 0.92);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
