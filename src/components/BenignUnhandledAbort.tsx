"use client";

import { useEffect } from "react";

function isBenignAbortReason(reason: unknown): boolean {
  if (reason == null) return false;
  if (reason instanceof DOMException) {
    return (
      reason.name === "AbortError" ||
      /aborted|abort/i.test(String(reason.message ?? ""))
    );
  }
  if (reason instanceof Error) {
    return (
      reason.name === "AbortError" ||
      /aborted|abort/i.test(reason.message)
    );
  }
  if (typeof reason === "string") {
    return /aborted|abort/i.test(reason);
  }
  return false;
}

/**
 * Next.js navigation, HMR, Supabase client, and prefetch often cancel in-flight work.
 * Those rejections surface as AbortError / "signal is aborted without reason" and are
 * usually harmless; preventing default avoids polluting the runtime error overlay.
 */
export default function BenignUnhandledAbort() {
  useEffect(() => {
    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (isBenignAbortReason(e.reason)) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
  }, []);

  return null;
}
