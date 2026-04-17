"use client";

import { Grid3x3, Clapperboard, UserSquare2 } from "lucide-react";
import type { ProfileTab } from "./types";

type Props = {
  active: ProfileTab;
  onChange: (t: ProfileTab) => void;
};

const tabs: { id: ProfileTab; icon: typeof Grid3x3 }[] = [
  { id: "posts", icon: Grid3x3 },
  { id: "reels", icon: Clapperboard },
  { id: "tagged", icon: UserSquare2 },
];

export default function InstagramProfileTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-0 z-30 flex border-b border-white/[0.1] bg-black">
      {tabs.map(({ id, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={[
              "relative -mb-px flex flex-1 items-center justify-center border-b-2 py-3 transition-colors",
              isActive ? "border-white text-white" : "border-transparent text-neutral-600",
            ].join(" ")}
            aria-selected={isActive}
            role="tab"
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
}
