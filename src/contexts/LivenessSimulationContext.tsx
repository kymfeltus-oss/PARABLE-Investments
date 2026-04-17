"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  LIVENESS_STORAGE_KEY,
  formatLivenessTickerLine,
  formatPaymentToast,
  getDefaultLivenessEnabled,
  shouldShowLiveEmojiPath,
} from "@/lib/liveness-simulation-config";

type ToastItem = { id: string; text: string };

type LivenessSimulationContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  /** Added to base follower counts (slow creep). */
  followerSimBonus: number;
  /** Shared “heat” offset for viewer/like style stats. */
  flashMobBoost: number;
  /** Monotonic pulse for optional subscribers. */
  pulse: number;
  tickerLines: string[];
  /** Pop a toast (also used internally). */
  pushToast: (text: string) => void;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  showLiveEmojiOverlay: boolean;
};

const LivenessSimulationContext = createContext<LivenessSimulationContextValue | null>(null);

function readStoredEnabled(): boolean | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(LIVENESS_STORAGE_KEY);
  if (v === "off") return false;
  if (v === "on") return true;
  return null;
}

function writeStoredEnabled(enabled: boolean) {
  localStorage.setItem(LIVENESS_STORAGE_KEY, enabled ? "on" : "off");
}

function scheduleNextHeartbeat(cb: () => void): number {
  const ms = 3000 + Math.floor(Math.random() * 5000);
  return window.setTimeout(cb, ms);
}

export function LivenessSimulationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [enabled, setEnabledState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [followerSimBonus, setFollowerSimBonus] = useState(0);
  const [flashMobBoost, setFlashMobBoost] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [tickerLines, setTickerLines] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const heartbeatRef = useRef<number | null>(null);
  const followerTimerRef = useRef<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const stored = readStoredEnabled();
    setEnabledState(stored !== null ? stored : getDefaultLivenessEnabled());
    setHydrated(true);
    return () => {
      mounted.current = false;
    };
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    writeStoredEnabled(next);
  }, []);

  const pushToast = useCallback((text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((t) => [...t.slice(-4), { id, text }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 5200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showLiveEmojiOverlay =
    hydrated && enabled && shouldShowLiveEmojiPath(pathname ?? null);

  useEffect(() => {
    if (!hydrated || !enabled) {
      if (heartbeatRef.current) {
        clearTimeout(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      return;
    }

    const run = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        heartbeatRef.current = scheduleNextHeartbeat(run);
        return;
      }

      const line = formatLivenessTickerLine();
      setTickerLines((prev) => [...prev.slice(-20), line]);

      setFlashMobBoost((b) => Math.min(b + randSmall(), 500));
      setPulse((p) => p + 1);

      if (Math.random() < 0.14) {
        pushToast(formatPaymentToast());
      }

      heartbeatRef.current = scheduleNextHeartbeat(run);
    };

    function randSmall() {
      const opts = [1, 2, 2, 3, 4, 5, 5];
      return opts[Math.floor(Math.random() * opts.length)];
    }

    heartbeatRef.current = scheduleNextHeartbeat(run);
    return () => {
      if (heartbeatRef.current) clearTimeout(heartbeatRef.current);
      heartbeatRef.current = null;
    };
  }, [hydrated, enabled, pushToast]);

  useEffect(() => {
    if (!hydrated || !enabled) {
      if (followerTimerRef.current) {
        clearTimeout(followerTimerRef.current);
        followerTimerRef.current = null;
      }
      return;
    }

    const tick = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      setFollowerSimBonus((b) => b + (Math.random() < 0.5 ? 1 : 2));
    };

    const schedule = () => {
      const ms = 55000 + Math.floor(Math.random() * 12000);
      followerTimerRef.current = window.setTimeout(() => {
        tick();
        schedule();
      }, ms);
    };

    schedule();
    return () => {
      if (followerTimerRef.current) clearTimeout(followerTimerRef.current);
      followerTimerRef.current = null;
    };
  }, [hydrated, enabled]);

  const value = useMemo<LivenessSimulationContextValue>(
    () => ({
      enabled: hydrated ? enabled : false,
      setEnabled,
      followerSimBonus,
      flashMobBoost,
      pulse,
      tickerLines,
      pushToast,
      toasts,
      dismissToast,
      showLiveEmojiOverlay,
    }),
    [
      hydrated,
      enabled,
      setEnabled,
      followerSimBonus,
      flashMobBoost,
      pulse,
      tickerLines,
      pushToast,
      toasts,
      dismissToast,
      showLiveEmojiOverlay,
    ]
  );

  return (
    <LivenessSimulationContext.Provider value={value}>{children}</LivenessSimulationContext.Provider>
  );
}

export function useLivenessSimulation(): LivenessSimulationContextValue {
  const ctx = useContext(LivenessSimulationContext);
  if (!ctx) {
    throw new Error("useLivenessSimulation must be used within LivenessSimulationProvider");
  }
  return ctx;
}

/** Returns null if outside provider (use for optional overlays). */
export function useLivenessSimulationOptional(): LivenessSimulationContextValue | null {
  return useContext(LivenessSimulationContext);
}

/** Display value with flash-mob heat (capped). */
export function useFlashMobDisplay(base: number, salt = 0): number {
  const ctx = useLivenessSimulationOptional();
  if (!ctx?.enabled) return base;
  const jitter = Math.abs(salt) % 7;
  return Math.min(base + ctx.flashMobBoost + jitter, base + 220);
}
