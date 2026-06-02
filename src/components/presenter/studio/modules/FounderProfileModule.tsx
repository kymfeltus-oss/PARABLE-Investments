"use client";

import { useEffect, useState } from "react";
import { StudioField, StudioModuleEditor } from "../StudioModuleEditor";
import { useStudioProfile } from "../useStudioProfile";

export function FounderProfileModule() {
  const studio = useStudioProfile();
  const [form, setForm] = useState({
    founderName: "",
    founderTitle: "",
    founderPhotoUrl: "",
    founderBio: "",
  });

  useEffect(() => {
    if (!studio.loading) {
      setForm({
        founderName: studio.profile.founderName,
        founderTitle: studio.profile.founderTitle,
        founderPhotoUrl: studio.profile.founderPhotoUrl ?? "",
        founderBio: studio.profile.founderBio,
      });
    }
  }, [studio.loading, studio.profile]);

  return (
    <StudioModuleEditor
      title="Founder Profile"
      subtitle="Trust & presence"
      lead="How investors see you — photo, title, and a short bio before they enter the pitch room."
      busy={studio.busy}
      message={studio.message}
      error={studio.error}
      loading={studio.loading}
      onSave={() =>
        studio.savePartial({
          founderName: form.founderName,
          founderTitle: form.founderTitle,
          founderPhotoUrl: form.founderPhotoUrl || null,
          founderBio: form.founderBio,
        })
      }
    >
      <StudioField id="founderName" label="Founder name">
        <input
          id="founderName"
          className="pl-input w-full"
          value={form.founderName}
          onChange={(e) => setForm((f) => ({ ...f, founderName: e.target.value }))}
        />
      </StudioField>
      <StudioField id="founderTitle" label="Founder title">
        <input
          id="founderTitle"
          className="pl-input w-full"
          value={form.founderTitle}
          onChange={(e) => setForm((f) => ({ ...f, founderTitle: e.target.value }))}
        />
      </StudioField>
      <StudioField id="founderPhotoUrl" label="Founder photo" hint="HTTPS image URL">
        <input
          id="founderPhotoUrl"
          className="pl-input w-full"
          type="url"
          value={form.founderPhotoUrl}
          onChange={(e) => setForm((f) => ({ ...f, founderPhotoUrl: e.target.value }))}
        />
      </StudioField>
      <StudioField id="founderBio" label="Founder bio">
        <textarea
          id="founderBio"
          className="pl-input min-h-[140px] w-full resize-y"
          value={form.founderBio}
          onChange={(e) => setForm((f) => ({ ...f, founderBio: e.target.value }))}
        />
      </StudioField>
    </StudioModuleEditor>
  );
}
