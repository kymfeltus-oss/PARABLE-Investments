/**
 * User-facing text for `meeting_nda_evidence` Postgrest / Postgres errors.
 * Uses message, `code`, `details`, and `hint` when present.
 */
export function mapMeetingNdaInsertError(
  err: { message: string; code?: string; details?: string; hint?: string } | null | undefined,
): { error: string; supabaseCode?: string } {
  if (!err?.message?.trim()) {
    return {
      error:
        'Could not save your scheduling record. Check Vercel function logs for [meeting/register] and confirm the Supabase URL + service role key for this project.',
    };
  }

  const supabaseCode = (err.code && String(err.code).trim()) || undefined;
  const m = [err.message, err.details, err.hint]
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .join(' | ')
    .toLowerCase();

  if (m.includes('row-level security') || (m.includes('new row') && m.includes('violates'))) {
    return {
      error:
        'Database write was blocked. Set SUPABASE_SERVICE_ROLE_KEY in Vercel to the service_role secret from this Supabase project (not the anon key), save, then redeploy.',
      supabaseCode,
    };
  }

  if (
    m.includes('invalid api key') ||
    (m.includes('invalid value for header') && m.includes('apikey')) ||
    m.includes('jwt could not be decoded') ||
    (m.includes('invalid jwt') && m.includes('credentials')) ||
    m.includes('jwt expired')
  ) {
    return {
      error:
        'Supabase rejected the server key. Use Project Settings → API: same project URL as NEXT_PUBLIC_SUPABASE_URL, and paste the service_role (secret) as SUPABASE_SERVICE_ROLE_KEY. Remove quotes, redeploy, then try again.',
      supabaseCode,
    };
  }

  if (m.includes('42p01') || (m.includes('relation') && m.includes('does not exist'))) {
    return {
      error:
        'Meeting table is missing. In the Supabase SQL editor, run the full file supabase/schema-meeting-nda-evidence.sql from the repo, then try again.',
      supabaseCode,
    };
  }

  if (supabaseCode === '42703' || (m.includes('column') && m.includes('does not exist') && m.includes('room_suffix'))) {
    return {
      error:
        'The meeting table is missing the room_suffix column. In Supabase SQL, run: ALTER TABLE public.meeting_nda_evidence ADD COLUMN IF NOT EXISTS room_suffix text; then re-run the rest of supabase/schema-meeting-nda-evidence.sql.',
      supabaseCode,
    };
  }

  if (m.includes('column') && m.includes('does not exist')) {
    return {
      error:
        'Database schema is out of date for this project. In Supabase, run the latest supabase/schema-meeting-nda-evidence.sql and schema-meeting-nda-evidence-room-suffix-migration.sql from the repo.',
      supabaseCode,
    };
  }

  if (m.includes('permission denied for table') || m.includes('permission denied for schema')) {
    return {
      error:
        'Database permission denied. Confirm you use the service_role key for this project (and not a restricted or anon key), then redeploy.',
      supabaseCode,
    };
  }

  return {
    error:
      'Could not save your scheduling record. In Vercel, confirm NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are from the same Supabase project, that the meeting_nda_evidence table exists (run supabase/schema-meeting-nda-evidence.sql), then redeploy. Check Vercel function logs for [meeting/register] for the full database message.',
    supabaseCode,
  };
}
