/**
 * Investor proposal iframe — white-labeled host (e.g. https://yourproject.com/…)
 * replaces third-party gamma.app/embed for DNS locality + brand-consistent viewer chrome.
 */

const UTM_STRIP_VALUES = new Set(['made-with-gamma', 'made_with_gamma']);

function withHttpsScheme(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

/** Removes known promo query pairs that correlate with “Made with Gamma” chrome when still on gamma.app. */
export function normalizeProposalEmbedSrc(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  let url: URL;
  try {
    url = new URL(withHttpsScheme(t));
  } catch {
    return t;
  }
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const v = url.searchParams.get(key);
    if (v && UTM_STRIP_VALUES.has(v.toLowerCase().replace(/\+/g, ' '))) {
      url.searchParams.delete(key);
    }
  }
  const src = url.searchParams.get('utm_source');
  if (src && /made[-_]with[-_]gamma/i.test(src)) {
    url.searchParams.delete('utm_source');
  }
  return url.toString();
}

export function proposalEmbedUrlFromEnv(): string {
  const a = process.env.NEXT_PUBLIC_GAMMA_PROPOSAL_URL?.trim() ?? '';
  if (a) return normalizeProposalEmbedSrc(a);
  const b = process.env.GAMMA_EMBED_URL?.trim() ?? '';
  return normalizeProposalEmbedSrc(b);
}

export function proposalEmbedOriginFromEnv(): string | null {
  const u = proposalEmbedUrlFromEnv();
  if (!u) return null;
  try {
    return new URL(withHttpsScheme(u)).origin;
  } catch {
    return null;
  }
}
