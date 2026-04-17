"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import InstagramBottomTabBar from "@/components/sanctuary/instagram-home/InstagramBottomTabBar";
import InstagramProfileHeader from "./InstagramProfileHeader";
import InstagramProfileActions from "./InstagramProfileActions";
import InstagramProfileHighlights from "./InstagramProfileHighlights";
import InstagramProfileTabs from "./InstagramProfileTabs";
import InstagramProfileGrid from "./InstagramProfileGrid";
import InstagramPostDetailOverlay from "./InstagramPostDetailOverlay";
import EditProfileModal from "./EditProfileModal";
import { usePullToRefresh } from "./usePullToRefresh";
import type { ProfileGridItem, ProfileTab } from "./types";
import type { SanctuaryPost } from "@/lib/sanctuary-posts-storage";
import {
  loadSanctuaryPostsAsyncWithRecovery,
  resolveSanctuaryStorageUserId,
  runDeferredStorageWork,
} from "@/lib/sanctuary-posts-storage";
import { estimateInfluence, parseCreatorCategories, primaryCategory } from "@/lib/sanctuary-creator-state";

type Props = {
  userId: string;
  authUserId: string | null;
  avatarUrl: string;
  username: string;
  displayName: string;
  bio: string | null;
  role: string | null | undefined;
  followingCount: number;
};

function toGridItem(p: SanctuaryPost): ProfileGridItem {
  let hash = 0;
  for (let i = 0; i < p.id.length; i++) hash = (hash + p.id.charCodeAt(i) * (i + 1)) % 10000;
  return {
    id: p.id,
    imageUrl: p.imageDataUrl,
    likes: (hash % 900) + 1,
    comments: (hash % 40) + 1,
    type: "image",
    source: p,
  };
}

export default function SanctuaryInstagramProfile({
  userId,
  authUserId,
  avatarUrl,
  username,
  displayName,
  bio,
  role,
  followingCount,
}: Props) {
  const router = useRouter();
  const storageUserId = useMemo(
    () => resolveSanctuaryStorageUserId(userId, authUserId),
    [userId, authUserId],
  );

  const [posts, setPosts] = useState<SanctuaryPost[]>([]);
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [detail, setDetail] = useState<ProfileGridItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const loadPosts = useCallback(async () => {
    if (!storageUserId.trim()) {
      setPosts([]);
      return;
    }
    const loaded = await loadSanctuaryPostsAsyncWithRecovery(storageUserId);
    setPosts(loaded);
  }, [storageUserId]);

  useEffect(() => {
    void runDeferredStorageWork(() => loadPosts());
    const onUp = () => void runDeferredStorageWork(() => loadPosts());
    window.addEventListener("parable:sanctuary-posts-updated", onUp);
    return () => window.removeEventListener("parable:sanctuary-posts-updated", onUp);
  }, [loadPosts]);

  const onRefresh = useCallback(async () => {
    await runDeferredStorageWork(() => loadPosts());
  }, [loadPosts]);

  const { attachRef, scrollProps, pullDistance, refreshing } = usePullToRefresh(onRefresh);

  const gridItems = useMemo(() => posts.map(toGridItem), [posts]);
  const postCount = posts.length;
  const category = useMemo(() => {
    if (!role) return null;
    return primaryCategory(parseCreatorCategories(role));
  }, [role]);
  const followersDisplay = estimateInfluence(postCount, followingCount).toLocaleString();

  const setScrollRef = useCallback(
    (el: HTMLDivElement | null) => {
      attachRef(el);
    },
    [attachRef],
  );

  const handleShare = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/my-sanctuary` : "";
    void navigator.clipboard?.writeText(url).catch(() => {});
  };

  return (
      <div className="flex min-h-[100dvh] flex-col bg-black pb-[calc(49px+env(safe-area-inset-bottom,0px))] font-sans text-white">
        <div
          ref={setScrollRef}
          {...scrollProps}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
        >
          {(pullDistance > 0 || refreshing) && (
            <div
              className="flex items-center justify-center py-2 text-[12px] text-neutral-500"
              style={{ minHeight: refreshing ? 36 : pullDistance }}
            >
              {refreshing ? "Refreshing…" : pullDistance > 48 ? "Release to refresh" : ""}
            </div>
          )}

          <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-2">
            <span className="text-[15px] font-semibold">@{username}</span>
            <div className="flex items-center gap-3">
              <Link href="/settings" className="p-1.5 text-white" aria-label="Settings">
                <Settings className="h-6 w-6" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <InstagramProfileHeader
            avatarUrl={avatarUrl}
            username={username}
            displayName={displayName}
            category={category}
            bio={bio}
            postCount={postCount}
            followersDisplay={followersDisplay}
            followingCount={followingCount}
          />

          <InstagramProfileActions
            onEditProfile={() => setEditOpen(true)}
            onShareProfile={handleShare}
            onContact={() => router.push("/fellowship")}
          />

          <InstagramProfileHighlights />

          <InstagramProfileTabs active={activeTab} onChange={setActiveTab} />

          <div className="min-h-[200px] pb-6">
            {activeTab === "posts" ? (
              <InstagramProfileGrid posts={gridItems} onPostClick={setDetail} />
            ) : activeTab === "reels" ? (
              <div className="px-8 py-16 text-center text-[14px] text-neutral-500">No reels yet</div>
            ) : (
              <div className="px-8 py-16 text-center text-[14px] text-neutral-500">
                Photos of you
              </div>
            )}
          </div>
        </div>

        <InstagramBottomTabBar />
        <InstagramPostDetailOverlay post={detail} username={username} onClose={() => setDetail(null)} />
        <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      </div>
  );
}
