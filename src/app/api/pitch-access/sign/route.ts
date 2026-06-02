import { NextRequest, NextResponse } from "next/server";
import { CONSENT_CHECKBOX_TEXT, getEmailStatusMessage } from "@/lib/nda-template-defaults";
import {
  buildSignedRecordUrl,
  resolveNdaForInvestorSigning,
} from "@/lib/nda-templates";
import {
  computeDocumentHash,
  computeRecordHash,
} from "@/lib/pitch-access-agreement-hash";
import { validatePitchAccessAgreementFields } from "@/lib/pitch-access-validation";
import { sendPitchAccessAgreementEmails } from "@/lib/resend/send-pitch-access-agreement";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type SignBody = {
  pitchId?: string;
  presenterEmail?: string;
  templateId?: string;
  nda?: string;
  investorName?: string;
  investorEmail?: string;
  signature?: string;
  consentCheckboxText?: string;
};

function trimField(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
}

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function isSchemaColumnError(message: string): boolean {
  return /schema cache/i.test(message) || /could not find the .* column/i.test(message);
}

/**
 * Signed server record in pitch_access_agreements is the source of truth.
 * document_snapshot must never be changed after signing.
 * Signed PDFs must use the saved document_snapshot, not regenerated text.
 * localStorage flags are UX-only and are not legal records.
 */
