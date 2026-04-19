'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ConnectionState,
  LiveKitRoom,
  PreJoin,
  RoomAudioRenderer,
  StartAudio,
  VideoConference,
  type LocalUserChoices,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { DisconnectReason, MediaDeviceFailure } from 'livekit-client';
import { BackgroundBlur, VirtualBackground, supportsBackgroundProcessors } from '@livekit/track-processors';
import { MeetParticipantSettings } from '@/components/meet/MeetParticipantSettings';
import { MeetPreJoinSetupPanel } from '@/components/meet/MeetPreJoinSetupPanel';
import { MeetWelcomeClip } from '@/components/meet/MeetWelcomeClip';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import {
  BLUR_STRENGTH,
  type BlurStrength,
  type MeetBgPresetId,
  MEET_BG_PRESETS,
  createPresetBackgroundDataUrl,
  prepareUploadedBackgroundImage,
} from '@/lib/meet-virtual-background';

function mediaDeviceFailureMessage(failure: MediaDeviceFailure | undefined): string {
  switch (failure) {
    case MediaDeviceFailure.PermissionDenied:
      return 'Camera or microphone permission was denied. Allow access for this site in your browser settings, then reload.';
    case MediaDeviceFailure.NotFound:
      return 'No camera or microphone was found. Connect a device and try again.';
    case MediaDeviceFailure.DeviceInUse:
      return 'Another app is using your camera or microphone. Close it and try again.';
    case MediaDeviceFailure.Other:
    default:
      return 'Could not access camera or microphone. Check browser permissions and try again.';
  }
}

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
  const [masterKey, setMasterKey] = useState('');
  /** Server env PARABLE_MASTER_BYPASS_KEY — full access without booking or host key. */
  const [universalBypassKey, setUniversalBypassKey] = useState('');
  /** Scheduled /meet?join=scheduled: investor email, team host key, or universal bypass. */
  const [scheduledJoinMode, setScheduledJoinMode] = useState<'investor' | 'team' | 'bypass'>('investor');
  const [participantLabel, setParticipantLabel] = useState('');
  const [userChoices, setUserChoices] = useState<LocalUserChoices | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [copiedMeetingId, setCopiedMeetingId] = useState(false);

  /** PreJoin virtual background (LiveKit `videoProcessor` + remount key). */
  const [prejoinBg, setPrejoinBg] = useState<'none' | 'blur' | 'image' | 'preset'>('none');
  const [prejoinBlurStrength, setPrejoinBlurStrength] = useState<BlurStrength>('light');
  const [prejoinImageDataUrl, setPrejoinImageDataUrl] = useState<string | null>(null);
  const [prejoinPresetId, setPrejoinPresetId] = useState<MeetBgPresetId | null>(null);

  const fullRoomName = useMemo(() => `investor-${roomSlug.replace(/^investor-/, '')}`, [roomSlug]);

  /** false on SSR/first paint; updated after mount to avoid hydration mismatch. */
  const [supportsVirtualBg, setSupportsVirtualBg] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        setSupportsVirtualBg(supportsBackgroundProcessors());
      } catch {
        setSupportsVirtualBg(false);
      }
    });
  }, []);

  const prejoinPresetUrls = useMemo(() => {
    if (typeof window === 'undefined' || !supportsVirtualBg) return null;
    const m = new Map<MeetBgPresetId, string>();
    for (const p of MEET_BG_PRESETS) {
      m.set(p.id, createPresetBackgroundDataUrl(p.id));
    }
    return m;
  }, [supportsVirtualBg]);

  const prejoinVideoProcessor = useMemo(() => {
    if (!supportsVirtualBg) return undefined;
    if (prejoinBg === 'blur') return BackgroundBlur(BLUR_STRENGTH[prejoinBlurStrength]);
    if (prejoinBg === 'image' && prejoinImageDataUrl) return VirtualBackground(prejoinImageDataUrl);
    if (prejoinBg === 'preset' && prejoinPresetId && prejoinPresetUrls) {
      const u = prejoinPresetUrls.get(prejoinPresetId);
      if (u) return VirtualBackground(u);
    }
    return undefined;
  }, [
    supportsVirtualBg,
    prejoinBg,
    prejoinBlurStrength,
    prejoinImageDataUrl,
    prejoinPresetId,
    prejoinPresetUrls,
  ]);

  const preJoinRemountKey = useMemo(
    () =>
      `pj-${prejoinBg}-${prejoinBlurStrength}-${prejoinPresetId ?? 'np'}-${prejoinImageDataUrl ? prejoinImageDataUrl.slice(-40) : 'n'}`,
    [prejoinBg, prejoinBlurStrength, prejoinPresetId, prejoinImageDataUrl],
  );

  const handlePrejoinBgMode = useCallback((mode: 'none' | 'blur' | 'image' | 'preset') => {
    if (mode !== 'image') setPrejoinImageDataUrl(null);
    if (mode !== 'preset') setPrejoinPresetId(null);
    setPrejoinBg(mode);
  }, []);

  const handlePrejoinPreset = useCallback((id: MeetBgPresetId) => {
    setPrejoinImageDataUrl(null);
    setPrejoinPresetId(id);
    setPrejoinBg('preset');
  }, []);

  const handlePrejoinBlurStrength = useCallback((s: BlurStrength) => {
    setPrejoinBlurStrength(s);
  }, []);

  const handlePrejoinBgImage = useCallback(async (file: File) => {
    const dataUrl = await prepareUploadedBackgroundImage(file);
    setPrejoinImageDataUrl(dataUrl);
    setPrejoinPresetId(null);
    setPrejoinBg('image');
  }, []);

  const copyFullMeetingId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullRoomName);
      setCopiedMeetingId(true);
      window.setTimeout(() => setCopiedMeetingId(false), 2000);
    } catch {
      /* clipboard may be denied */
    }
  }, [fullRoomName]);

  const usingMasterKey = scheduledVerification && scheduledJoinMode === 'team';

  const join = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      let participantName = displayName.trim() || 'Guest';

      if (scheduledVerification) {
        if (scheduledJoinMode === 'bypass') {
          const verifyRes = await fetch('/api/meeting/verify-join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              universalBypassKey: universalBypassKey.trim(),
            }),
          });
          const verifyData = (await verifyRes.json()) as { error?: string; participantName?: string };
          if (!verifyRes.ok) {
            setError(verifyData.error ?? 'Access key not recognized.');
            setConnecting(false);
            return;
          }
          participantName = verifyData.participantName?.trim() || 'Parable Host';
        } else if (usingMasterKey) {
          const verifyRes = await fetch('/api/meeting/verify-join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              masterKey: masterKey.trim(),
              roomSuffix: roomSlug.replace(/^investor-/i, ''),
              participantName: displayName.trim(),
            }),
          });
          const verifyData = (await verifyRes.json()) as { error?: string; participantName?: string };
          if (!verifyRes.ok) {
            setError(verifyData.error ?? 'Could not verify host access.');
            setConnecting(false);
            return;
          }
          participantName = verifyData.participantName?.trim() || 'Guest';
        } else {
          const em = workEmail.trim().toLowerCase();
          if (!isValidInvestorEmail(em)) {
            setError('Enter the same email from your meeting confirmation.');
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
      setParticipantLabel(participantName);
      setUserChoices(null);
      setToken(data.token);
    } catch {
      setError('Network error');
    } finally {
      setConnecting(false);
    }
  }, [
    displayName,
    fullRoomName,
    masterKey,
    roomSlug,
    scheduledJoinMode,
    scheduledVerification,
    universalBypassKey,
    usingMasterKey,
    workEmail,
  ]);

  const joinRef = useRef(join);

  useEffect(() => {
    joinRef.current = join;
  }, [join]);

  const leave = useCallback(() => {
    setToken(null);
    setUserChoices(null);
    setParticipantLabel('');
    setError(null);
    setRoomError(null);
    setWelcomeStage(false);
    setPrejoinBg('none');
    setPrejoinBlurStrength('light');
    setPrejoinImageDataUrl(null);
    setPrejoinPresetId(null);
  }, []);

  const handlePreJoinSubmit = useCallback(
    async (choices: LocalUserChoices) => {
      setError(null);
      try {
        const trimmed = choices.username.trim();
        if (trimmed && trimmed !== participantLabel.trim()) {
          const res = await fetch('/api/livekit/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomName: fullRoomName,
              participantName: trimmed.slice(0, 80),
            }),
          });
          const data = (await res.json()) as { token?: string; error?: string };
          if (!res.ok || !data.token) {
            setError(data.error ?? 'Could not apply your display name.');
            return;
          }
          setToken(data.token);
          setParticipantLabel(trimmed);
        }
        setUserChoices(choices);
      } catch {
        setError('Network error');
      }
    },
    [fullRoomName, participantLabel],
  );

  const canJoinScheduled = scheduledVerification
    ? scheduledJoinMode === 'bypass'
      ? universalBypassKey.trim().length > 0
      : scheduledJoinMode === 'team'
        ? masterKey.trim().length > 0 && displayName.trim().length >= 1 && roomSlug.trim().length > 0
        : isValidInvestorEmail(workEmail.trim()) && roomSlug.trim().length > 0
    : false;
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

  const continueFromWelcome = useCallback(() => {
    void joinRef.current();
  }, []);

  if (!serverUrl) {
    return (
      <div className="parable-glass-panel border-[#00f2ff]/20 px-6 py-8 text-center text-sm text-white/70">
        <p className="font-semibold uppercase tracking-wider text-[#00f2ff]/90">Video service not configured</p>
        <p className="mt-2 text-white/50">This page needs a valid video service URL from the host.</p>
      </div>
    );
  }

  if (token && !userChoices) {
    return (
      <div className="parable-zoom-prejoin mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Join with audio and video</p>
            <p className="truncate font-mono text-xs text-white/55">{fullRoomName}</p>
          </div>
          <button
            type="button"
            onClick={leave}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/70 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-xs text-red-200">{error}</p>
        ) : null}
        <PreJoin
          key={preJoinRemountKey}
          className="rounded-2xl border border-white/10 bg-[#1b1b1d] p-4 shadow-2xl md:p-6"
          data-lk-theme="default"
          defaults={{ username: participantLabel || 'Guest' }}
          persistUserChoices
          joinLabel="Join meeting"
          micLabel="Microphone"
          camLabel="Camera"
          userLabel="Display name"
          videoProcessor={prejoinVideoProcessor}
          onSubmit={handlePreJoinSubmit}
          onError={(err) => setError(err.message)}
        />
        <MeetPreJoinSetupPanel
          bgMode={prejoinBg}
          onBgModeChange={handlePrejoinBgMode}
          blurStrength={prejoinBlurStrength}
          onBlurStrengthChange={handlePrejoinBlurStrength}
          selectedPresetId={prejoinPresetId}
          onPreset={handlePrejoinPreset}
          onPickBackgroundImage={handlePrejoinBgImage}
          supportsBackgrounds={supportsVirtualBg}
        />
      </div>
    );
  }

  if (token && userChoices) {
    const audioOpts = userChoices.audioEnabled
      ? { deviceId: userChoices.audioDeviceId || undefined }
      : false;
    const videoOpts = userChoices.videoEnabled
      ? { deviceId: userChoices.videoDeviceId || undefined }
      : false;

    return (
      <div className="investor-meeting-shell parable-livekit-root fixed inset-0 z-[100] flex w-full max-w-none flex-col border-0 border-white/10 bg-[#1b1b1d] shadow-none">
        <header className="flex shrink-0 flex-col gap-2 border-b border-white/[0.08] bg-[#2d2d30] px-[max(1rem,env(safe-area-inset-left))] pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Parable Meeting</p>
            <p className="truncate font-mono text-sm text-white/90">{fullRoomName}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-white/45">
              <ConnectionState />
            </div>
            <p className="mt-1 hidden text-[10px] text-white/35 sm:block">
              Bottom bar: microphone, camera, share screen, chat, settings (background & profile).
            </p>
          </div>
          <button
            type="button"
            onClick={leave}
            className="shrink-0 rounded-md bg-[#c42b1c] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#a92317]"
          >
            Leave
          </button>
        </header>
        {roomError ? (
          <div className="shrink-0 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-[11px] text-amber-100">
            {roomError}
          </div>
        ) : null}
        <div className="investor-meeting-stage min-h-0 flex-1">
          <LiveKitRoom
            key={token}
            token={token}
            serverUrl={serverUrl}
            connect
            audio={audioOpts}
            video={videoOpts}
            options={{
              adaptiveStream: true,
              dynacast: true,
            }}
            onConnected={() => setRoomError(null)}
            onError={(err) => {
              const msg = err instanceof Error ? err.message : String(err);
              setRoomError(msg);
            }}
            onMediaDeviceFailure={(failure) => setRoomError(mediaDeviceFailureMessage(failure))}
            onDisconnected={(reason) => {
              if (reason === DisconnectReason.CLIENT_INITIATED) {
                leave();
                return;
              }
              const byNum = DisconnectReason as unknown as Record<number, string>;
              const reasonLabel =
                reason === undefined ? 'unknown' : (byNum[reason] ?? String(reason));
              setRoomError(
                `Disconnected (${reasonLabel}). If you did not leave on purpose, check your network and that LiveKit is configured (NEXT_PUBLIC_LIVEKIT_URL, LIVEKIT_API_KEY/SECRET).`,
              );
            }}
            data-lk-theme="default"
          >
            <VideoConference SettingsComponent={MeetParticipantSettings} />
            <StartAudio label="Tap to enable meeting audio" />
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
        <p className="text-sm text-white/50">
          Watch the welcome clip, then continue to set up your microphone and camera.
        </p>

        <MeetWelcomeClip />

        {connecting ? (
          <p className="text-sm text-[#00f2ff]/80">Connecting…</p>
        ) : (
          <p className="text-xs text-white/35">When you&apos;re ready, continue to device setup.</p>
        )}

        {!error ? (
          <button
            type="button"
            onClick={continueFromWelcome}
            disabled={connecting}
            className="w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.15)] hover:bg-[#00f2ff]/20 disabled:opacity-40"
          >
            Continue to microphone &amp; camera
          </button>
        ) : null}

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
        <>
          <fieldset className="space-y-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
            <legend className="px-1 text-[10px] font-black uppercase tracking-wider text-white/40">How are you joining?</legend>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="scheduled-join-mode"
                checked={scheduledJoinMode === 'investor'}
                onChange={() => {
                  setScheduledJoinMode('investor');
                  setMasterKey('');
                  setUniversalBypassKey('');
                }}
                className="mt-1 h-4 w-4 shrink-0 border-[#00f2ff]/40 text-[#00f2ff]"
              />
              <span className="text-left text-sm text-white/70">
                Investor — use the <strong className="text-white/85">email</strong> from your booking confirmation
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="scheduled-join-mode"
                checked={scheduledJoinMode === 'team'}
                onChange={() => {
                  setScheduledJoinMode('team');
                  setWorkEmail('');
                  setUniversalBypassKey('');
                }}
                className="mt-1 h-4 w-4 shrink-0 border-[#00f2ff]/40 text-[#00f2ff]"
              />
              <span className="text-left text-sm text-white/70">
                Parable team — <strong className="text-white/85">host key</strong> (room suffix is in your confirmation email)
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="scheduled-join-mode"
                checked={scheduledJoinMode === 'bypass'}
                onChange={() => {
                  setScheduledJoinMode('bypass');
                  setMasterKey('');
                  setWorkEmail('');
                  setDisplayName('');
                  setUniversalBypassKey('');
                  const raw = initialRoomSuffix?.trim();
                  setRoomSlug(raw ? raw.replace(/^investor-/i, '') : 'scheduled-call');
                }}
                className="mt-1 h-4 w-4 shrink-0 border-[#00f2ff]/40 text-[#00f2ff]"
              />
              <span className="text-left text-sm text-white/70">
                Parable — <strong className="text-white/85">master access</strong> (one key only — no booking or other fields)
              </span>
            </label>
          </fieldset>

          {scheduledJoinMode === 'bypass' ? (
            <label className="block text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Master access key</span>
              <input
                type="text"
                name="parable-universal-bypass"
                value={universalBypassKey}
                onChange={(e) => setUniversalBypassKey(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder="Enter your access key"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#00f2ff]/50"
              />
              <span className="mt-1 block text-[10px] text-white/35">
                Joins the default scheduled room automatically. This option is only active when your host has configured a
                master access key on the server.
              </span>
            </label>
          ) : null}

          {usingMasterKey ? (
            <>
              <label className="block text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Host key</span>
                <input
                  type="text"
                  name="parable-host-key"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  inputMode="text"
                  placeholder="Paste the full key from your email"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#00f2ff]/50"
                />
                <span className="mt-1 block text-[10px] text-white/35">
                  Use the exact key from your confirmation message — punctuation and symbols (e.g. !) are allowed.
                </span>
              </label>
              <label className="block text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Your name in the call</span>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Host name"
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
                />
              </label>
            </>
          ) : scheduledJoinMode === 'investor' ? (
            <label className="block text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Email</span>
              <input
                type="email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@firm.com"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[#00f2ff]/50"
              />
            </label>
          ) : null}
        </>
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

      {!(scheduledVerification && scheduledJoinMode === 'bypass') ? (
        <div className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#00f2ff]/75">Host / meeting ID</span>
          <p className="mt-1 text-[10px] leading-relaxed text-white/38">
            {scheduledVerification ? (
              scheduledJoinMode === 'team' ? (
                <>Set the suffix for this call — the full meeting ID below is what LiveKit uses.</>
              ) : (
                <>This invite uses the room shown below. Investors: it should match your confirmation email.</>
              )
            ) : (
              <>Set the suffix — the full meeting ID is the host-facing room name everyone shares.</>
            )}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">Suffix (after investor-)</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="shrink-0 rounded-lg border border-[#00f2ff]/30 bg-black/40 px-3 py-3 font-mono text-xs text-[#00f2ff]">
              investor-
            </span>
            <input
              value={roomSlug.replace(/^investor-/, '')}
              onChange={(e) => {
                if (scheduledVerification && scheduledJoinMode === 'investor') return;
                setRoomSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''));
              }}
              readOnly={scheduledVerification && scheduledJoinMode === 'investor'}
              placeholder="team-call"
              className={`min-w-0 flex-1 rounded-xl border px-4 py-3 font-mono text-sm outline-none ${
                scheduledVerification && scheduledJoinMode === 'investor'
                  ? 'cursor-not-allowed border-white/10 bg-black/50 text-white/80'
                  : 'border-white/15 bg-black/60 text-white focus:border-[#00f2ff]/50'
              }`}
            />
          </div>
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#00f2ff]/20 bg-black/40 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/45">Full meeting ID</span>
              <p className="mt-1 break-all font-mono text-sm text-[#00f2ff]/95">{fullRoomName}</p>
            </div>
            <button
              type="button"
              onClick={() => void copyFullMeetingId()}
              className="shrink-0 rounded-lg border border-[#00f2ff]/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#00f2ff] hover:bg-[#00f2ff]/10"
            >
              {copiedMeetingId ? 'Copied' : 'Copy ID'}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/35">
            {scheduledVerification ? (
              scheduledJoinMode === 'team' ? (
                <>Use one shared suffix so hosts and guests land in the same room.</>
              ) : (
                <>
                  Scheduled room:{' '}
                  <code className="text-white/55">{fullRoomName}</code>
                </>
              )
            ) : (
              <>Use one shared suffix so everyone lands in the same call.</>
            )}
          </p>
        </div>
      ) : null}

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
