'use client';

import Link from 'next/link';
import { startTransition, useEffect, useState } from 'react';
import {
  PROPOSAL_DECK_HREF,
  hasProposalDeckVisitedInSession,
  isFromProposalInUrlSearch,
} from '@/lib/proposal-deck-return';

type Props = {
  className?: string;
};

/**
 * When the user has visited the Gamma deck this session, or used `?fromProposal=1`, show a path back
 * to the full-screen deck (iframe will reload; slide position is controlled by Gamma).
 */
export function ReturnToProposalDeck({ className = '' }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const v =
      typeof window !== 'undefined' &&
      (isFromProposalInUrlSearch(window.location.search) || hasProposalDeckVisitedInSession());
    startTransition(() => setShow(v));
  }, []);

  if (!show) return null;

  return (
    <div
      className={`rounded-xl border border-[#00f2ff]/20 bg-[#00f2ff]/[0.07] px-4 py-3 text-left text-[11px] leading-snug sm:text-xs ${className}`}
    >
      <Link
        href={PROPOSAL_DECK_HREF}
        className="block font-bold uppercase tracking-[0.14em] text-[#00f2ff] transition hover:text-[#00f2ff]/90"
      >
        ← Return to strategic proposal
      </Link>
      <p className="mt-1.5 text-white/45">Gamma may reload the deck; scroll or navigate inside the embed as needed.</p>
    </div>
  );
}
