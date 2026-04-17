/**
 * Supabase Storage images must use the `render` transform API — never raw `/object/public/` in `<img src>`.
 * @see https://supabase.com/docs/guides/storage/serving/image-transformations
 */

export const SUPABASE_OBJECT_PUBLIC_MARKER = "/storage/v1/object/public/";

export const SUPABASE_IMAGE_PLACEHOLDER_TRANSPARENT =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export const SUPABASE_IMAGE_PLACEHOLDER_50 =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="%23111"/></svg>',
  );

function transformDisabled(): boolean {
  try {
    const v = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORM;
    if (v === undefined || v === "") return false;
    return v === "0";
  } catch {
    return false;
  }
}

const PROXY_OBJECT = "/supabase-proxy/storage/v1/object/public/";
const PROXY_RENDER = "/supabase-proxy/storage/v1/render/image/public/";

const OBJECT_PUBLIC_PATH_RE = /\/storage\/v1\/object\/public\//i;

function replaceObjectPublicPathWithRender(pathOrUrl: string): string | null {
  const m = pathOrUrl.match(OBJECT_PUBLIC_PATH_RE);
  if (!m || m.index === undefined) return null;
  const i = m.index;
  const rest = pathOrUrl.slice(i + m[0].length);
  return `${pathOrUrl.slice(0, i)}/storage/v1/render/image/public/${rest}`;
}

export function isRawSupabaseStorageObjectUrl(url: string): boolean {
  if (!url) return false;
  return OBJECT_PUBLIC_PATH_RE.test(url) || url.includes(PROXY_OBJECT);
}

export function isSupabaseStorageRenderUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("/storage/v1/render/image/public/") ||
    lower.includes("/supabase-proxy/storage/v1/render/image/public/")
  );
}

export function isSupabaseImageDataPlaceholder(url: string): boolean {
  return (
    url === SUPABASE_IMAGE_PLACEHOLDER_TRANSPARENT ||
    url === SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX ||
    url === SUPABASE_IMAGE_PLACEHOLDER_50
  );
}

function warnIfNotUsingRenderImagePath(url: string): void {
  if (!url || url.startsWith("data:")) return;
  const lower = url.toLowerCase();
  if (!lower.includes("/storage/")) return;
  if (lower.includes("/render/image/")) return;
  console.warn("⚠️ BLOCKING RAW IMAGE:", url);
}

function hasTransformWidthInQuery(url: string): boolean {
  const q = url.indexOf("?");
  if (q < 0) return false;
  try {
    const params = new URLSearchParams(url.slice(q + 1));
    const w = params.get("width");
    if (w == null || w === "") return false;
    const n = Number(w);
    return Number.isFinite(n) && n > 0;
  } catch {
    return false;
  }
}

function hasWebpFormatInQuery(url: string): boolean {
  const q = url.indexOf("?");
  if (q < 0) return false;
  try {
    const fmt = new URLSearchParams(url.slice(q + 1)).get("format");
    return fmt != null && fmt.toLowerCase() === "webp";
  } catch {
    return false;
  }
}

function requiresSupabaseRenderTransform(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes("/storage/v1/")) return true;
  if (lower.includes("/supabase-proxy/storage/")) return true;
  if (lower.includes("supabase.co") && lower.includes("/storage/")) return true;
  return false;
}

function isStrictSupabaseRenderWebpUrl(url: string): boolean {
  if (!isSupabaseStorageRenderUrl(url)) return false;
  if (OBJECT_PUBLIC_PATH_RE.test(url) || url.includes(PROXY_OBJECT)) return false;
  if (!hasTransformWidthInQuery(url) || !hasWebpFormatInQuery(url)) return false;
  return true;
}

function allowSkipOptimization(url: string): boolean {
  if (!transformDisabled()) return false;
  if (isRawSupabaseStorageObjectUrl(url)) return false;
  if (url.includes(PROXY_OBJECT)) return false;
  const lower = url.toLowerCase();
  if (lower.includes("supabase.co") && lower.includes("/storage/")) return false;
  if (lower.includes("/supabase-proxy/storage/")) return false;
  return true;
}

export function devWarnIfRawObjectUrlInDev(componentName: string, url: string | null | undefined): void {
  if (process.env.NODE_ENV !== "development") return;
  if (!url || url.startsWith("data:")) return;
  if (OBJECT_PUBLIC_PATH_RE.test(url) || url.includes("/supabase-proxy/storage/v1/object/public/")) {
    console.warn(`[SupabaseImage] ${componentName} rendered raw object/public URL.`, url.slice(0, 220));
  }
}

