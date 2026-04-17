"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import InstagramHomeTopNav from "./InstagramHomeTopNav";
import InstagramStoriesBar, { type StoryRingItem } from "./InstagramStoriesBar";
import InstagramFeedPost from "./InstagramFeedPost";
import InstagramBottomTabBar from "./InstagramBottomTabBar";
import { MOCK_INSTAGRAM_HOME_FEED } from "./mockFeed";

type Props = {
  /** Current user avatar for “Your story” ring */
  currentUserAvatarUrl?: string;
  currentUsername?: string;
};

export default function SanctuaryInstagramHome({ currentUserAvatarUrl, currentUsername }: Props) {
  const router = useRouter();

  const storyItems: StoryRingItem[] = useMemo(
    () => [
      {
        id: "self",
        label: currentUsername ?? "You",
        avatarUrl: currentUserAvatarUrl ?? "",
        isOwn: true,
      },
      { id: "s1", label: "parable.community", avatarUrl: "https://picsum.photos/id/64/96/96" },
      { id: "s2", label: "sanctuary", avatarUrl: "https://picsum.photos/id/177/96/96" },
      { id: "s3", label: "testify", avatarUrl: "https://picsum.photos/id/338/96/96" },
      { id: "s4", label: "worship", avatarUrl: "https://picsum.photos/id/349/96/96" },
      { id: "s5", label: "youth", avatarUrl: "https://picsum.photos/id/365/96/96" },
      { id: "s6", label: "creators", avatarUrl: "https://picsum.photos/id/375/96/96" },
    ],
    [currentUserAvatarUrl, currentUsername],
  );

  return (
    <div className="flex min-h-[100dvh] flex-col bg-black pb-[calc(49px+env(safe-area-inset-bottom,0px))]">
      <InstagramHomeTopNav
        onActivityPress={() => router.push("/streamers")}
        onMessagesPress={() => router.push("/fellowship")}
      />

      <InstagramStoriesBar items={storyItems} />

      <main className="flex min-h-0 flex-1 flex-col">
        {MOCK_INSTAGRAM_HOME_FEED.map((post) => (
          <InstagramFeedPost key={post.id} post={post} />
        ))}
      </main>

      <InstagramBottomTabBar />
    </div>
  );
}