export async function POST(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Agreement storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 }
    );
  }

  let body: SignBody;
  try {
    body = (await req.json()) as SignBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Expected JSON body" }, { status: 400 });
  }

  const investorName = trimField(body.investorName, 200);
  const investorEmail = trimField(body.investorEmail, 320).toLowerCase();
  const signature = trimField(body.signature, 200);
  const pitchIdRaw = trimField(body.pitchId, 64);
  const presenterEmailInput = trimField(body.presenterEmail, 320).toLowerCase();
  const templateIdRaw = trimField(body.templateId, 64);
  const ndaSlug = trimField(body.nda, 64);

  const fieldErrors = validatePitchAccessAgreementFields({
    investorName,
    investorEmail,
    signature,
    agreed: true,
  });

  if (Object.keys(fieldErrors).length > 0) {
    const first =
      fieldErrors.investorName ??
      fieldErrors.investorEmail ??
      fieldErrors.signature ??
      "Invalid input.";
    return NextResponse.json({ ok: false, error: first, fields: fieldErrors }, { status: 400 });
  }

  if (pitchIdRaw && !isUuid(pitchIdRaw)) {
    return NextResponse.json({ ok: false, error: "Invalid pitchId" }, { status: 400 });
  }
  if (templateIdRaw && !isUuid(templateIdRaw)) {
    return NextResponse.json({ ok: false, error: "Invalid templateId" }, { status: 400 });
  }

  const pitchId = pitchIdRaw || null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 512) || null;
  const ip = clientIp(req);

  const resolved = await resolveNdaForInvestorSigning(admin, {
    pitchId,
    templateId: templateIdRaw || null,
    slug: ndaSlug || null,
  });

  if ("error" in resolved) {
    return NextResponse.json({ ok: false, error: resolved.error }, { status: resolved.status });
  }

  const {
    ndaTemplateId,
    agreementVersion,
    documentSnapshot,
    signingUrl: resolvedSigningUrl,
    template,
    companyName,
    productName,
    governingState,
    presenterName,
    presenterEmail: templatePresenterEmail,
  } = resolved;

  // Server builds snapshot and hashes — client cannot submit hashes.
  const documentHash = computeDocumentHash(documentSnapshot);
  const signedAtUtc = new Date().toISOString();
  const consentText = CONSENT_CHECKBOX_TEXT;

  let presenterEmail: string | null =
    presenterEmailInput || templatePresenterEmail?.trim().toLowerCase() || null;
  let presenterNameStored = presenterName?.trim() || template?.presenter_name?.trim() || null;
  let presenterId: string | null = null;
  let pitchTitle: string | null = null;
  const companyStored = companyName ?? template?.company_name ?? null;
  const productStored = productName ?? template?.product_name ?? null;
  const stateStored = governingState ?? template?.governing_state ?? null;

  const signingUrlUsed = req.headers.get("referer")?.trim() || resolvedSigningUrl;

  if (pitchId) {
    const { data: pitch, error: pitchErr } = await admin
      .from("pitches")
      .select("id, presenter_id, presenter_email, title")
      .eq("id", pitchId)
      .maybeSingle();

    if (pitchErr) {
      console.error("[pitch-access/sign] pitch lookup:", pitchErr.message);
      return NextResponse.json({ ok: false, error: "Could not load pitch room" }, { status: 500 });
    }

    if (pitch) {
      presenterId = pitch.presenter_id ?? null;
      presenterEmail = presenterEmail || pitch.presenter_email?.trim().toLowerCase() || null;
      pitchTitle = pitch.title ?? null;
    }
  }

  const fullInsert = {
    pitch_id: pitchId,
    presenter_id: presenterId,
    presenter_email: presenterEmail,
    presenter_name: presenterNameStored,
    company_name: companyStored,
    product_name: productStored,
    governing_state: stateStored,
    nda_template_id: ndaTemplateId,
    investor_name: investorName,
    investor_email: investorEmail,
    signature,
    agreement_version: agreementVersion,
    document_snapshot: documentSnapshot,
    document_hash: documentHash,
    signing_url: signingUrlUsed,
    consent_checkbox_text: consentText,
    client_ip: ip,
    user_agent: userAgent,
    device_fingerprint: userAgent,
    signed_at_utc: signedAtUtc,
    email_status: "not_sent",
  };

  const legacyInsert = {
    pitch_id: pitchId,
    presenter_id: presenterId,
    investor_name: investorName,
    investor_email: investorEmail,
    signature,
    agreement_version: agreementVersion,
    document_snapshot: documentSnapshot,
    client_ip: ip,
    user_agent: userAgent,
    email_status: "not_sent",
  };

  let inserted: { id: string } | null = null;
  let usedLegacySchema = false;

  const first = await admin.from("pitch_access_agreements").insert(fullInsert).select("id").single();

  if (first.error && isSchemaColumnError(first.error.message)) {
    const second = await admin
      .from("pitch_access_agreements")
      .insert(legacyInsert)
      .select("id")
      .single();
    if (!second.error && second.data) {
      inserted = second.data as { id: string };
      usedLegacySchema = true;
      console.warn(
        "[pitch-access/sign] used legacy insert — run supabase/migrations/20260602000000_pitch_access_schema_repair.sql on your project",
      );
    } else {
      console.error("[pitch-access/sign] legacy insert:", second.error?.message);
    }
  } else if (!first.error && first.data) {
    inserted = first.data as { id: string };
  } else if (first.error) {
    console.error("[pitch-access/sign] insert:", first.error.message);
  }

  if (!inserted) {
    const insertMessage = first.error?.message ?? "unknown";

    // #region agent log
    fetch("http://127.0.0.1:7329/ingest/f8cf57c3-a1a6-410d-9396-9ae990b1d267", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4e3863" },
      body: JSON.stringify({
        sessionId: "4e3863",
        runId: "nda-sign-fix",
        hypothesisId: "H-schema",
        location: "pitch-access/sign/route.ts:insert",
        message: "agreement insert failed",
        data: {
          code: first.error?.code,
          hint: first.error?.hint,
          errPreview: insertMessage.slice(0, 200),
          usedLegacySchema,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const devDetail =
      process.env.NODE_ENV === "development" ? insertMessage.slice(0, 240) : undefined;

    return NextResponse.json(
      {
        ok: false,
        error: isSchemaColumnError(insertMessage)
          ? "Agreement database is missing required columns. Apply Supabase migrations (see supabase/migrations/20260602000000_pitch_access_schema_repair.sql) in the SQL Editor, then try again."
          : "Could not save your agreement. Try again or contact support.",
        ...(devDetail ? { debug: devDetail } : {}),
      },
      { status: 500 }
    );
  }

  // #region agent log
  fetch("http://127.0.0.1:7329/ingest/f8cf57c3-a1a6-410d-9396-9ae990b1d267", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4e3863" },
    body: JSON.stringify({
      sessionId: "4e3863",
      runId: "nda-sign-fix",
      hypothesisId: "H-schema",
      location: "pitch-access/sign/route.ts:insert",
      message: "agreement insert ok",
      data: { agreementId: inserted.id, usedLegacySchema },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const agreementId = inserted.id as string;
  const recordHash = computeRecordHash({
    agreementId,
    investorEmail,
    signedAtUtc,
    documentHash,
    signature,
  });
  const signedRecordUrl = buildSignedRecordUrl(agreementId);

  if (!usedLegacySchema) {
    const auditUpdate = await admin
      .from("pitch_access_agreements")
      .update({
        record_hash: recordHash,
        signed_record_url: signedRecordUrl,
      })
      .eq("id", agreementId);
    if (auditUpdate.error) {
      console.warn("[pitch-access/sign] audit columns update:", auditUpdate.error.message);
    }
  }

  if (pitchId) {
    await admin
      .from("pitch_investor_access")
      .update({
        agreement_id: agreementId,
        access_status: "signed",
        investor_name: investorName,
        last_accessed_at: signedAtUtc,
      })
      .eq("pitch_id", pitchId)
      .ilike("investor_email", investorEmail);
  } else {
    await admin
      .from("pitch_investor_access")
      .update({
        agreement_id: agreementId,
        access_status: "signed",
        investor_name: investorName,
        last_accessed_at: signedAtUtc,
      })
      .ilike("investor_email", investorEmail)
      .eq("access_status", "pending");
  }

  const emailResult = await sendPitchAccessAgreementEmails({
    documentSnapshot,
    investorName,
    investorEmail,
    signature,
    clientIp: ip,
    userAgent,
    presenterEmail,
    presenterName: presenterNameStored,
    signedAtUtc,
    agreementVersion,
    pitchTitle,
    companyName: companyStored,
    productName: productStored,
    governingState: stateStored,
    audit: {
      agreementId,
      documentHash,
      recordHash,
      agreementVersion,
      presenterName: presenterNameStored,
      presenterEmail,
      companyName: companyStored,
      productName: productStored,
      signedAtUtc,
    },
  });

  const emailStatus = emailResult.emailStatus;
  const emailMessage = getEmailStatusMessage(emailStatus);

  await admin
    .from("pitch_access_agreements")
    .update({ email_status: emailStatus })
    .eq("id", agreementId);

  return NextResponse.json({
    ok: true,
    agreementId,
    signedRecordUrl,
    documentHash,
    recordHash,
    emailStatus,
    emailMessage,
    emailError: emailResult.errorMessage,
    ndaTemplateId,
    agreementVersion,
    source: resolved.source,
  });
}
