-- After CREATE/ALTER on tables exposed to the API, PostgREST may return PGRST204 until its schema cache refreshes.
-- Run in the Supabase SQL editor (safe to re-run; only notifies the API layer to reload):
NOTIFY pgrst, 'reload schema';
