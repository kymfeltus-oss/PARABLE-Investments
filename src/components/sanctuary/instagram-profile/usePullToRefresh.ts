"use client";

import { useCallback, useRef, useState } from "react";

const THRESHOLD_PX = 72;

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const scrollEl = useRef<HTMLElement | null>(null);

  const attachRef = useCallback((el: HTMLElement | null) => {
    scrollEl.current = el;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = scrollEl.current;
    if (!el || el.scrollTop > 2) return;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const el = scrollEl.current;
    if (startY.current == null || !el || el.scrollTop > 2) return;
    const y = e.touches[0].clientY;
    const delta = y - startY.current;
    if (delta > 0) {
      const damped = Math.min(THRESHOLD_PX * 1.2, delta * 0.45);
      pullRef.current = damped;
      setPullDistance(damped);
    }
  }, []);

  const onTouchEnd = useCallback(async () => {
    startY.current = null;
    const d = pullRef.current;
    pullRef.current = 0;
    if (d >= THRESHOLD_PX * 0.85 && !refreshingRef.current) {
      refreshingRef.current = true;
      setRefreshing(true);
      setPullDistance(0);
      try {
        await onRefresh();
      } finally {
        refreshingRef.current = false;
        setRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  }, [onRefresh]);

  return {
    attachRef,
    scrollProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    pullDistance,
    refreshing,
  };
}
