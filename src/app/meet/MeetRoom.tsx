'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';

type Props = {
  serverUrl: string;
  /** Without `investor-` prefix; e.g. `feb-deck` → room `investor-feb-deck`. */
  initialRoomSuffix?: string;
};

export default function MeetRoom({ serverUrl, initialRoomSuffix }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [roomSlug, setRoomSlug] = useState(() => {
    const raw = initialRoomSuffix?.trim();
    if (!raw) return 'team-call';
    return raw.replace(/^investor-/i, '');
  });
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const fullRoomName = useMemo(() => `investor-${roomSlug.replace(/^investor-/, '')}`, [roomSlug]);

  const join = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: fullRoomName,
          participantName: displayName.trim() || 'Guest',
        }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Could not join');
        return;
      }
      if (!data.token) {
        setError('No token returned');
        return;
      }
      setToken(data.token);
    } catch {
      setError('Network error');
    } finally {
      setConnecting(false);
    }
  }, [displayName, fullRoomName]);

  const leave = useCallback(() => {
    setToken(null);
    setError(null);
  }, []);

  if (!serverUrl) {
    return (
      <div className="parable-glass-panel border-[#00f2ff]/20 px-6 py-8 text-center text-sm text-white/70">
        <p className="font-semibold uppercase tracking-wider text-[#00f2ff]/90">LiveKit URL not configured</p>
        <p className="mt-2 text-white/50">
          Set <code className="text-[#00f2ff]">NEXT_PUBLIC_LIVEKIT_URL</code> in Vercel (e.g.{' '}
          <code className="text-white/70">wss://your-project.livekit.cloud</code>).
        </p>
      </div>
    );
  }

  if (token) {
    return (
      <div className="parable-livekit-root flex min-h-[70vh] w-full flex-col overflow-hidden rounded-2xl border border-[#00f2ff]/25 bg-black">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-mono text-xs text-[#00f2ff]/90">{fullRoomName}</p>
          <button
            type="button"
            onClick={leave}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:bg-white/10"
          >
            Leave
          </button>
        </div>
        <div className="min-h-[60vh] flex-1 [&_.lk-button]:border-[#00f2ff]/30 [&_.lk-button]:text-[#00f2ff]">
          <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect
            audio
            video
            onDisconnected={leave}
            data-lk-theme="default"
          >
            <VideoConference />
            <RoomAudioRenderer />
          </LiveKitRoom>
        </div>
      </div>
    );
  }

  return (
    <div className="parable-glass-panel mx-auto w-full max-w-md space-y-5 px-6 py-8">
      <p className="parable-eyebrow text-center !tracking-[0.2em] text-white/50">Join investor call</p>
      <label className="block text-left">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Your name</span>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Jane Investor"
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
        />
      </label>
      <label className="block text-left">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Room (suffix)</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 rounded-lg border border-[#00f2ff]/30 bg-black/40 px-3 py-3 font-mono text-xs text-[#00f2ff]">
            investor-
          </span>
          <input
            value={roomSlug.replace(/^investor-/, '')}
            onChange={(e) => setRoomSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
            placeholder="team-call"
            className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#00f2ff]/50"
          />
        </div>
        <p className="mt-2 text-[10px] text-white/35">
          Everyone uses the same suffix for one meeting (e.g. <code className="text-white/50">investor-deck-rehearsal</code>).
        </p>
      </label>
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-xs text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void join()}
        disabled={connecting || !roomSlug.trim()}
        className="w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.15)] hover:bg-[#00f2ff]/20 disabled:opacity-40"
      >
        {connecting ? 'Connecting…' : 'Join with camera & mic'}
      </button>
    </div>
  );
}
