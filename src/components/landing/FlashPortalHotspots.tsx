"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  computeContainPortalLayout,
  type PortalHitBoxPx,
} from "@/components/landing/flash-portal-hit-layout";
import styles from "@/components/landing/flash-landing.module.css";

type FlashPortalHotspotsProps = {
  onInvestorPortal: () => void;
  onPresenterPortal: () => void;
};

function hitBoxToStyle(box: PortalHitBoxPx): React.CSSProperties {
  return {
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
  };
}

/**
 * Click targets sized to portal pills in pitchlock-flash.mp4 (9∶16, object-fit: contain).
 */
export default function FlashPortalHotspots({
  onInvestorPortal,
  onPresenterPortal,
}: FlashPortalHotspotsProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const investorRef = useRef<HTMLButtonElement>(null);
  const presenterRef = useRef<HTMLButtonElement>(null);
  const [investorBox, setInvestorBox] = useState<PortalHitBoxPx | null>(null);
  const [presenterBox, setPresenterBox] = useState<PortalHitBoxPx | null>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const measure = () => {
      const w = layer.clientWidth;
      const h = layer.clientHeight;
      const layout = computeContainPortalLayout(w, h);
      setInvestorBox(layout.investor);
      setPresenterBox(layout.presenter);

      const invEl = investorRef.current;
      const presEl = presenterRef.current;
      if (!invEl || !presEl) return;

      const layerRect = layer.getBoundingClientRect();
      const invRect = invEl.getBoundingClientRect();
      const presRect = presEl.getBoundingClientRect();

      // #region agent log
      fetch("http://127.0.0.1:7329/ingest/f8cf57c3-a1a6-410d-9396-9ae990b1d267", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4e3863" },
        body: JSON.stringify({
          sessionId: "4e3863",
          runId: "mobile-fit-v2",
          hypothesisId: "H-layout-mode",
          location: "FlashPortalHotspots.tsx:measure",
          message: "portal layout measure",
          data: {
            viewport: { w: window.innerWidth, h: window.innerHeight },
            objectFit: "contain",
            mediaAspect: "9:16",
            layer: { w, h },
            frame: layout.frame,
            investor: layout.investor,
            presenter: layout.presenter,
            measured: {
              investor: {
                left: invRect.left - layerRect.left,
                top: invRect.top - layerRect.top,
                w: invRect.width,
                h: invRect.height,
              },
              presenter: {
                left: presRect.left - layerRect.left,
                top: presRect.top - layerRect.top,
                w: presRect.width,
                h: presRect.height,
              },
            },
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const logClick = (portal: "investor" | "presenter", phase: "pointerdown" | "click") => {
    // #region agent log
    fetch("http://127.0.0.1:7329/ingest/f8cf57c3-a1a6-410d-9396-9ae990b1d267", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4e3863" },
      body: JSON.stringify({
        sessionId: "4e3863",
        runId: "post-fix-cover",
        hypothesisId: "H-route",
        location: "FlashPortalHotspots.tsx:interaction",
        message: "portal hotspot interaction",
        data: { portal, phase },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  return (
    <div ref={layerRef} className={styles.portalHitLayer} role="group" aria-label="Portal access">
      <button
        ref={investorRef}
        type="button"
        className={`${styles.portalHit} ${styles.portalHitInvestor}`}
        style={investorBox ? hitBoxToStyle(investorBox) : undefined}
        disabled={!investorBox}
        onPointerDown={() => logClick("investor", "pointerdown")}
        onClick={() => {
          logClick("investor", "click");
          onInvestorPortal();
        }}
        aria-label="Investor Portal — access your private dashboard"
      />
      <button
        ref={presenterRef}
        type="button"
        className={`${styles.portalHit} ${styles.portalHitPresenter}`}
        style={presenterBox ? hitBoxToStyle(presenterBox) : undefined}
        disabled={!presenterBox}
        onPointerDown={() => logClick("presenter", "pointerdown")}
        onClick={() => {
          logClick("presenter", "click");
          onPresenterPortal();
        }}
        aria-label="Presenter Portal — access your private dashboard"
      />
    </div>
  );
}
