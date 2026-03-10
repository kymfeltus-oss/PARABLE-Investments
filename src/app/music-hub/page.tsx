"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Category =
  | "Gospel Artists"
  | "Musicians"
  | "Choirs"
  | "Worship Leaders"
  | "Producers"
  | "Shed Rooms";

const CATEGORIES: Category[] = [
  "Gospel Artists",
  "Musicians",
  "Choirs",
  "Worship Leaders",
  "Producers",
  "Shed Rooms",
];

function frac(n: number) {
  return n - Math.floor(n);
}

function prand(seed: number) {
  return frac(Math.sin(seed * 9999.123) * 10000);
}

function Sparkles() {
  const sparks = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const r1 = prand(i + 1);
      const r2 = prand(i + 101);
      const r3 = prand(i + 1001);

      return {
        id: i,
        left: `${(r1 * 100).toFixed(4)}%`,
        top: `${(r2 * 100).toFixed(4)}%`,
        dur: `${(4 + r3 * 4).toFixed(4)}s`,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="absolute w-[2px] h-[2px] bg-[#00f2fe] rounded-full"
          style={{
            left: s.left,
            top: s.top,
            animation: `spark ${s.dur} ease-in-out infinite`,
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes spark {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(-60px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function LiveRoom({
  title,
  people,
}: {
  title: string;
  people: number;
}) {
  return (
    <div className="rounded-xl border border-[#00f2fe]/20 bg-white/[0.04] px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[3px] text-white/70">
          {title}
        </p>
        <p className="text-[10px] text-[#00f2fe] font-black">
          LIVE • {people} inside
        </p>
      </div>

      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
    </div>
  );
}

function CategoryCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(0,242,254,0.12)]"
    >
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="text-sm text-white/60 mt-2">{desc}</p>

      <button className="mt-4 px-4 py-2 rounded-lg bg-[#00f2fe] text-black text-xs font-black uppercase tracking-[3px]">
        Explore
      </button>
    </motion.div>
  );
}

export default function MusicHub() {
  const [cat, setCat] = useState<Category>("Gospel Artists");

  const categories = useMemo(
    () => ({
      "Gospel Artists": [
        {
          title: "Featured Voices",
          desc: "Breakthrough worship artists and emerging voices.",
        },
        {
          title: "New Gospel Releases",
          desc: "Fresh music and live recordings.",
        },
        {
          title: "Sanctuary Sessions",
          desc: "Exclusive live worship recordings.",
        },
      ],

      Musicians: [
        {
          title: "Bandstand",
          desc: "Drums • Keys • Bass • Guitar • MDs.",
        },
        {
          title: "Chops & Runs",
          desc: "Signature gospel licks and breakdowns.",
        },
        {
          title: "Session Ready",
          desc: "Charts, stems and rehearsal packs.",
        },
      ],

      Choirs: [
        {
          title: "Choir Rooms",
          desc: "Section rehearsals and choir builds.",
        },
        {
          title: "Anthem Library",
          desc: "Classic and modern gospel anthems.",
        },
        {
          title: "Director’s Corner",
          desc: "Warmups, blends and choir training.",
        },
      ],

      "Worship Leaders": [
        {
          title: "Worship Flow",
          desc: "Build powerful worship setlists.",
        },
        {
          title: "Moments",
          desc: "Spontaneous worship sessions.",
        },
        {
          title: "Setlist Builder",
          desc: "Prepare Sunday worship flow.",
        },
      ],

      Producers: [
        {
          title: "Producer Lab",
          desc: "Build the sound behind the worship.",
        },
        {
          title: "Sound Libraries",
          desc: "Pads, risers and transitions.",
        },
        {
          title: "Release Ready",
          desc: "Prepare songs for distribution.",
        },
      ],

      "Shed Rooms": [
        {
          title: "Keys Shed",
          desc: "Practice gospel chord movements.",
        },
        {
          title: "Drum Shed",
          desc: "Drum chops and groove training.",
        },
        {
          title: "Full Band Shed",
          desc: "Complete rehearsal experience.",
        },
      ],
    }),
    []
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Sparkles />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-10 pb-32">
        <h1 className="text-5xl font-black leading-tight">
          The Sound of the{" "}
          <span className="text-[#00f2fe]">Sanctuary</span>
        </h1>

        <p className="mt-4 text-white/60 max-w-xl">
          A creative hub for gospel artists, musicians, choirs,
          worship leaders, and producers building the next sound
          of worship.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <LiveRoom title="Global Shed Session" people={312} />
          <LiveRoom title="Choir Rehearsal" people={104} />
          <LiveRoom title="Producer Lab Live" people={58} />
        </div>

        <div className="flex gap-3 mt-10 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-[3px] border ${
                cat === c
                  ? "border-[#00f2fe] bg-[#00f2fe]/20"
                  : "border-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {categories[cat].map((card) => (
            <CategoryCard
              key={card.title}
              title={card.title}
              desc={card.desc}
            />
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-black mb-6">
            Sunday Prep
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <CategoryCard
              title="Trending Setlists"
              desc="Songs churches are singing this week."
            />

            <CategoryCard
              title="Transitions"
              desc="Best musical transitions between songs."
            />

            <CategoryCard
              title="Keys by Vocal Range"
              desc="Find the best key for your voice."
            />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-black mb-6">
            Creator Tools
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <CategoryCard
              title="Setlist Builder"
              desc="Design the perfect worship flow."
            />

            <CategoryCard
              title="Chord Charts"
              desc="Share and collaborate on charts."
            />

            <CategoryCard
              title="Stem Vault"
              desc="Access backing tracks and stems."
            />

            <CategoryCard
              title="Release Studio"
              desc="Prepare music releases."
            />
          </div>
        </div>

        <div className="mt-20 p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[3px] text-white/50">
            Now Playing
          </p>

          <h3 className="text-lg font-black mt-1">
            Sanctuary Session (Demo Player)
          </h3>

          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 border border-white/10 rounded-lg">
              Prev
            </button>

            <button className="px-6 py-2 bg-[#00f2fe] text-black font-black rounded-lg">
              Play
            </button>

            <button className="px-4 py-2 border border-white/10 rounded-lg">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}