"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import FlashPortalHotspots from "@/components/landing/FlashPortalHotspots";
import FlashSoundToggle from "@/components/landing/FlashSoundToggle";
import PitchLockFlashHeroMedia from "@/components/landing/PitchLockFlashHeroMedia";
import { hasPitchAccessSignedFlag } from "@/lib/pitch-access-storage";
import styles from "@/components/landing/flash-animations-preview.module.css";

const INVESTOR_DASHBOARD = "/dashboard/investor";
const PRESENTER_DASHBOARD = "/dashboard/presenter";
const PILLAR_COUNT = 96;

/** Fixed particle coords — no random math at render (hydration-safe). */
const VIEWPORT_PARTICLES: {
  left: string;
  top: string;
  tone: "cyan" | "purple" | "white";
  delay: string;
}[] = [
  { left: "8%", top: "18%", tone: "cyan", delay: "0s" },
  { left: "14%", top: "42%", tone: "cyan", delay: "1.2s" },
  { left: "6%", top: "62%", tone: "white", delay: "2.1s" },
  { left: "22%", top: "28%", tone: "cyan", delay: "0.6s" },
  { left: "4%", top: "78%", tone: "cyan", delay: "1.8s" },
  { left: "88%", top: "16%", tone: "purple", delay: "0.4s" },
  { left: "92%", top: "38%", tone: "purple", delay: "1.4s" },
  { left: "86%", top: "58%", tone: "white", delay: "2.4s" },
  { left: "78%", top: "24%", tone: "purple", delay: "0.9s" },
  { left: "94%", top: "72%", tone: "purple", delay: "1.6s" },
  { left: "48%", top: "12%", tone: "white", delay: "2.8s" },
  { left: "52%", top: "88%", tone: "cyan", delay: "0.2s" },
];

type FlashLiveEnvironmentProps = {
  showDevBanner?: boolean;
};

/**
 * Sandbox-only living backdrop + centered flyer + portal hotspots.
 * Production intro (`PitchLockFlashPage`) is intentionally unchanged.
 */
export default function FlashLiveEnvironment({ showDevBanner = true }: FlashLiveEnvironmentProps) {
  const router = useRouter();
  const [pointerFine, setPointerFine] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const pillars = useMemo(
    () =>
      Array.from({ length: PILLAR_COUNT }, (_, i) => {
        const t = i / (PILLAR_COUNT - 1);
        const fade = Math.min(1, Math.max(0.12, (t - 0.08) / 0.72));
        return {
          id: i,
          maxHeight: 14 + ((i * 19) % 86),
          duration: `${0.7 + ((i * 11) % 90) / 100}s`,
          delay: `${((i * 5) % 50) / 100}s`,
          opacity: fade,
          side: i < PILLAR_COUNT / 2 ? ("left" as const) : ("right" as const),
        };
      }),
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setPointerFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pointerFine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x, y });
  }, [pointerFine]);

  const enterInvestorPortal = () => {
    if (hasPitchAccessSignedFlag()) {
      router.push(INVESTOR_DASHBOARD);
      return;
    }
    router.push(`/nda?next=${encodeURIComponent(INVESTOR_DASHBOARD)}`);
  };

  const enterPresenterPortal = () => {
    router.push(PRESENTER_DASHBOARD);
  };

  return (
    <main className={styles.previewRoot}>
      {showDevBanner ? (
        <p className={styles.previewBanner}>
          Sandbox — living flash environment (not production). Home intro: <a href="/">/</a>
        </p>
      ) : null}

      <div className={styles.flashViewport} onMouseMove={onMouseMove}>
        <div className={styles.soundHeaderSlot}>
          <FlashSoundToggle />
        </div>
        {pointerFine ? (
          <div
            className={styles.mouseGlow}
            aria-hidden="true"
            style={{
              left: `${glowPos.x}%`,
              top: `${glowPos.y}%`,
            }}
          />
        ) : null}

        <div className={styles.envLayer} aria-hidden="true">
          <div className={styles.atmoLeft} />
          <div className={styles.atmoRight} />
          <div className={styles.vignetteCenter} />

          <svg className={styles.orbitField} viewBox="0 0 1200 800" preserveAspectRatio="none">
            <ellipse className={styles.orbitCyan} cx="180" cy="400" rx="320" ry="260" />
            <ellipse className={styles.orbitPurple} cx="1020" cy="380" rx="300" ry="280" />
            <path className={styles.orbitCyan} d="M 0 520 Q 400 120 800 600" fill="none" />
            <path className={styles.orbitPurple} d="M 1200 180 Q 800 520 400 320" fill="none" />
          </svg>

          {VIEWPORT_PARTICLES.map((p, i) => (
            <span
              key={`vp-${i}`}
              className={`${styles.particle} ${styles[`particle${p.tone === "cyan" ? "Cyan" : p.tone === "purple" ? "Purple" : "White"}`]}`}
              style={{ left: p.left, top: p.top, animationDelay: p.delay }}
            />
          ))}

          <div className={styles.scanLight} />

          <div className={styles.skylineField}>
            <div className={styles.skylineBaseGlow} />
            <div className={styles.skylineContainer}>
              {pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className={styles.skylinePillar}
                  style={{
                    ["--pillar-max" as string]: `${pillar.maxHeight}px`,
                    ["--pillar-dur" as string]: pillar.duration,
                    ["--pillar-delay" as string]: pillar.delay,
                    opacity: pillar.opacity,
                  }}
                >
                  <div
                    className={
                      pillar.side === "left"
                        ? styles.skylineColumnCyan
                        : styles.skylineColumnPurple
                    }
                  >
                    <span className={styles.skylineCap} />
                    <span className={styles.skylineStem} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.flashStage}>
          <PitchLockFlashHeroMedia className={styles.flashFlyer} />
          <FlashPortalHotspots
            onInvestorPortal={enterInvestorPortal}
            onPresenterPortal={enterPresenterPortal}
          />
        </div>
      </div>
    </main>
  );
}
