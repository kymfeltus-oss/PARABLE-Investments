"use client";

import { useEffect, useState } from "react";
import { StudioField, StudioModuleEditor } from "../StudioModuleEditor";
import { useStudioProfile } from "../useStudioProfile";

export function WelcomeExperienceModule() {
  const studio = useStudioProfile();
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    if (!studio.loading) setWelcomeMessage(studio.profile.welcomeMessage);
  }, [studio.loading, studio.profile.welcomeMessage]);

  return (
    <StudioModuleEditor
      title="Welcome Experience"
      subtitle="Personal greeting"
      lead="A warm, human message investors read when they arrive — not compliance copy."
      busy={studio.busy}
      message={studio.message}
      error={studio.error}
      loading={studio.loading}
      onSave={() => studio.savePartial({ welcomeMessage })}
    >
      <StudioField id="welcomeMessage" label="Welcome message">
        <textarea
          id="welcomeMessage"
          className="pl-input min-h-[200px] w-full resize-y"
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
        />
      </StudioField>
    </StudioModuleEditor>
  );
}
