import type { SupabaseClient } from "@supabase/supabase-js";
import { buildStandardNdaText, normalizeNdaTemplateInput } from "@/lib/nda-template-defaults";
import {
  buildAgreementDocumentSnapshot,
  PITCH_ACCESS_AGREEMENT_VERSION,
} from "@/lib/pitch-access-agreement";
import { buildNdaSigningUrl, buildPitchNdaSigningUrl, getSiteUrl } from "@/lib/qr-code";
import { randomBytes } from "crypto";

export type NdaTemplateRow = {
  id: string;
  presenter_id: string | null;
  presenter_email: string | null;
  company_name: string;
  product_name: string;
  presenter_name: string | null;
  governing_state: string;
  agreement_title: string;
  agreement_version: string;
  status: string;
  finalized_at: string | null;
  public_signing_slug: string | null;
  is_active: boolean;
  active_for_presenter: boolean;
  active_for_pitch_id: string | null;
  signing_url: string | null;
  created_at: string;
  updated_at: string;
};

export type NdaResolutionSource =
  | "slug"
  | "template_id"
  | "pitch_active"
  | "presenter_active"
  | "default";

export type ResolvedNdaForSigning = {
  ndaTemplateId: string | null;
  agreementVersion: string;
  documentSnapshot: string;
  signingUrl: string;
  source: NdaResolutionSource;
  template: NdaTemplateRow | null;
  companyName: string | null;
  productName: string | null;
  governingState: string | null;
  presenterName: string | null;
  presenterEmail: string | null;
  templateLabel: string | null;
};

export function generatePublicSigningSlug(): string {
  return randomBytes(8).toString("hex");
}

export function buildSignedRecordUrl(agreementId: string): string {
  return `${getSiteUrl()}/dashboard/presenter/nda/signed/${agreementId}`;
}

export function signingUrlForTemplate(row: NdaTemplateRow, siteUrl = getSiteUrl()): string {
  if (row.signing_url?.trim()) return row.signing_url.trim();
  return buildNdaSigningUrl({
    siteUrl,
    templateId: row.id,
    publicSigningSlug: row.public_signing_slug,
  });
}

export async function fetchNdaTemplateById(
  admin: SupabaseClient,
  templateId: string
): Promise<NdaTemplateRow | null> {
  const { data, error } = await admin
    .from("nda_templates")
    .select("*")
    .eq("id", templateId)
    .maybeSingle();
  if (error) throw error;
  return data as NdaTemplateRow | null;
}

export async function fetchDraftForPresenter(
  admin: SupabaseClient,
  presenterEmail: string
): Promise<NdaTemplateRow | null> {
  const { data, error } = await admin
    .from("nda_templates")
    .select("*")
    .ilike("presenter_email", presenterEmail)
    .eq("status", "draft")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as NdaTemplateRow | null;
}

export async function fetchActiveNdaForPresenter(
  admin: SupabaseClient,
  presenterEmail: string
): Promise<NdaTemplateRow | null> {
  const { data, error } = await admin
    .from("nda_templates")
    .select("*")
    .ilike("presenter_email", presenterEmail)
    .eq("status", "finalized")
    .eq("active_for_presenter", true)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as NdaTemplateRow | null;
}

export async function fetchFinalizedNdaTemplateBySlug(
  admin: SupabaseClient,
  slug: string
): Promise<NdaTemplateRow | null> {
  const { data, error } = await admin
    .from("nda_templates")
    .select("*")
    .eq("public_signing_slug", slug)
    .eq("status", "finalized")
    .maybeSingle();
  if (error) throw error;
  return data as NdaTemplateRow | null;
}

export async function fetchFinalizedNdaTemplateForSigning(
  admin: SupabaseClient,
  opts: { templateId?: string | null; slug?: string | null }
): Promise<NdaTemplateRow | null> {
  if (opts.slug?.trim()) {
    return fetchFinalizedNdaTemplateBySlug(admin, opts.slug.trim());
  }
  if (opts.templateId?.trim()) {
    const row = await fetchNdaTemplateById(admin, opts.templateId.trim());
    if (row?.status === "finalized") return row;
    return null;
  }
  return null;
}

function resolvedFromTemplate(
  template: NdaTemplateRow,
  source: NdaResolutionSource,
  signingUrl: string
): ResolvedNdaForSigning {
  return {
    ndaTemplateId: template.id,
    agreementVersion: template.agreement_version,
    documentSnapshot: documentSnapshotForTemplate(template),
    signingUrl,
    source,
    template,
    companyName: template.company_name,
    productName: template.product_name,
    governingState: template.governing_state,
    presenterName: template.presenter_name,
    presenterEmail: template.presenter_email,
    templateLabel: `${template.company_name} — ${template.product_name}`,
  };
}

