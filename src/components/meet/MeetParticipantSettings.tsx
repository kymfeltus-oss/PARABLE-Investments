'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackgroundBlur, VirtualBackground, supportsBackgroundProcessors } from '@livekit/track-processors';
import { Track } from 'livekit-client';
import type { LocalVideoTrack } from 'livekit-client';

const AVATAR_STORAGE_KEY = 'parable-meet-avatar-v1';

type BgMode = 'none' | 'blur' | 'image';

function fileToJpegThumbDataUrl(file: File, maxEdge = 128, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (!w || !h) throw new Error('Invalid image');
        const scale = Math.min(1, maxEdge / Math.max(w, h));
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch (e) {
        reject(e instanceof Error ? e : new Error('Could not process image'));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

/**
 * In-room settings surfaced via LiveKit `VideoConference` (gear icon).
 * Backgrounds use `@livekit/track-processors` (camera must be on). Profile photo is stored locally
 * and synced to participant metadata when small enough for LiveKit limits.
 */
export function MeetParticipantSettings() {
  const { localParticipant } = useLocalParticipant();
  const [bgMode, setBgMode] = useState<BgMode>('none');
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(AVATAR_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const virtualBgUrlRef = useRef<string | null>(null);

  const getCameraTrack = useCallback((): LocalVideoTrack | undefined => {
    const pub = localParticipant.getTrackPublication(Track.Source.Camera);
    const t = pub?.track;
    if (t && t.kind === Track.Kind.Video) return t as LocalVideoTrack;
    return undefined;
  }, [localParticipant]);

  const clearVirtualUrl = () => {
    if (virtualBgUrlRef.current) {
      URL.revokeObjectURL(virtualBgUrlRef.current);
      virtualBgUrlRef.current = null;
    }
  };

  const applyBackground = useCallback(
    async (mode: BgMode, imageObjectUrl?: string) => {
      setHint(null);
      const videoTrack = getCameraTrack();
      if (!videoTrack) {
        setHint('Turn on your camera to use background effects.');
        return;
      }
      if (!supportsBackgroundProcessors()) {
        setHint('Background effects are not supported in this browser.');
        return;
      }
      setBusy(true);
      try {
        await videoTrack.stopProcessor();
        clearVirtualUrl();
        if (mode === 'none') {
          setBgMode('none');
          return;
        }
        if (mode === 'blur') {
          await videoTrack.setProcessor(BackgroundBlur(14));
          setBgMode('blur');
          return;
        }
        if (mode === 'image' && imageObjectUrl) {
          virtualBgUrlRef.current = imageObjectUrl;
          await videoTrack.setProcessor(VirtualBackground(imageObjectUrl));
          setBgMode('image');
        }
      } catch (e) {
        setHint(e instanceof Error ? e.message : 'Could not apply background.');
      } finally {
        setBusy(false);
      }
    },
    [getCameraTrack],
  );

  useEffect(() => {
    return () => {
      clearVirtualUrl();
    };
  }, []);

  const onPickVirtualBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const objectUrl = URL.createObjectURL(file);
    void applyBackground('image', objectUrl);
  };

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    setHint(null);
    try {
      const dataUrl = await fileToJpegThumbDataUrl(file);
      setAvatarPreview(dataUrl);
      try {
        localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl);
      } catch {
        /* quota */
      }
      const payload = JSON.stringify({ profileImage: dataUrl });
      if (payload.length > 12000) {
        setHint('Profile image is stored on this device only (too large to sync to the room).');
        return;
      }
      try {
        await localParticipant.setMetadata(payload);
      } catch {
        setHint('Profile saved on this device; the room could not sync the photo (size or server limits).');
      }
    } catch (err) {
      setHint(err instanceof Error ? err.message : 'Could not set profile image.');
    }
  };

  const clearAvatar = async () => {
    setAvatarPreview(null);
    setHint(null);
    try {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    try {
      await localParticipant.setMetadata('');
    } catch {
      /* permission / empty */
    }
  };

  return (
    <div className="parable-meet-settings max-h-[min(70vh,520px)] w-[min(100vw-2rem,380px)] overflow-y-auto text-left">
      <h3 className="border-b border-white/10 pb-2 text-xs font-black uppercase tracking-[0.2em] text-white/90">
        Meeting settings
      </h3>

      <section className="mt-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Profile photo</p>
        <p className="text-[11px] leading-relaxed text-white/40">
          Shown in metadata for other clients that read it; always kept in this browser for your next visit.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/40">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-provided data URL
              <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] text-white/35">None</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
            </label>
            {avatarPreview ? (
              <button
                type="button"
                onClick={() => void clearAvatar()}
                className="rounded-md border border-red-500/30 px-3 py-1.5 text-[11px] font-semibold text-red-200/90 hover:bg-red-500/10"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Background</p>
        <p className="text-[11px] leading-relaxed text-white/40">
          Uses your camera feed (same idea as Zoom virtual backgrounds). First request may download a small ML model.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void applyBackground('none')}
            className={`rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${
              bgMode === 'none'
                ? 'border-[#00f2ff]/50 bg-[#00f2ff]/15 text-[#00f2ff]'
                : 'border-white/20 text-white/75 hover:bg-white/10'
            }`}
          >
            None
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void applyBackground('blur')}
            className={`rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${
              bgMode === 'blur'
                ? 'border-[#00f2ff]/50 bg-[#00f2ff]/15 text-[#00f2ff]'
                : 'border-white/20 text-white/75 hover:bg-white/10'
            }`}
          >
            Blur
          </button>
          <label
            className={`cursor-pointer rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${
              bgMode === 'image'
                ? 'border-[#00f2ff]/50 bg-[#00f2ff]/15 text-[#00f2ff]'
                : 'border-white/20 text-white/75 hover:bg-white/10'
            }`}
          >
            Image…
            <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={onPickVirtualBg} />
          </label>
        </div>
      </section>

      {hint ? <p className="mt-4 text-[11px] text-amber-100/95">{hint}</p> : null}
      {busy ? <p className="mt-2 text-[11px] text-white/45">Applying…</p> : null}
    </div>
  );
}
