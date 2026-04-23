import { INVESTOR_SITE_URL } from '@/lib/investor-site';

/** In-app path to the Gamma deck (same on all environments). */
export const PROPOSAL_DECK_PATH = '/investor/portal/proposal/deck' as const;

/**
 * Return links (e.g. from book flow) use this full URL so “back” always targets the live deck at
 * https://parableinvestments.com/investor/portal/proposal/deck
 */
export const PROPOSAL_DECK_HREF = `${INVESTOR_SITE_URL}${PROPOSAL_DECK_PATH}` as const;

const VISITED_KEY = 'parable:proposal_deck_visited';

/** Call when the Gamma embed page loads so we can show “return to deck” on other routes. */
export function markProposalDeckVisited(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(VISITED_KEY, '1');
  } catch {
    /* private mode / quota */
  }
}

export function hasProposalDeckVisitedInSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(VISITED_KEY) === '1';
  } catch {
    return false;
  }
}

export function isFromProposalInUrlSearch(search: string): boolean {
  try {
    return new URLSearchParams(search).get('fromProposal') === '1';
  } catch {
    return false;
  }
}

/** For links that leave the proposal book funnel — start `?` or add `&`. */
export function hrefWithFromProposal(href: string, include: boolean): string {
  if (!include) return href;
  if (href.includes('?')) return `${href}${href.endsWith('?') || href.endsWith('&') ? '' : '&'}fromProposal=1`;
  return `${href}?fromProposal=1`;
}
