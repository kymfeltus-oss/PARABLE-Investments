"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

type Props = {
  onActivityPress?: () => void;
  onMessagesPress?: () => void;
};

export default function InstagramHomeTopNav({ onActivityPress, onMessagesPress }: Props) {
  return (
    <header className="sticky top-0 z-40 flex h-[44px] shrink-0 items-center justify-between border-b border-neutral-900 bg-black px-3">
      <div className="flex min-w-0 items-center">
        <div className="relative h-[29px] w-[103px]">
          <Image
            src="/fonts/parable-logo.svg"
            alt="Parable"
            fill
            className="object-contain object-left"
            priority
            sizes="103px"
          />
        </div>
      </div>
      <div className="flex items-center gap-5 pr-1">
        <button
          type="button"
          onClick={onActivityPress}
          className="text-neutral-100"
          aria-label="Activity"
        >
          <Heart className="h-6 w-6" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={onMessagesPress}
          className="text-neutral-100"
          aria-label="Direct messages"
        >
          <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
