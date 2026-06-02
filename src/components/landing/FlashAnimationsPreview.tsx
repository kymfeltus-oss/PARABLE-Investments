"use client";

import FlashLiveEnvironment from "@/components/landing/FlashLiveEnvironment";

/** Dev sandbox for flash intro experiments — not wired to production `/`. */
export default function FlashAnimationsPreview() {
  return <FlashLiveEnvironment showDevBanner />;
}
