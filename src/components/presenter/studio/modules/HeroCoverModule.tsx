"use client";

import { useEffect, useState } from "react";
import { StudioField, StudioModuleEditor } from "../StudioModuleEditor";
import { useStudioProfile } from "../useStudioProfile";

export function HeroCoverModule() {
  const studio = useStudioProfile();
  const [heroCoverImageUrl, setHeroCoverImageUrl] = useState("");

  useEffect(() => {
    if (!studio.loading) setHeroCoverImageUrl(studio.profile.heroCoverImageUrl ?? "");
  }, [studio.loading, studio.profile.heroCoverImageUrl]);

  return (
    <StudioModuleEditor
      title="Hero Cover Builder"
      subtitle="Visual atmosphere"
      lead="Soft banner imagery behind the investor welcome — cyan and purple atmosphere, never gold."
      busy={studio.busy}
      message={studio.message}
      error={studio.error}
      loading={studio.loading}
      onSave={() => studio.savePartial({ heroCoverImageUrl: heroCoverImageUrl || null })}
    >
      <StudioField id="heroCoverImageUrl" label="Hero cover image" hint="HTTPS URL, wide or portrait">
        <input
          id="heroCoverImageUrl"
          className="pl-input w-full"
          type="url"
          value={heroCoverImageUrl}
          onChange={(e) => setHeroCoverImageUrl(e.target.value)}
        />
      </StudioField>
      {heroCoverImageUrl ? (
        <div
          className="mt-4 h-40 rounded-xl border border-white/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCoverImageUrl})` }}
          role="img"
          aria-label="Hero preview"
        />
      ) : null}
    </StudioModuleEditor>
  );
}
