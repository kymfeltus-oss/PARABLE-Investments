/**
 * Investor-facing map of the five PARABLE pillars — matches the in-browser demo (`ParableInteractiveDemo`) tabs.
 * Shown on `/explore` near the embedded iframe or preview.
 */
export function ExploreDemoFocusGuide() {
  const areas = [
    {
      n: '01',
      title: 'Live faith & broadcast',
      lead: 'Services and teaching with tools built for real gatherings—not generic streaming.',
      bullets: [
        'Go live with broadcast-style controls and presence.',
        'Teleprompter + AI-assisted outline help for leaders.',
        'Glory signals: moment energy that compounds across the session.',
        'Praise break & altar call: atmosphere shifts investors can feel in the demo.',
      ],
    },
    {
      n: '02',
      title: 'One hybrid surface',
      lead: 'One app where stream, session play, and social context stay connected.',
      bullets: [
        'Live video as the spine of the experience.',
        'Light progression / XP so participation feels rewarded.',
        'Social feed context—without opening a separate “social app.”',
      ],
    },
    {
      n: '03',
      title: 'Creator studio & Shed',
      lead: 'Structured creation (shorts + drama) and a music-native collaboration lane.',
      bullets: [
        'Studio: short-form or episodic storyboard.',
        'Casting: AI-assisted or on-camera talent.',
        'Shed: rehearsal / jam space with low-latency audio feel.',
      ],
    },
    {
      n: '04',
      title: 'Fellowship & gatherings',
      lead: 'Rooms and chat for groups—before, during, and after the stream.',
      bullets: [
        'Fellowship chat with real-time identity.',
        'Built for how communities actually gather online.',
      ],
    },
    {
      n: '05',
      title: 'In-app economy & access',
      lead: 'Parable Money, tickets, and seeds—value that can move inside PARABLE.',
      bullets: [
        'Seeds: support in the moment (demo ledger).',
        'Parable Money balance and ticketed events.',
        'Walk the revenue story end-to-end without leaving the product.',
      ],
    },
  ] as const;

  return (
    <section
      className="mt-10 space-y-6 md:mt-12"
      aria-labelledby="demo-focus-heading"
    >
      <div className="text-center">
        <h2
          id="demo-focus-heading"
          className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f2ff]/75"
        >
          Five pillars — what to explore
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-white/55">
          The preview uses the same five pillars as the bottom navigation: Live, Hybrid, Studio, Gather, and Money. Use
          this checklist as you tap through—or as you navigate the embedded app when a prototype URL is configured.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {areas.map((area) => (
          <article
            key={area.n}
            className="rounded-xl border border-[#00f2ff]/20 bg-black/45 px-5 py-6 shadow-[0_0_32px_rgba(0,242,255,0.06)] backdrop-blur-sm md:px-6 md:py-7"
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-[11px] font-bold tabular-nums text-[#00f2ff]/55">{area.n}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#00f2ff] sm:text-[15px]">
                  {area.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60 sm:text-sm">{area.lead}</p>
                <ul className="mt-4 space-y-2.5 border-t border-white/[0.08] pt-4 text-left text-[12px] leading-relaxed text-white/50 sm:text-[13px]">
                  {area.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#00f2ff]/70" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