export async function resolveNdaForInvestorSigning(
  admin: SupabaseClient,
  opts: {
    pitchId?: string | null;
    slug?: string | null;
    templateId?: string | null;
  }
): Promise<ResolvedNdaForSigning | { error: string; status: number }> {
  const siteUrl = getSiteUrl();

  if (opts.slug?.trim()) {
    const template = await fetchFinalizedNdaTemplateBySlug(admin, opts.slug.trim());
    if (!template) {
      return { error: "Finalized NDA template not found", status: 404 };
    }
    return resolvedFromTemplate(template, "slug", signingUrlForTemplate(template, siteUrl));
  }

  if (opts.templateId?.trim()) {
    const template = await fetchNdaTemplateById(admin, opts.templateId.trim());
    if (!template || template.status !== "finalized") {
      return { error: "Finalized NDA template not found", status: 404 };
    }
    return resolvedFromTemplate(template, "template_id", signingUrlForTemplate(template, siteUrl));
  }

  if (opts.pitchId?.trim()) {
    const pitchId = opts.pitchId.trim();
    const { data: pitch, error: pitchErr } = await admin
      .from("pitches")
      .select("id, presenter_email, active_nda_template_id")
      .eq("id", pitchId)
      .maybeSingle();

    if (pitchErr) throw pitchErr;

    if (pitch?.active_nda_template_id) {
      const template = await fetchNdaTemplateById(admin, pitch.active_nda_template_id);
      if (template?.status === "finalized") {
        return resolvedFromTemplate(
          template,
          "pitch_active",
          buildPitchNdaSigningUrl(siteUrl, pitchId)
        );
      }
    }

    const presenterEmail = pitch?.presenter_email?.trim().toLowerCase();
    if (presenterEmail) {
      const active = await fetchActiveNdaForPresenter(admin, presenterEmail);
      if (active) {
        return resolvedFromTemplate(
          active,
          "presenter_active",
          buildPitchNdaSigningUrl(siteUrl, pitchId)
        );
      }
    }
  }

  const signingUrl = opts.pitchId?.trim()
    ? buildPitchNdaSigningUrl(siteUrl, opts.pitchId.trim())
    : `${siteUrl}/nda`;

  return {
    ndaTemplateId: null,
    agreementVersion: PITCH_ACCESS_AGREEMENT_VERSION,
    documentSnapshot: buildAgreementDocumentSnapshot(),
    signingUrl,
    source: "default",
    template: null,
    companyName: null,
    productName: null,
    governingState: null,
    presenterName: null,
    presenterEmail: null,
    templateLabel: "Pitch Lock default",
  };
}

export async function activateNdaTemplate(
  admin: SupabaseClient,
  templateId: string,
  opts?: { pitchId?: string | null }
): Promise<NdaTemplateRow> {
  const template = await fetchNdaTemplateById(admin, templateId);
  if (!template) throw new Error("Template not found");
  if (template.status !== "finalized") throw new Error("Only finalized templates can be activated");

  const siteUrl = getSiteUrl();
  const slug = template.public_signing_slug ?? generatePublicSigningSlug();
  const signingUrl = buildNdaSigningUrl({
    siteUrl,
    templateId: template.id,
    publicSigningSlug: slug,
  });
  const now = new Date().toISOString();

  if (opts?.pitchId?.trim()) {
    const pitchId = opts.pitchId.trim();

    await admin
      .from("nda_templates")
      .update({ active_for_pitch_id: null, is_active: false })
      .eq("active_for_pitch_id", pitchId);

    await admin.from("pitches").update({ active_nda_template_id: templateId }).eq("id", pitchId);

    const { data, error } = await admin
      .from("nda_templates")
      .update({
        is_active: true,
        active_for_pitch_id: pitchId,
        active_for_presenter: false,
        public_signing_slug: slug,
        signing_url: signingUrl,
        updated_at: now,
      })
      .eq("id", templateId)
      .select("*")
      .single();

    if (error || !data) throw error ?? new Error("Could not activate template for pitch");
    return data as NdaTemplateRow;
  }

  const presenterEmail = template.presenter_email?.trim().toLowerCase();
  if (!presenterEmail) throw new Error("Presenter email required to activate");

  await admin
    .from("nda_templates")
    .update({ is_active: false, active_for_presenter: false })
    .ilike("presenter_email", presenterEmail)
    .neq("id", templateId);

  const { data, error } = await admin
    .from("nda_templates")
    .update({
      is_active: true,
      active_for_presenter: true,
      active_for_pitch_id: null,
      public_signing_slug: slug,
      signing_url: signingUrl,
      updated_at: now,
    })
    .eq("id", templateId)
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Could not activate template");
  return data as NdaTemplateRow;
}

export function documentSnapshotForTemplate(row: NdaTemplateRow): string {
  return buildStandardNdaText({
    companyName: row.company_name,
    productName: row.product_name,
    presenterName: row.presenter_name ?? undefined,
    presenterEmail: row.presenter_email ?? undefined,
    governingState: row.governing_state,
    agreementVersion: row.agreement_version,
  });
}

export function serializeNdaTemplate(row: NdaTemplateRow) {
  return {
    id: row.id,
    presenterEmail: row.presenter_email,
    companyName: row.company_name,
    productName: row.product_name,
    presenterName: row.presenter_name,
    governingState: row.governing_state,
    agreementTitle: row.agreement_title,
    agreementVersion: row.agreement_version,
    status: row.status,
    finalizedAt: row.finalized_at,
    publicSigningSlug: row.public_signing_slug,
    isActive: row.is_active,
    activeForPresenter: row.active_for_presenter,
    activeForPitchId: row.active_for_pitch_id,
    signingUrl: row.signing_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    previewText: documentSnapshotForTemplate(row),
  };
}

export { normalizeNdaTemplateInput };
