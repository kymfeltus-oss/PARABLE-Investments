import { createBrowserClient } from '@supabase/ssr'
import { getBrowserSupabaseUrl } from '@/utils/supabase/browser-url'

export function createClient() {
  const url = getBrowserSupabaseUrl()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return createBrowserClient(url, anonKey)
}

const PLACEHOLDER_URL_SNIPPETS = ['your-project.supabase.co', 'example.supabase.co']
const PLACEHOLDER_KEY_SNIPPETS = ['your-anon-key', 'your_anon_key']

function getSupabaseUrlShapeError(urlRaw: string): string | null {
  const url = urlRaw.trim()
  try {
    const u = new URL(url)
    if (typeof window !== 'undefined' && u.origin === window.location.origin) {
      return (
        'NEXT_PUBLIC_SUPABASE_URL must be your Supabase API URL (https://xxxx.supabase.co from Settings → API), ' +
        'not this app\'s URL — otherwise auth requests receive HTML and fail with "not valid JSON".'
      )
    }
    const host = u.hostname.toLowerCase()
    if (host === 'supabase.com' || host.endsWith('.supabase.com')) {
      return (
        'Use the Project URL from Supabase Settings → API (looks like https://abcdxyzcompany.supabase.co), ' +
        'not a supabase.com dashboard link.'
      )
    }
  } catch {
    return 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL.'
  }
  return null
}

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
  const shapeErr = getSupabaseUrlShapeError(url)
  if (shapeErr) return shapeErr
  return null
}
