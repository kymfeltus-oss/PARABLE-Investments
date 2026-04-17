"use client";

import { memo, useCallback, useEffect, useMemo, useOptimistic, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { CSSProperties } from "react";
import { Grid } from "react-window";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  Clapperboard,
  Grid3x3,
  ImageIcon,
  Images,
  LayoutGrid,
  Pencil,
  Plus,
  Trash2,
  UserSquare2,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  enforceSanctuaryImageDataUrlMaxBytes,
  isDeviceFallbackSanctuaryKey,
  isSanctuaryPostImageDataUrl,
  isSanctuaryPostImageSource,
  loadSanctuaryPostsAsyncWithRecovery,
  mergeSanctuaryPostsStorage,
  resolveSanctuaryStorageUserId,
  runDeferredStorageWork,
  saveSanctuaryPostsAsync,
  shrinkDataUrlForStorage,
  type SanctuaryPost,
  type SanctuaryPostAspect,
  type SanctuarySaveResult,
} from "@/lib/sanctuary-posts-storage";
import { compressAndUploadImage, blobToDataUrl } from "@/lib/image-upload-compress";
import { createClient } from "@/utils/supabase/client";
import SanctuaryPostGridItem, { type FeedPost } from "@/components/sanctuary/SanctuaryPostGridItem";

type FeedLayout = "default" | "instagram";

type Props = {
  userId: string;
  layout?: FeedLayout;
  /** Increment to open the new-post composer from outside (e.g. header +). */
  composeKey?: number;
  onPostCountChange?: (count: number) => void;
};

const FILE_INPUT_ID = "sanctuary-post-file-input";
const ACCEPT_SANCTUARY_IMAGES = "image/png,image/jpeg,image/webp,image/gif";
const SUPPORTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]);

function devSanctuaryLog(message: string, detail?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") return;
  console.info(`[SanctuaryPosts] ${message}`, detail ?? "");
}

function isSupportedSanctuaryImageFile(file: File): boolean {
  const t = file.type.trim().toLowerCase();
  if (t && SUPPORTED_IMAGE_TYPES.has(t)) return true;
  return /\.(png|jpe?g|gif|webp)$/i.test(file.name);
}

function messageFromSaveFailure(result: SanctuarySaveResult): string {
  switch (result.reason) {
    case "quota":
      return "Storage is full. Try a smaller photo or remove older posts.";
    case "unavailable":
      return "Browser storage is blocked or unavailable.";
    case "serialize":
      return "Could not save this post. Try again.";
    default:
      return "Could not save. Try again in a moment.";
  }
}

const GRID_COLS = 3;
const GRID_GAP_DEFAULT = 8;
/** Instagram profile grid: hairline separation via fractional column math */
const GRID_GAP_INSTAGRAM = 1;

type SanctuaryGridCellProps = {
  posts: FeedPost[];
  onOpen: (p: SanctuaryPost) => void;
  columnWidth: number;
  virtualized: boolean;
  feedLayout: FeedLayout;
  gridRowCount: number;
};

function SanctuaryGridCell({
  ariaAttributes,
  columnIndex,
  rowIndex,
  style,
  posts,
  onOpen,
  columnWidth,
  virtualized,
  feedLayout,
  gridRowCount,
}: {
  ariaAttributes: { "aria-colindex": number; role: "gridcell" };
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
} & SanctuaryGridCellProps) {
  const idx = rowIndex * GRID_COLS + columnIndex;
  const post = posts[idx];
  const ig = feedLayout === "instagram";
  if (!post) {
    return <div style={style} {...ariaAttributes} className="min-h-0" />;
  }
  return (
    <div
      style={style}
      {...ariaAttributes}
      className="box-border min-h-0 p-0 [content-visibility:auto] [contain-intrinsic-size:500px]"
    >
      <div
        className={[
          "overflow-hidden bg-black [contain:strict] [content-visibility:auto] [contain-intrinsic-size:500px]",
          ig
            ? [
                "border-neutral-800",
                columnIndex < GRID_COLS - 1 ? "border-r" : "",
                rowIndex < gridRowCount - 1 ? "border-b" : "",
              ].join(" ")
            : "rounded-xl border border-white/[0.1] bg-black/60",
        ].join(" ")}
        style={{ width: columnWidth, height: columnWidth }}
      >
        <SanctuaryPostGridItem
          post={post}
          onOpen={onOpen}
          virtualized={virtualized}
          layout={ig ? "instagram" : "default"}
        />
      </div>
    </div>
  );
}

