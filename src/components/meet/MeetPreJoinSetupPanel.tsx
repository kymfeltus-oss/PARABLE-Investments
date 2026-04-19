'use client';

import { useEffect, useRef, useState } from 'react';

type BgMode = 'none' | 'blur' | 'image';

type Props = {
  bgMode: BgMode;
  onBgModeChange: (mode: BgMode) => void;
  onPickBackgroundImage: (file: File) => void;
  supportsBackgrounds: boolean;
};

/**
 * Pre-join controls below LiveKit PreJoin: mic level check (separate short capture) and
 * virtual background options (paired with LiveKit PreJoin `videoProcessor`).
 */
export function MeetPreJoinSetupPanel({
  bgMode,
  onBgModeChange,
  onPickBackgroundImage,
  supportsBackgrounds,
}: Props) {
  const [micCheckOpen, setMicCheckOpen] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!micCheckOpen) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      void audioCtxRef.current?.close();
      audioCtxRef.current = null;
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length / 255;
          setMicLevel(avg);
          rafRef.current = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        setMicLevel(0);
      }
    };
    void run();

    return () => {
      cancelled = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      void audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, [micCheckOpen]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#141416]/95 px-4 py-3 text-left shadow-inner">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/80">Preview settings</p>
      <p className="mt-1 text-[11px] leading-relaxed text-white/45">
        Use the microphone and camera controls in the preview above to choose devices. Test your mic here; background
        effects apply to the camera preview when supported.
      </p>

      <div className="mt-3 border-t border-white/10 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Microphone check</span>
          <button
            type="button"
            onClick={() => setMicCheckOpen((o) => !o)}
            className="rounded-md border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-white/85 hover:bg-white/10"
          >
            {micCheckOpen ? 'Stop' : 'Test microphone'}
          </button>
        </div>
        {micCheckOpen ? (
          <div className="mt-2 space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400/90 transition-[width] duration-75"
                style={{ width: `${Math.min(100, 8 + micLevel * 400)}%` }}
              />
            </div>
            <p className="text-[10px] text-white/35">
              Speak — the bar should move. This uses a short separate capture; close when finished.
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Camera — background & filters</p>
        {!supportsBackgrounds ? (
          <p className="mt-1 text-[11px] text-amber-100/80">Background effects are not supported in this browser.</p>
        ) : (
          <p className="mt-1 text-[11px] text-white/40">
            Blur or image background (same engine as in-meeting settings). First use may download a small ML model.
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!supportsBackgrounds}
            onClick={() => onBgModeChange('none')}
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
            disabled={!supportsBackgrounds}
            onClick={() => onBgModeChange('blur')}
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
            } ${!supportsBackgrounds ? 'pointer-events-none opacity-40' : ''}`}
          >
            Image…
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!supportsBackgrounds}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file && file.type.startsWith('image/')) onPickBackgroundImage(file);
              }}
            />
          </label>
        </div>
      </div>

    </div>
  );
}
