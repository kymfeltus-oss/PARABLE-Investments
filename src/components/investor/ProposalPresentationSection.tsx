import Link from 'next/link';

/**
 * Top of the proposal tab: reserved video area and primary CTA into the book-a-meeting flow (`/book`).
 * Add an MP4 under public/videos or set NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL and wire a player when ready.
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
        Video coming soon. When your file is ready, host it in{' '}
        <code className="rounded bg-white/10 px-1">public/videos</code> or set{' '}
        <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL</code>, then connect it here.
      </p>
      <div
        className="flex w-full min-h-[min(40dvh,22rem)] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-black/40 p-6 text-center sm:min-h-0"
        style={{ aspectRatio: '16/9' }}
        role="img"
        aria-label="Placeholder for upcoming strategic presentation video"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Video placeholder</span>
        <span className="max-w-sm text-pretty text-[11px] leading-relaxed text-white/35 sm:text-xs">
          This space will show your dedicated proposal presentation. The full-screen intro on this route is unchanged; only this block is a placeholder.
        </span>
      </div>

      <div className="mt-6 flex w-full justify-center">
        <Link
          href="/book"
          className="w-full max-w-md rounded-sm bg-[#00f2ff] px-5 py-3.5 text-center text-sm font-bold tracking-tight text-black transition hover:brightness-105 active:brightness-95 sm:py-4 sm:text-base"
        >
          Begin Partnership Discussions
        </Link>
      </div>
    </section>
  );
}