const SanctuaryPostGridVirtualized = memo(function SanctuaryPostGridVirtualized({
  posts,
  onOpen,
  gridWidth,
  gridHeight,
  feedLayout,
}: {
  posts: FeedPost[];
  onOpen: (p: SanctuaryPost) => void;
  gridWidth: number;
  gridHeight: number;
  feedLayout: FeedLayout;
}) {
  const gap = feedLayout === "instagram" ? GRID_GAP_INSTAGRAM : GRID_GAP_DEFAULT;
  const colW = Math.max(80, Math.floor((gridWidth - gap * (GRID_COLS - 1)) / GRID_COLS));
  const rowH = colW + gap;
  const rowCount = Math.max(1, Math.ceil(posts.length / GRID_COLS));

  const cellProps = useMemo<SanctuaryGridCellProps>(
    () => ({
      posts,
      onOpen,
      columnWidth: colW,
      virtualized: true,
      feedLayout,
      gridRowCount: rowCount,
    }),
    [posts, onOpen, colW, feedLayout, rowCount],
  );

  return (
    <Grid<SanctuaryGridCellProps>
      className="scrollbar-thin [content-visibility:auto] [contain-intrinsic-size:500px] [contain:paint]"
      columnCount={GRID_COLS}
      columnWidth={colW}
      rowCount={rowCount}
      rowHeight={rowH}
      cellComponent={SanctuaryGridCell}
      cellProps={cellProps}
      defaultHeight={gridHeight}
      defaultWidth={gridWidth}
      overscanCount={0}
      style={{ width: "100%", height: gridHeight }}
    />
  );
});

type ProfileTab = "posts" | "reels" | "tagged";

