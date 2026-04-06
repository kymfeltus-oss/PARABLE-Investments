"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Screen = { title: string; body: string; accent: string };

const DEFAULT_SCREENS: Screen[] = [
  {
    title: "Command",
    body: "Unified ops, alerts, and approvals in one glass pane.",
    accent: "from-teal-500/40 to-violet-600/30",
  },
  {
    title: "Insights",
    body: "Live telemetry with policy-aware drill-downs.",
    accent: "from-violet-500/40 to-teal-500/25",
  },
  {
    title: "Deploy",
    body: "Progressive rollout with instant rollback hooks.",
    accent: "from-teal-400/35 to-white/10",
  },
];

export default function ProductPreview3D({
  screens = DEFAULT_SCREENS,
  productName = "Product",
}: {
  screens?: Screen[];
  productName?: string;
}) {
  const [index, setIndex] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const rotateY = useMotionValue(0);
  const smoothRotate = useSpring(rotateY, { stiffness: 80, damping: 18 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - startX.current;
      startX.current = e.clientX;
      rotateY.set(rotateY.get() + dx * 0.35);
    },
    [rotateY],
  );

  const endDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  const screen = screens[index % screens.length];

  return (
    <div
      className="relative mx-auto w-full max-w-[320px] select-none"
      aria-label={`Interactive 3D preview of ${productName}`}
    >
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
        Drag to rotate · Tap dots to change screen
      </p>
      <div
        className="relative aspect-[10/19] cursor-grab active:cursor-grabbing"
        style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="application"
        aria-roledescription="rotating device mockup"
      >
        <motion.div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            rotateY: smoothRotate,
          }}
        >
          <div
            className="absolute inset-[4%] rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.65)]"
            style={{ transform: "translateZ(0px)" }}
          >
            <div className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-black/60" />
            <div
              className={[
                "absolute inset-[7%] overflow-hidden rounded-[1.35rem] bg-gradient-to-br p-4",
                screen.accent,
              ].join(" ")}
            >
              <div className="flex h-full flex-col rounded-xl border border-white/10 bg-black/55 p-3 backdrop-blur-md">
                <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-white/45">
                  <span>{productName}</span>
                  <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-teal-300">
                    Live
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{screen.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {screen.body}
                </p>
                <div className="mt-auto space-y-2 pt-4">
                  <div className="h-2 w-3/4 rounded-full bg-white/10" />
                  <div className="h-2 w-1/2 rounded-full bg-white/10" />
                  <div className="h-2 w-5/6 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-y-[10%] right-[2%] w-[3%] rounded-r-2xl bg-gradient-to-l from-white/10 to-transparent opacity-60"
            style={{ transform: "rotateY(90deg) translateZ(-8px)" }}
            aria-hidden
          />
        </motion.div>
      </div>
      <div
        className="mt-4 flex justify-center gap-2"
        role="tablist"
        aria-label="Preview screens"
      >
        {screens.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={[
              "h-2.5 w-2.5 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-teal-400",
              i === index ? "bg-teal-400 scale-110" : "bg-white/20 hover:bg-white/40",
            ].join(" ")}
            aria-label={`Screen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
