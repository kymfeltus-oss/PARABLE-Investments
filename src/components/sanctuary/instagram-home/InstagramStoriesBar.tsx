"use client";

import Image from "next/image";

export type StoryRingItem = {
  id: string;
  label: string;
  avatarUrl: string;
  isOwn?: boolean;
};

type Props = {
  items: StoryRingItem[];
};

export default function InstagramStoriesBar({ items }: Props) {
  return (
    <div className="border-b border-neutral-900 bg-black py-2">
      <div
        className="flex gap-4 overflow-x-auto px-3 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Stories"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex shrink-0 flex-col items-center gap-1.5"
            role="listitem"
          >
            <span
              className={
                item.isOwn
                  ? "flex h-[66px] w-[66px] items-center justify-center rounded-full border-2 border-neutral-600 bg-black p-[3px]"
                  : "flex h-[66px] w-[66px] items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-[2.5px]"
              }
            >
              <span className="relative h-[56px] w-[56px] overflow-hidden rounded-full bg-neutral-800">
                {item.avatarUrl ? (
                  <Image src={item.avatarUrl} alt="" fill className="object-cover" sizes="56px" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[11px] text-neutral-500">
                    {item.label.slice(0, 2)}
                  </span>
                )}
              </span>
            </span>
            <span className="max-w-[76px] truncate text-[11px] leading-none text-neutral-100">
              {item.isOwn ? "Your story" : item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
