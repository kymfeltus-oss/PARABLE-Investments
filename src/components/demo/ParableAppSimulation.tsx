"use client";

/**
 * PARABLE click-through simulation for the investor site only.
 * Self-contained: no Supabase, LiveKit, or main PARABLE app bundle.
 */

import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type Screen = "login" | "hub" | "liveStudio" | "testify";

const CYAN = "#00f2fe";

function ParableWordmark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-full border border-white/10 bg-black/55 px-5 py-3 ${className}`}
      style={{ boxShadow: `0 0 28px ${CYAN}33` }}
    >
      <span
        className="font-black tracking-[0.2em] text-lg sm:text-xl"
        style={{
          color: CYAN,
          textShadow: `0 0 18px ${CYAN}88`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        PARABLE
      </span>
    </div>
  );
}

function MatrixBackdrop() {
  const cols = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${(i / 18) * 100}%`,
        delay: `${(i % 7) * 0.35}s`,
        dur: `${6 + (i % 5)}s`,
      })),
    [],
  );
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] opacity-25"
      aria-hidden
    >
      {cols.map((c) => (
        <div
          key={c.id}
          className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-[#00f2fe]/40 to-transparent animate-[matrix_8s_linear_infinite]"
          style={
            {
              left: c.left,
              height: "120%",
              animationDelay: c.delay,
              animationDuration: c.dur,
            } as CSSProperties
          }
        />
      ))}
      <style>{`
        @keyframes matrix {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}

function LoginScreen({ onEnter }: { onEnter: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(() => {
    setErr(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!email.trim() || !password.trim()) {
        setErr("Invalid login credentials");
        return;
      }
      onEnter();
    }, 420);
  }, [email, password, onEnter]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${CYAN}22, transparent 50%)`,
        }}
      />
      <MatrixBackdrop />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 flex w-full max-w-md flex-col items-center gap-4">
          <ParableWordmark />
          <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-white/45">
            Investor preview · simulation only
          </p>
        </div>

        <div
          className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 p-8 shadow-[0_0_80px_rgba(0,242,254,0.12)]"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.5))",
          }}
        >
          <div
            className="pointer-events-none absolute -inset-px rounded-[28px] opacity-50"
            style={{
              background: `conic-gradient(from 200deg, transparent, ${CYAN}33, transparent)`,
            }}
          />
          <div className="relative space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#00f2fe]/55 focus:ring-1 focus:ring-[#00f2fe]/30"
                placeholder="you@example.com"
                autoComplete="off"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setErr("Reset link sent (simulated).")}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/85 hover:text-[#00f2ff]"
                >
                  Reset
                </button>
              </div>
              <div className="mt-2 flex rounded-2xl border border-[#00f2fe]/40 bg-black/70 ring-1 ring-[#00f2fe]/20">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? "text" : "password"}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-white outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="shrink-0 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {err && (
              <div
                className={`rounded-xl border px-4 py-3 text-xs font-semibold ${
                  err.includes("simulated")
                    ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-200/90"
                    : "border-red-500/35 bg-red-950/50 text-red-200/90"
                }`}
              >
                {err}
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={signIn}
              className="w-full rounded-2xl py-3.5 text-[11px] font-black uppercase tracking-[0.35em] text-black transition hover:brightness-110 disabled:opacity-50"
              style={{
                background: `linear-gradient(90deg, ${CYAN}, #5af0ff)`,
                boxShadow: `0 0 32px ${CYAN}44`,
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <p className="text-center text-[10px] text-white/35">
              Any non-empty email and password continues the walkthrough.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HubScreen({ go }: { go: (s: Screen) => void }) {
  const tiles = [
    { id: "tele" as const, label: "Tele", icon: "📄" },
    { id: "check" as const, label: "Check", icon: "✨" },
    { id: "ai" as const, label: "AI", icon: "⭐" },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#050508] text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md">
        <ParableWordmark className="scale-90" />
        <button
          type="button"
          onClick={() => go("login")}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#00f2ff]"
        >
          Exit sim
        </button>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-28 pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#00f2ff]/70">
          Creator surface
        </p>
        <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#00f2ff]">
          Quick actions
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Tap tiles to move through the mock product shell.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {tiles.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go("testify")}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-6 transition hover:border-[#00f2ff]/35 hover:bg-white/[0.07]"
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go("liveStudio")}
          className="mt-10 w-full rounded-2xl border border-[#00f2ff]/30 bg-[#00f2ff]/10 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-[#00f2ff] hover:bg-[#00f2ff]/15"
        >
          Open live studio
        </button>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/85 px-2 py-2 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg justify-around">
          {(
            [
              ["Feed", "testify"],
              ["Messages", "hub"],
              ["Sanctuary", "hub"],
              ["Worship", "hub"],
            ] as const
          ).map(([label, target]) => (
            <button
              key={label}
              type="button"
              onClick={() => go(target === "testify" ? "testify" : "hub")}
              className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white/45 hover:text-[#00f2ff]"
            >
              <span
                className="h-6 w-6 rounded-full border border-white/15 bg-white/5"
                aria-hidden
              />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function LiveStudioScreen({ go }: { go: (s: Screen) => void }) {
  const [going, setGoing] = useState(false);
  const [live, setLive] = useState(false);

  const goLive = () => {
    setGoing(true);
    setTimeout(() => {
      setGoing(false);
      const ok = Math.random() > 0.35;
      if (ok) setLive(true);
      else {
        window.alert(
          "Go Live failed\n\nMissing LiveKit environment variables. (simulated.)",
        );
      }
    }, 900);
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${CYAN}18, transparent 45%)`,
        }}
      />
      <main className="relative z-10 mx-auto max-w-lg px-4 pb-24 pt-6">
        <button
          type="button"
          onClick={() => go("hub")}
          className="mb-6 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-[9px] font-black uppercase tracking-[0.25em] text-white/55 hover:border-[#00f2ff]/30"
        >
          ← Back
        </button>
        <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          Live studio
        </h1>
        <p className="mt-2 text-xl font-black text-[#00f2ff]">Broadcast desk</p>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-wider text-white/70"
          >
            Cam on
          </button>
          <button
            type="button"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-wider text-white/70"
          >
            Mic on
          </button>
        </div>
        <button
          type="button"
          disabled={going}
          onClick={goLive}
          className="mt-8 w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.35em] text-black disabled:opacity-50"
          style={{ background: `linear-gradient(90deg, ${CYAN}, #7ef9ff)` }}
        >
          {going ? "Connecting…" : live ? "On air (sim)" : "Go live"}
        </button>
        {live && (
          <p className="mt-4 text-center text-sm text-emerald-300/90">
            You’re live — room is mocked.
          </p>
        )}
      </main>
    </div>
  );
}

function TestifyScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f2ff]">
          Testify
        </span>
        <button
          type="button"
          onClick={() => go("hub")}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white"
        >
          Close
        </button>
      </header>
      <div className="mx-auto max-w-md space-y-4 px-4 py-8">
        <div className="aspect-[9/16] w-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/80" />
        <p className="text-center text-xs text-white/45">
          Vertical feed placeholder — simulation only.
        </p>
      </div>
    </div>
  );
}

export function ParableAppSimulation() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <div className="min-h-[100dvh] bg-black antialiased">
      {screen === "login" && <LoginScreen onEnter={() => setScreen("hub")} />}
      {screen === "hub" && <HubScreen go={setScreen} />}
      {screen === "liveStudio" && <LiveStudioScreen go={setScreen} />}
      {screen === "testify" && <TestifyScreen go={setScreen} />}
    </div>
  );
}

export default ParableAppSimulation;
