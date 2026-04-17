"use client";

import { Contact2 } from "lucide-react";

type Props = {
  onEditProfile: () => void;
  onShareProfile: () => void;
  onContact: () => void;
};

export default function InstagramProfileActions({ onEditProfile, onShareProfile, onContact }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 pb-4">
      <button
        type="button"
        onClick={onEditProfile}
        className="min-h-[32px] min-w-0 flex-1 rounded-lg bg-[#1a1a1a] px-3 text-[13px] font-semibold text-white border border-white/[0.08] hover:bg-white/[0.06]"
      >
        Edit profile
      </button>
      <button
        type="button"
        onClick={onShareProfile}
        className="min-h-[32px] min-w-0 flex-1 rounded-lg bg-[#1a1a1a] px-3 text-[13px] font-semibold text-white border border-white/[0.08] hover:bg-white/[0.06]"
      >
        Share profile
      </button>
      <button
        type="button"
        onClick={onContact}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#1a1a1a] text-white hover:bg-white/[0.06]"
        aria-label="Contact"
      >
        <Contact2 className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
