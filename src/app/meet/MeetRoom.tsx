'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';

const WELCOME_PLACEHOLDER_MS = 3200;

type Props = {
  serverUrl: string;
  /** Without `investor-` prefix; e.g. `feb-deck` → room `investor-feb-deck`. */
  initialRoomSuffix?: string;
  /** Require email + room to match `meeting_nda_evidence` and confirmation room suffix. */
  scheduledVerification?: boolean;
};

export default function MeetRoom({ serverUrl, initialRoomSuffix, scheduledVerification }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [roomSlug, setRoomSlug] = useState(() => {
    const raw = initialRoomSuffix?.trim();
    if (!raw) return 'team-call';
    return raw.replace(/^investor-/i, '');
  });
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [welcomeStage, setWelcomeStage] = useState(false);

  const fullRoomName = useMemo(() => `investor-${roomSlug.replace(/^investor-/, '')}`, [roomSlug]);

  const join = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      let participantName = displayName.trim() || 'Guest';

      if (scheduledVerification) {
        const em = workEmail.trim().toLowerCase();
        if (!isValidInvestorEmail(em)) {
          setError('Enter the same work email from your meeting confirmation.');
          setConnecting(false);
          return;
        }
        const verifyRes = await fetch('/api/meeting/verify-join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: em,
            roomSuffix: roomSlug.replace(/^investor-/i, ''),
          }),
        });
        const verifyData = (await verifyRes.json()) as { error?: string; participantName?: string };
        if (!verifyRes.ok) {
          setError(verifyData.error ?? 'Could not verify your booking.');
          setConnecting(false);
          return;
        }
        participantName = verifyData.participantName?.trim() || 'Guest';
      }

      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: fullRoomName,
          participantName,
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
  }, [displayName, fullRoomName, roomSlug, scheduledVerification, workEmail]);

  const joinRef = useRef(join);

  useEffect(() => {
    joinRef.current = join;
  }, [join]);

  useEffect(() => {
    if (!welcomeStage || token) return;
    const id = window.setTimeout(() => {
      void joinRef.current();
    }, WELCOME_PLACEHOLDER_MS);
    return () => window.clearTimeout(id);
  }, [welcomeStage, token]);

  const leave = useCallback(() => {
    setToken(null);
    setError(null);
    setWelcomeStage(false);
  }, []);

  const canJoinScheduled =
    scheduledVerification && isValidInvestorEmail(workEmail.trim()) && roomSlug.trim().length > 0;
  const canJoinOpen = !scheduledVerification && roomSlug.trim().length > 0;
  const canJoin = scheduledVerification ? canJoinScheduled : canJoinOpen;

  const startWelcome = () => {
    if (!canJoin) return;
    setError(null);
    setWelcomeStage(true);
  };

  const backToLobby = () => {
    setWelcomeStage(false);
    setError(null);
  };

  if (!serverUrl) {
    return (
      <div className="parable-glass-panel border-[#00f2ff]/20 px-6 py-8 text-center text-sm text-white/70">
        <p className="font-semibold uppercase tracking-wider text-[#00f2ff]/90">Video service not configured</p>
        <p className="mt-2 text-white/50">This page needs a valid video service URL from the host.</p>
      </div>
    );
  }

  if (token) {
    return (
      <div className="investor-meeting-shell parable-livekit-root mx-auto w-full max-w-6xl border border-white/10 shadow-2xl">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#2d2d30] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Parable Meeting</p>
            <p className="truncate font-mono text-sm text-white/90">{fullRoomName}</p>
          </div>
          <button
            type="button"
            onClick={leave}
            className="shrink-0 rounded-md bg-[#c42b1c] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#a92317]"
          >
            Leave
          </button>
        </header>
        <div className="investor-meeting-stage min-h-[min(72dvh,640px)]">
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

  if (welcomeStage) {
    return (
      <div className="parable-glass-panel mx-auto w-full max-w-lg space-y-6 px-6 py-10 text-center">
        <p className="font-serif text-2xl text-white md:text-3xl">Welcome to Parable</p>
        <p className="text-sm text-white/50">A short welcome plays while we prepare your call.</p>

        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] shadow-inner">
          <div className="aspect-video w-full bg-gradient-to-br from-[#1a2a32] via-[#0f1418] to-[#0a0c10]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5">
                <span className="text-2xl text-white/40">▶</span>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/35">Welcome video</p>
              <p className="max-w-xs text-[11px] leading-relaxed text-white/30">
                Placeholder — your welcome clip will appear here. You&apos;ll join the meeting automatically.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#00f2ff]/50 investor-welcome-progress-bar" />
          </div>
        </div>

        {connecting ? (
          <p className="text-sm text-[#00f2ff]/80">Connecting to the room…</p>
        ) : (
          <p className="text-sm text-white/40">Joining in a moment…</p>
        )}

        {error ? (
          <div className="space-y-3">
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">{error}</p>
            <button
              type="button"
              onClick={backToLobby}
              className="text-xs font-semibold uppercase tracking-wider text-[#00f2ff] hover:underline"
            >
              ← Edit details
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="parable-glass-panel mx-auto w-full max-w-md space-y-5 px-6 py-8">
      <p className="parable-eyebrow text-center !tracking-[0.2em] text-white/50">Before you join</p>

      {scheduledVerification ? (
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
            Work email (must match booking)
          </span>
          <input
            type="email"
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@firm.com"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
          />
          <p className="mt-2 text-[10px] text-white/35">
            We verify this against your meeting registration before connecting you.
          </p>
        </label>
      ) : (
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Your name</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Jane Investor"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
          />
        </label>
      )}

      <div className="block text-left">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Room (suffix)</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 rounded-lg border border-[#00f2ff]/30 bg-black/40 px-3 py-3 font-mono text-xs text-[#00f2ff]">
            investor-
          </span>
          <input
            value={roomSlug.replace(/^investor-/, '')}
            onChange={(e) => {
              if (scheduledVerification) return;
              setRoomSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''));
            }}
            readOnly={scheduledVerification}
            placeholder="team-call"
            className={`min-w-0 flex-1 rounded-xl border px-4 py-3 font-mono text-sm outline-none ${
              scheduledVerification
                ? 'cursor-not-allowed border-white/10 bg-black/50 text-white/80'
                : 'border-white/15 bg-black/60 text-white focus:border-[#00f2ff]/50'
            }`}
          />
        </div>
        <p className="mt-2 text-[10px] text-white/35">
          {scheduledVerification ? (
            <>
              This room is fixed for your invite (
              <code className="text-white/50">investor-{roomSlug.replace(/^investor-/, '')}</code>).
            </>
          ) : (
            <>Use one shared suffix so everyone lands in the same call.</>
          )}
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-xs text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={startWelcome}
        disabled={!canJoin}
        className="w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.15)] hover:bg-[#00f2ff]/20 disabled:opacity-40"
      >
        Welcome to Parable
      </button>
    </div>
  );
}
