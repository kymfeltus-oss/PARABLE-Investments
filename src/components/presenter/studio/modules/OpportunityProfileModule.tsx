"use client";

import { useEffect, useState } from "react";
import { StudioField, StudioModuleEditor } from "../StudioModuleEditor";
import { useStudioProfile } from "../useStudioProfile";

export function OpportunityProfileModule() {
  const studio = useStudioProfile();
  const [form, setForm] = useState({
    businessName: "",
    tagline: "",
    industry: "",
    fundingStage: "",
    raiseAmount: "",
    minimumInvestment: "",
  });

  useEffect(() => {
    if (!studio.loading) {
      setForm({
        businessName: studio.profile.businessName,
        tagline: studio.profile.tagline,
        industry: studio.profile.industry,
        fundingStage: studio.profile.fundingStage,
        raiseAmount: studio.profile.raiseAmount,
        minimumInvestment: studio.profile.minimumInvestment,
      });
    }
  }, [studio.loading, studio.profile]);

  return (
    <StudioModuleEditor
      title="Opportunity Profile"
      subtitle="Your raise story"
      lead="Business name, tagline, and snapshot fields feed the investor welcome and opportunity card automatically."
      busy={studio.busy}
      message={studio.message}
      error={studio.error}
      loading={studio.loading}
      onSave={() => studio.savePartial(form)}
    >
      <StudioField id="businessName" label="Business name">
        <input
          id="businessName"
          className="pl-input w-full"
          value={form.businessName}
          onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
        />
      </StudioField>
      <StudioField id="tagline" label="Tagline">
        <input
          id="tagline"
          className="pl-input w-full"
          value={form.tagline}
          onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
        />
      </StudioField>
      <StudioField id="industry" label="Industry">
        <input
          id="industry"
          className="pl-input w-full"
          value={form.industry}
          onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
        />
      </StudioField>
      <StudioField id="fundingStage" label="Funding stage">
        <input
          id="fundingStage"
          className="pl-input w-full"
          value={form.fundingStage}
          onChange={(e) => setForm((f) => ({ ...f, fundingStage: e.target.value }))}
        />
      </StudioField>
      <StudioField id="raiseAmount" label="Raise amount">
        <input
          id="raiseAmount"
          className="pl-input w-full"
          value={form.raiseAmount}
          onChange={(e) => setForm((f) => ({ ...f, raiseAmount: e.target.value }))}
        />
      </StudioField>
      <StudioField id="minimumInvestment" label="Minimum investment">
        <input
          id="minimumInvestment"
          className="pl-input w-full"
          value={form.minimumInvestment}
          onChange={(e) => setForm((f) => ({ ...f, minimumInvestment: e.target.value }))}
        />
      </StudioField>
    </StudioModuleEditor>
  );
}
