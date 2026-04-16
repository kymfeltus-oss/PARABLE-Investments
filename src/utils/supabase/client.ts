import { createBrowserClient } from '@supabase/ssr'
import { getBrowserSupabaseUrl } from '@/utils/supabase/browser-url'

export function createClient() {
  const url = getBrowserSupabaseUrl()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return createBrowserClient(url, anonKey)
}

const PLACEHOLDER_URL_SNIPPETS = ['your-project.supabase.co', 'example.supabase.co']
const PLACEHOLDER_KEY_SNIPPETS = ['your-anon-key', 'your_anon_key']

/** Use in auth flows to show a clear error when Supabase is not configured. */
export function getSupabaseConfigError(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return 'Server is not configured for sign-in. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.'
  }
  if (!url.startsWith('https://')) {
    return 'Invalid Supabase URL. It must start with https://'
  }
  const urlLower = url.toLowerCase()
  const keyLower = key.toLowerCase()
  if (PLACEHOLDER_URL_SNIPPETS.some((s) => urlLower.includes(s))) {
    return 'Supabase URL still looks like a placeholder. Copy NEXT_PUBLIC_SUPABASE_URL from .env.production into .env.local, then restart dev and delete the .next folder once.'
  }
  if (PLACEHOLDER_KEY_SNIPPETS.some((s) => keyLower.includes(s)) || key.length < 80) {
    return 'Supabase anon key is missing or still a placeholder. Copy NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.production into .env.local, then restart dev and delete the .next folder once.'
  }
  return null
}
