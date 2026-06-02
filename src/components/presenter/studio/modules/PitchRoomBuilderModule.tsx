"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StudioField, StudioModuleEditor } from "../StudioModuleEditor";
import { useStudioProfile } from "../useStudioProfile";

export function PitchRoomBuilderModule() {
  const studio = useStudioProfile();
  const [pitchRoomSlug, setPitchRoomSlug] = useState("demo");

  useEffect(() => {
    if (!studio.loading) setPitchRoomSlug(studio.profile.pitchRoomSlug || "demo");
  }, [studio.loading, studio.profile.pitchRoomSlug]);

  return (
    <StudioModuleEditor
      title="Pitch Room Builder"
      subtitle="Deck & narrative"
      lead="Connect your protected pitch room. Investors enter here after the welcome experience."
      busy={studio.busy}
      message={studio.message}
      error={studio.error}
      loading={studio.loading}
      onSave={() => studio.savePartial({ pitchRoomSlug })}
    >
      <StudioField id="pitchRoomSlug" label="Pitch room slug" hint="Published investors route to /pitch">
        <input
          id="pitchRoomSlug"
          className="pl-input w-full"
          value={pitchRoomSlug}
          onChange={(e) => setPitchRoomSlug(e.target.value)}
        />
      </StudioField>
      <Link href="/pitch" className="pl-btn pl-btn-outline w-full justify-center sm:w-auto">
        Open pitch room builder →
      </Link>
    </StudioModuleEditor>
  );
}
