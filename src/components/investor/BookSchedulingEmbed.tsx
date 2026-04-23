'use client';

type Props = {
  embedSrc: string;
  /** Default copy references calendar then confirmation email. */
  stepLabel?: string;
  body?: string;
};

export function BookSchedulingEmbed({
  embedSrc,
  stepLabel = 'Choose a time',
  body = 'Pick a slot. Your calendar provider may send a separate confirmation. After booking, use the section below to save your meeting record and request the Parable email with your video room and room ID.',
}: Props) {
  return (
    <section
      id="book-schedule-embed"
      className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 shadow-[0_8px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6"
    >
      <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">{stepLabel}</h2>
      <p className="mt-2 text-sm text-white/50">{body}</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <iframe
          title="Schedule a meeting"
          src={embedSrc}
          className="h-[min(720px,80vh)] w-full border-0"
          loading="lazy"
        />
      </div>
    </section>
  );
}
