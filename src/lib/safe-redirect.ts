const DEFAULT_AFTER_NDA = "/dashboard/investor";

/** Allowed internal redirect targets after NDA signing. */
const ALLOWED_PREFIXES = ["/dashboard/", "/pitch", "/nda", "/meet", "/book", "/documents", "/questions", "/interest"];

/**
 * Returns a safe same-origin path for post-sign redirect.
 * Rejects external URLs, protocol-relative URLs, and malformed paths.
 */
export function resolveSafeRedirectPath(next: string | null | undefined): string {
  if (!next?.trim()) return DEFAULT_AFTER_NDA;

  const raw = next.trim();
  if (!raw.startsWith("/") || raw.startsWith("//")) return DEFAULT_AFTER_NDA;
  if (raw.includes("://") || raw.includes("\\")) return DEFAULT_AFTER_NDA;

  const pathOnly = raw.split("?")[0]?.split("#")[0] ?? raw;
  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`) || pathOnly.startsWith(prefix)
  );

  if (!allowed) return DEFAULT_AFTER_NDA;
  return raw;
}