export default function SanctuaryPostsFeed({
  userId,
  layout = "default",
  composeKey = 0,
  onPostCountChange,
}: Props) {
  const { authUserId } = useAuth();
  const storageUserId = useMemo(
    () => resolveSanctuaryStorageUserId(userId, authUserId),
    [userId, authUserId],
  );

  const isIg = layout === "instagram";
  const [profileTab, setProfileTab] = useState<ProfileTab>("posts");
  const lastComposeKeyRef = useRef(0);

  const [posts, setPosts] = useState<SanctuaryPost[]>([]);
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts as FeedPost[],
    (current: FeedPost[], pending: FeedPost): FeedPost[] => [pending, ...current],
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [editPost, setEditPost] = useState<SanctuaryPost | null>(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [aspectDraft, setAspectDraft] = useState<SanctuaryPostAspect>("1x1");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const draftCtaRef = useRef<HTMLDivElement>(null);
  const prevStorageKeyRef = useRef<string | null>(null);
  const mergeInFlightRef = useRef(false);

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 360, height: 440 });

  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr && cr.width > 0 && cr.height > 0) {
        setGridSize({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    onPostCountChange?.(optimisticPosts.length);
  }, [onPostCountChange, optimisticPosts.length]);

  useEffect(() => {
    if (!composeKey || composeKey <= 0) return;
    if (composeKey === lastComposeKeyRef.current) return;
    lastComposeKeyRef.current = composeKey;
    setCaptionDraft("");
    setAspectDraft("1x1");
    setPreviewUrl(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
    setComposerOpen(true);
  }, [composeKey]);

  const refresh = useCallback(async () => {
    if (!storageUserId) {
      setPosts([]);
      return;
    }
    const loaded = await loadSanctuaryPostsAsyncWithRecovery(storageUserId);
    setPosts(loaded);
    devSanctuaryLog("posts loaded", { count: loaded.length });
  }, [storageUserId]);

  useEffect(() => {
    void runDeferredStorageWork(() => refresh());
    const onUp = () => {
      void runDeferredStorageWork(() => refresh());
    };
    window.addEventListener("parable:sanctuary-posts-updated", onUp);
    return () => window.removeEventListener("parable:sanctuary-posts-updated", onUp);
  }, [refresh]);

  useEffect(() => {
    if (!storageUserId || mergeInFlightRef.current) return;
    const prev = prevStorageKeyRef.current;
    const needsMerge =
      !!prev &&
      prev !== storageUserId &&
      isDeviceFallbackSanctuaryKey(prev) &&
      !isDeviceFallbackSanctuaryKey(storageUserId);

    if (needsMerge) {
      mergeInFlightRef.current = true;
      void runDeferredStorageWork(async () => {
        try {
          const ok = await mergeSanctuaryPostsStorage(prev, storageUserId);
          if (ok) await refresh();
        } finally {
          mergeInFlightRef.current = false;
          prevStorageKeyRef.current = storageUserId;
        }
      });
      return;
    }

    prevStorageKeyRef.current = storageUserId;
  }, [storageUserId, refresh]);

  const resetComposer = () => {
    setCaptionDraft("");
    setAspectDraft("1x1");
    setPreviewUrl(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openEdit = useCallback((p: SanctuaryPost) => {
    setEditPost(p);
    setCaptionDraft(p.caption);
    setAspectDraft(p.aspect);
    setPreviewUrl(p.imageDataUrl);
  }, []);

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isSupportedSanctuaryImageFile(file)) {
      setError("Use PNG, JPG, WebP, or GIF.");
      e.target.value = "";
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const result = await compressAndUploadImage(supabase, file);
      if (result.ok) {
        setPreviewUrl(result.publicUrl);
        setError(null);
      } else {
        const dataUrl = result.compressedBlob ? await blobToDataUrl(result.compressedBlob) : null;
        setPreviewUrl(dataUrl || null);
        setError(
          result.error.includes("Sign in")
            ? "Sign in to sync photos — preview saved locally."
            : `${result.error} — using local preview.`,
        );
      }
      e.target.blur();
      queueMicrotask(() => {
        captionRef.current?.focus();
        draftCtaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    if (saving) return;
    if (!previewUrl) {
      setError("Add a photo first.");
      return;
    }
    if (!storageUserId.trim()) {
      setError("Could not open storage.");
      return;
    }
    if (!isSanctuaryPostImageSource(previewUrl)) {
      setError("Invalid image source.");
      return;
    }

    const postId = `sp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const caption = captionDraft.trim().slice(0, 2200);
    const createdAt = Date.now();

    flushSync(() => {
      setSaving(true);
      setError(null);
      addOptimisticPost({
        id: postId,
        caption,
        imageDataUrl: previewUrl,
        createdAt,
        aspect: aspectDraft,
        isPendingSave: true,
      });
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("parable:sanctuary-post-busy"));
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void (async () => {
          try {
            const imageDataUrl =
              previewUrl.startsWith("data:") && isSanctuaryPostImageDataUrl(previewUrl)
                ? (await enforceSanctuaryImageDataUrlMaxBytes(previewUrl)) ?? previewUrl
                : previewUrl;
            const next: SanctuaryPost = {
              id: postId,
              caption,
              imageDataUrl,
              createdAt,
              aspect: aspectDraft,
            };

            const existing = posts;
            const merged = [next, ...existing.filter((p) => p.id !== next.id)];

            await runDeferredStorageWork(async () => {
              let saveResult = await saveSanctuaryPostsAsync(storageUserId, merged, {
                notifyListeners: false,
                deferPersistence: true,
              });
              if (saveResult.ok) {
                setPosts(merged);
                resetComposer();
                setComposerOpen(false);
                return;
              }
              const smaller = await shrinkDataUrlForStorage(imageDataUrl, 960, 0.72);
              if (smaller && smaller !== imageDataUrl) {
                const retryPost: SanctuaryPost = { ...next, imageDataUrl: smaller };
                const retryMerged = [retryPost, ...existing.filter((p) => p.id !== retryPost.id)];
                saveResult = await saveSanctuaryPostsAsync(storageUserId, retryMerged, {
                  notifyListeners: false,
                  deferPersistence: true,
                });
                if (saveResult.ok) {
                  setPosts(retryMerged);
                  resetComposer();
                  setComposerOpen(false);
                  return;
                }
              }
              const tiny = await shrinkDataUrlForStorage(imageDataUrl, 640, 0.55);
              if (tiny && tiny !== imageDataUrl) {
                const retryPost: SanctuaryPost = { ...next, imageDataUrl: tiny };
                const retryMerged = [retryPost, ...existing.filter((p) => p.id !== retryPost.id)];
                saveResult = await saveSanctuaryPostsAsync(storageUserId, retryMerged, {
                  notifyListeners: false,
                  deferPersistence: true,
                });
                if (saveResult.ok) {
                  setPosts(retryMerged);
                  resetComposer();
                  setComposerOpen(false);
                  return;
                }
              }
              setError(messageFromSaveFailure(saveResult));
            });
          } catch (e) {
            console.error(e);
            setError("Could not publish this post.");
          } finally {
            setSaving(false);
            window.dispatchEvent(new CustomEvent("parable:sanctuary-post-idle"));
          }
        })();
      });
    });
  };

  const handleUpdateCaption = async () => {
    if (!editPost || !storageUserId) return;
    setSaving(true);
    setError(null);
    try {
      await runDeferredStorageWork(async () => {
        const existing = await loadSanctuaryPostsAsyncWithRecovery(storageUserId);
        const merged = existing.map((p) =>
          p.id === editPost.id
            ? { ...p, caption: captionDraft.trim().slice(0, 2200), aspect: aspectDraft }
            : p,
        );
        const r = await saveSanctuaryPostsAsync(storageUserId, merged, {
          notifyListeners: false,
          deferPersistence: true,
        });
        if (!r.ok) {
          setError(messageFromSaveFailure(r));
          return;
        }
        setPosts(merged);
        setEditPost(null);
        resetComposer();
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!storageUserId) return;
    setSaving(true);
    try {
      await runDeferredStorageWork(async () => {
        const existing = await loadSanctuaryPostsAsyncWithRecovery(storageUserId);
        const merged = existing.filter((p) => p.id !== id);
        const r = await saveSanctuaryPostsAsync(storageUserId, merged, {
          notifyListeners: false,
          deferPersistence: true,
        });
        if (!r.ok) {
          setError(messageFromSaveFailure(r));
          return;
        }
        setPosts(merged);
        setEditPost(null);
      });
    } finally {
      setSaving(false);
    }
  };

  const accentSel = isIg ? "border-[#0095f6]/50 bg-[#0095f6]/15 text-[#0095f6]" : "border-[#00f2ff]/40 bg-[#00f2ff]/10 text-[#00f2ff]";
  const accentIdle = isIg ? "border-white/10 bg-black/40 text-white/55" : "border-white/10 bg-black/40 text-white/55";
  const primaryBtn = isIg
    ? "rounded-lg bg-[#0095f6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1877f2] disabled:opacity-50"
    : "rounded-xl bg-[#00f2ff] px-6 py-3 text-sm font-black uppercase text-black disabled:opacity-50";

  function ComposerFields() {
    return (
      <>
        {previewUrl ? (
          <div
            className={[
              "-mb-px border-b px-5 py-4 sm:px-8 sm:py-5",
              isIg ? "border-white/[0.12] bg-black" : "border-[#00f2ff]/55 bg-gradient-to-b from-[#00f2ff]/20 via-[#00f2ff]/8 to-black/70",
            ].join(" ")}
          >
            <div className="flex flex-wrap items-start gap-3">
              <CheckCircle2 className={["mt-1 h-6 w-6 shrink-0", isIg ? "text-[#0095f6]" : "text-[#00f2ff]"].join(" ")} />
              <div className="min-w-0 flex-1">
                <p className={["text-[11px] font-semibold uppercase tracking-wide", isIg ? "text-neutral-400" : "text-[#00f2ff]"].join(" ")}>
                  Draft
                </p>
                <p className="mt-1 text-lg font-semibold text-white">New post</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={["border-b px-5 py-3 sm:px-8", isIg ? "border-white/[0.12] bg-black" : "border-white/[0.08] bg-black/35"].join(" ")}>
            <p className="text-[13px] font-semibold text-white">Create new post</p>
          </div>
        )}
        <div className={isIg ? "p-4 sm:p-5" : "p-5 sm:p-6"}>
          <div className="flex flex-col gap-5 lg:flex-row">
            <div
              className={[
                "relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden border bg-black",
                isIg ? "rounded-sm border-white/[0.12]" : "rounded-2xl border-black/50",
                previewUrl
                  ? isIg
                    ? "border-white/20"
                    : "border-[#00f2ff]/35 ring-1 ring-[#00f2ff]/25"
                  : "border-dashed border-white/15",
              ].join(" ")}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="" className="max-h-[min(420px,50vh)] w-full object-contain" />
              ) : (
                <label htmlFor={FILE_INPUT_ID} className="flex cursor-pointer flex-col items-center gap-2 p-8 text-neutral-500">
                  <Camera className="h-12 w-12 stroke-[1.25]" />
                  <span className="text-sm font-semibold">Drag photos here</span>
                  <span className="text-xs text-neutral-600">or click to select</span>
                </label>
              )}
              <input
                id={FILE_INPUT_ID}
                ref={fileRef}
                type="file"
                accept={ACCEPT_SANCTUARY_IMAGES}
                className="sr-only"
                tabIndex={-1}
                onChange={handlePickFile}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div>
                <p className="text-[11px] font-semibold text-neutral-500">Caption</p>
                <textarea
                  ref={captionRef}
                  value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  placeholder="Write a caption…"
                  rows={isIg ? 4 : 5}
                  className="mt-1.5 w-full resize-none border-0 bg-transparent px-0 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-0"
                  maxLength={2200}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-500">Crop</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectDraft("1x1")}
                    className={[
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-semibold",
                      aspectDraft === "1x1" ? accentSel : accentIdle,
                    ].join(" ")}
                  >
                    <Grid3x3 size={16} /> Original
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectDraft("4x5")}
                    className={[
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-semibold",
                      aspectDraft === "4x5" ? accentSel : accentIdle,
                    ].join(" ")}
                  >
                    <LayoutGrid size={16} /> Portrait
                  </button>
                </div>
              </div>
              {error ? <p className="text-sm text-amber-300/90">{error}</p> : null}
              <div ref={draftCtaRef} className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
                <button type="button" disabled={saving} onClick={handlePublish} className={primaryBtn}>
                  {saving ? "Posting…" : previewUrl ? (isIg ? "Share" : "Post to Sanctuary") : "Share"}
                </button>
                <label
                  htmlFor={FILE_INPUT_ID}
                  className={[
                    "inline-flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-2 text-sm font-semibold",
                    isIg ? "text-[#0095f6]" : "text-white/80",
                  ].join(" ")}
                >
                  {isIg ? (
                    "Select from computer"
                  ) : (
                    <>
                      <ImageIcon size={16} className="mr-2 inline" />
                      Change photo
                    </>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setComposerOpen(false);
                    resetComposer();
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const igEmptyReels = (
    <div className="flex flex-col items-center px-10 py-20 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700">
        <Clapperboard className="h-11 w-11 text-white" strokeWidth={1.15} />
      </div>
      <h2 className="mt-8 text-xl font-light text-white">Share a reel</h2>
      <p className="mt-2 max-w-xs text-sm text-neutral-500">When you create a reel, it will appear here.</p>
    </div>
  );

  const igEmptyTagged = (
    <div className="flex flex-col items-center px-10 py-20 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700">
        <UserSquare2 className="h-11 w-11 text-white" strokeWidth={1.15} />
      </div>
      <h2 className="mt-8 text-xl font-light text-white">Photos of you</h2>
      <p className="mt-2 max-w-xs text-sm text-neutral-500">When people tag you in photos, they will appear here.</p>
    </div>
  );

  const igTabBtn = (id: ProfileTab, Icon: typeof Grid3x3) => (
    <button
      key={id}
      type="button"
      onClick={() => setProfileTab(id)}
      className={[
        "flex flex-1 items-center justify-center border-t-2 py-2.5 transition-colors",
        profileTab === id ? "border-white text-white" : "border-transparent text-neutral-500 hover:text-neutral-300",
      ].join(" ")}
      aria-selected={profileTab === id}
      role="tab"
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={profileTab === id ? 2.5 : 2} />
    </button>
  );

  return (
    <section
      id="sanctuary-posts"
      className={isIg ? "flex min-h-0 flex-1 flex-col bg-black" : "scroll-mt-24 space-y-4"}
    >
      {isIg ? (
        <>
          <div className="flex shrink-0 border-t border-white/[0.12] bg-black" role="tablist" aria-label="Profile content">
            {igTabBtn("posts", Grid3x3)}
            {igTabBtn("reels", Clapperboard)}
            {igTabBtn("tagged", UserSquare2)}
          </div>

          <AnimatePresence>
            {composerOpen ? (
              <motion.div
                layout={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[95] flex flex-col bg-black"
              >
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.12] px-3">
                  <button
                    type="button"
                    className="text-sm font-semibold text-white"
                    onClick={() => {
                      setComposerOpen(false);
                      resetComposer();
                    }}
                  >
                    ← Discard
                  </button>
                  <span className="text-[15px] font-semibold text-white">New post</span>
                  <span className="w-16" />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <ComposerFields />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {profileTab === "posts" ? (
            optimisticPosts.length > 0 ? (
              <div
                ref={gridContainerRef}
                className="min-h-[min(52vh,560px)] w-full flex-1 [contain:strict] [content-visibility:auto] [contain-intrinsic-size:500px]"
              >
                <SanctuaryPostGridVirtualized
                  posts={optimisticPosts}
                  onOpen={openEdit}
                  gridWidth={gridSize.width}
                  gridHeight={gridSize.height}
                  feedLayout={layout}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center px-8 py-16 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700">
                  <Camera className="h-11 w-11 text-white" strokeWidth={1.25} />
                </div>
                <p className="mt-6 text-xl font-light text-white">No posts yet</p>
                <p className="mt-1 text-sm text-neutral-500">Photos you share will appear on your profile.</p>
                <button
                  type="button"
                  onClick={() => {
                    resetComposer();
                    setComposerOpen(true);
                  }}
                  className="mt-5 text-sm font-semibold text-[#0095f6] hover:text-[#4db5f5]"
                >
                  Share a photo
                </button>
              </div>
            )
          ) : profileTab === "reels" ? (
            igEmptyReels
          ) : (
            igEmptyTagged
          )}
        </>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-black/45 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="border-b border-white/[0.07] bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,rgba(0,242,255,0.08),transparent_55%)] px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#00f2ff]/25 bg-[#00f2ff]/10">
                  <Images className="h-5 w-5 text-[#00f2ff]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.38em] text-white/45">Your feed</p>
                  <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Posts</h2>
                  <p className="mt-2 max-w-xl text-sm text-white/50">
                    Upload photos and captions. Saved on this device until you sync elsewhere.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetComposer();
                  setComposerOpen(true);
                }}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#00f2ff] px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_12px_40px_rgba(0,242,255,0.25)]"
              >
                <Plus size={16} />
                New post
              </button>
            </div>
          </div>

          <div className="space-y-5 px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
            <AnimatePresence>
              {composerOpen ? (
                <motion.div
                  layout={false}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-[2] overflow-hidden rounded-[28px] border border-white/[0.1] bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                >
                  <ComposerFields />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="rounded-[22px] border border-white/[0.08] bg-black/30 p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#00f2ff]/80">Post grid</p>
                  <p className="mt-0.5 text-xs text-white/40">Tap a thumbnail to edit or delete.</p>
                </div>
                {optimisticPosts.length > 0 ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/60">
                    {optimisticPosts.length} posts
                  </span>
                ) : null}
              </div>

              {optimisticPosts.length > 0 ? (
                <div
                  ref={gridContainerRef}
                  className="h-[min(55vh,520px)] w-full min-h-[280px] [contain:strict] [content-visibility:auto] [contain-intrinsic-size:500px]"
                >
                  <SanctuaryPostGridVirtualized
                    posts={optimisticPosts}
                    onOpen={openEdit}
                    gridWidth={gridSize.width}
                    gridHeight={gridSize.height}
                    feedLayout={layout}
                  />
                </div>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-black/40 px-6 py-10 text-center text-sm text-white/45">
                  No posts yet — tap New post to add one.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {editPost ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-white/10 bg-zinc-950 p-5 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => {
                  setEditPost(null);
                  resetComposer();
                }}
                className="absolute right-4 top-4 rounded-lg p-2 text-white/50 hover:bg-white/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div
                className={[
                  "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black",
                  editPost.aspect === "4x5" ? "aspect-[4/5]" : "aspect-square",
                ].join(" ")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editPost.imageDataUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <label className="mt-4 block text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                Caption
                <textarea
                  value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
                  maxLength={2200}
                />
              </label>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleUpdateCaption}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00f2ff] px-4 py-3 text-sm font-black uppercase text-black"
                >
                  <Pencil size={16} /> Save
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(editPost.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