export function domSafeSupabaseImageSrc(
  componentName: string,
  url: string,
  opts: { width: number; height?: number; quality?: number; format?: "origin" | "webp" },
): string {
  const out = optimizeSupabasePublicImageUrl(url, opts);
  devWarnIfRawObjectUrlInDev(componentName, out);
  return out;
}

export function optimizeSupabaseAvatarUrl(url: string, width = 72): string {
  return optimizeSupabasePublicImageUrl(url, {
    width: Math.max(48, Math.min(width, 96)),
    quality: 76,
    format: "webp",
  });
}

export function optimizeSupabaseFeedThumbnailUrl(url: string, width = 640): string {
  return optimizeSupabasePublicImageUrl(url, {
    width: Math.max(320, Math.min(width, 800)),
    quality: 78,
    format: "webp",
  });
}

function finalizeSupabaseImageCandidate(originalInput: string, candidate: string): string {
  if (!candidate.startsWith("data:")) {
    if (OBJECT_PUBLIC_PATH_RE.test(candidate) || candidate.includes(PROXY_OBJECT)) {
      warnIfNotUsingRenderImagePath(originalInput || candidate);
      return SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX;
    }
  }

  const o = originalInput;
  const inputWasRawObject = isRawSupabaseStorageObjectUrl(o) && !isSupabaseStorageRenderUrl(o);

  if (inputWasRawObject) {
    if (isStrictSupabaseRenderWebpUrl(candidate)) return candidate;
    warnIfNotUsingRenderImagePath(o);
    return SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX;
  }

  if (isSupabaseStorageRenderUrl(candidate) && !isStrictSupabaseRenderWebpUrl(candidate)) {
    warnIfNotUsingRenderImagePath(o);
    return SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX;
  }

  return candidate;
}

export function optimizeSupabasePublicImageUrl(
  url: string,
  opts: { width: number; height?: number; quality?: number; format?: "origin" | "webp" } = {
    width: 256,
    quality: 78,
    format: "webp",
  },
): string {
  const originalInput = url;
  if (!url || url.startsWith("data:") || url === "/logo.svg") return url;

  if (allowSkipOptimization(url)) return url;

  if (!requiresSupabaseRenderTransform(url)) {
    return url;
  }

  const w = Math.max(48, Math.min(opts.width, 2048));
  const q = Math.max(30, Math.min(opts.quality ?? 78, 100));
  const deliveryFormat = "webp";

  const qm = url.indexOf("?");
  const base = qm >= 0 ? url.slice(0, qm) : url;
  const existing = qm >= 0 ? new URLSearchParams(url.slice(qm + 1)) : new URLSearchParams();

  const applyParams = (targetBase: string) => {
    existing.set("width", String(w));
    existing.set("quality", String(q));
    existing.set("resize", "cover");
    existing.set("format", deliveryFormat);
    if (opts.height) existing.set("height", String(opts.height));
    const qs = existing.toString();
    return qs ? `${targetBase}?${qs}` : targetBase;
  };

  const baseLower = base.toLowerCase();
  let out: string;
  if (baseLower.includes("/storage/v1/render/image/public/")) {
    out = applyParams(base);
  } else if (OBJECT_PUBLIC_PATH_RE.test(base)) {
    const rebuilt = replaceObjectPublicPathWithRender(base);
    out = rebuilt ? applyParams(rebuilt) : SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX;
  } else if (base.includes(PROXY_OBJECT)) {
    out = applyParams(base.replace(PROXY_OBJECT, PROXY_RENDER));
  } else {
    const rebuilt = replaceObjectPublicPathWithRender(base);
    out = rebuilt ? applyParams(rebuilt) : SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX;
  }

  if (isRawSupabaseStorageObjectUrl(out)) {
    return finalizeSupabaseImageCandidate(originalInput, SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX);
  }

  const finalized = finalizeSupabaseImageCandidate(originalInput, out);
  if (isSupabaseImageDataPlaceholder(finalized)) return finalized;
  if (!isStrictSupabaseRenderWebpUrl(finalized)) {
    warnIfNotUsingRenderImagePath(originalInput);
    return SUPABASE_IMAGE_PLACEHOLDER_GRAY_1PX;
  }
  return finalized;
}

export function enforceRenderUrlOrPlaceholder(url: string, maxWidth: number = 50): string {
  return optimizeSupabasePublicImageUrl(url, {
    width: Math.max(48, Math.min(maxWidth, 2048)),
    quality: 78,
    format: "webp",
  });
}

export function warnIfSupabaseObjectUrlNotTransformed(_before: string, _after: string): void {
  void _before;
  void _after;
}
