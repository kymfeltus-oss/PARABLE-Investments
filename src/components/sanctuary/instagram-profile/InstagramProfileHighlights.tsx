"use client";

const HIGHLIGHTS = [
  { id: "h1", label: "Faith" },
  { id: "h2", label: "Live" },
  { id: "h3", label: "Worship" },
  { id: "h4", label: "Community" },
  { id: "h5", label: "Studio" },
];

export default function InstagramProfileHighlights() {
  return (
    <div className="border-b border-white/[0.08]">
      <div className="flex gap-4 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HIGHLIGHTS.map((h) => (
          <button
            key={h.id}
            type="button"
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-neutral-900 p-[2px]">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-[#00f2ff]/30 to-neutral-800" />
            </div>
            <span className="max-w-[72px] truncate text-[11px] text-neutral-300">{h.label}</span>
          </button>
        ))}
        <button type="button" className="flex shrink-0 flex-col items-center gap-1.5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/25">
            <span className="text-2xl font-light text-neutral-500">+</span>
          </div>
          <span className="text-[11px] text-neutral-300">New</span>
        </button>
      </div>
    </div>
  );
}
