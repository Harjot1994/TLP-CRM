import { createClient } from '@supabase/supabase-js'

export function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  // Fallback to anon so forms still work while you finalize envs
  const key =
    (process.env.SUPABASE_SERVICE_ROLE_KEY as string) ||
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

  if (!url || !key) throw new Error('Missing Supabase env vars on server')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}
