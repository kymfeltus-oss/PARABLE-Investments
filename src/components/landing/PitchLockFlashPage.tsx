"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FlashPortalHotspots from "@/components/landing/FlashPortalHotspots";
import FlashSoundToggle from "@/components/landing/FlashSoundToggle";
import PitchLockFlashHeroMedia from "@/components/landing/PitchLockFlashHeroMedia";
import { hasPitchAccessSignedFlag } from "@/lib/pitch-access-storage";
import styles from "@/components/landing/flash-landing.module.css";

const INVESTOR_DASHBOARD = "/dashboard/investor";
const PRESENTER_DASHBOARD = "/dashboard/presenter";

/**
 * Flash intro — full-screen hero video + invisible hotspots on baked-in portal pills.
 */
export default function PitchLockFlashPage() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const log = () => {
      const rect = stage.getBoundingClientRect();
      const mediaAspect = 9 / 16;
      const stageAspect = rect.width / rect.height;
      const containLetterboxX = stageAspect > mediaAspect;
      // #region agent log
      fetch("http://127.0.0.1:7329/ingest/f8cf57c3-a1a6-410d-9396-9ae990b1d267", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4e3863" },
        body: JSON.stringify({
          sessionId: "4e3863",
          runId: "flash-9x16-contain",
          hypothesisId: "H-contain-frame",
          location: "PitchLockFlashPage.tsx:layout",
          message: "flash stage geometry",
          data: {
            inner: { w: window.innerWidth, h: window.innerHeight },
            stage: { w: rect.width, h: rect.height },
            mediaAspect: "9:16",
            containLetterboxX,
            dpr: window.devicePixelRatio,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };
    log();
    window.addEventListener("resize", log);
    return () => window.removeEventListener("resize", log);
  }, []);

  const enterInvestorPortal = () => {
    const signed = hasPitchAccessSignedFlag();
    const dest = signed ? INVESTOR_DASHBOARD : `/nda?next=${encodeURIComponent(INVESTOR_DASHBOARD)}`;
    // #region agent log
    fetch("http://127.0.0.1:7329/ingest/f8cf57c3-a1a6-410d-9396-9ae990b1d267", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4e3863" },
      body: JSON.stringify({
        sessionId: "4e3863",
        runId: "post-fix-align",
        hypothesisId: "H-route",
        location: "PitchLockFlashPage.tsx:enterInvestorPortal",
        message: "investor portal route",
        data: { signed, dest },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    router.push(dest);
  };

  const enterPresenterPortal = () => {
    // #region agent log
    fetch("http://127.0.0.1:7329/ingest/f8cf57c3-a1a6-410d-9396-9ae990b1d267", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4e3863" },
      body: JSON.stringify({
        sessionId: "4e3863",
        runId: "post-fix-align",
        hypothesisId: "H-route",
        location: "PitchLockFlashPage.tsx:enterPresenterPortal",
        message: "presenter portal route",
        data: { dest: PRESENTER_DASHBOARD },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    router.push(PRESENTER_DASHBOARD);
  };

  return (
    <main className={styles.flashRoot}>
      <div ref={stageRef} className={styles.flashStage}>
        <header className={styles.flashHeader}>
          <FlashSoundToggle />
        </header>

        <div className={styles.flashBackdrop} aria-hidden="true" />

        <div className={styles.flashImageFrame}>
          <PitchLockFlashHeroMedia className={styles.flashImage} />
        </div>

        <FlashPortalHotspots
          onInvestorPortal={enterInvestorPortal}
          onPresenterPortal={enterPresenterPortal}
        />
      </div>
    </main>
  );
}
