import Link from 'next/link';
import { ProposalIntroVideo } from '@/components/investor/ProposalIntroVideo';
import { hrefWithFromProposal } from '@/lib/proposal-deck-return';

/**
 * Top of the proposal tab: proposal intro video and primary CTA into the book-a-meeting flow (`/book`).
 * Local default: `public/videos/Propsal Intro Video.mp4` — override with `NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL`.
 */
export function ProposalPresentationSection() {
  return (
    <section
      className="mx-auto w-full max-w-5xl border-b border-white/10 px-4 pb-8 pt-1"
      aria-labelledby="proposal-presentation-heading"
    >
      <h2
        id="proposal-presentation-heading"
        className="mb-2 text-center text-sm font-bold uppercase tracking-[0.2em] text-white/80 sm:text-base"
      >
        Strategic presentation
      </h2>
      <p className="mb-4 text-center text-[11px] text-white/45 sm:text-xs">
        Proposal intro video — then open the full deck from the <strong className="text-white/55">→ PROPOSAL</strong>{' '}
        control (moment &amp; full-screen Gamma deck).
      </p>
      <div className="w-full min-w-0" aria-label="Proposal intro video">
        <ProposalIntroVideo />
      </div>

      <div className="mt-6 flex w-full justify-center">
        <Link
          href={hrefWithFromProposal('/book/moment', true)}
          className="w-full max-w-md rounded-sm bg-[#00f2ff] px-5 py-3.5 text-center text-sm font-bold tracking-tight text-black transition hover:brightness-105 active:brightness-95 sm:py-4 sm:text-base"
        >
          Begin Partnership Discussions
        </Link>
      </div>
    </section>
  );
}
