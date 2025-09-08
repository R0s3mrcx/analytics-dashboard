// server/supabaseClient.ts
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase clients.
 * - supabase: public (anon) client — safe for auth flows and minimal access.
 * - supabaseAdmin: privileged client (service_role) — MUST be used only server-side.
 *
 * Read env vars from process.env. Use .env for local development (do not commit it).
 */
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase env vars. Please set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.')
}

/**
 * Public client (anon key) - ok for auth operations proxied or for limited tasks.
 * This key may be exposed to frontend in VITE_ env if you decide so.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Admin client (service role) - ⚠️ powerful. Never expose this key to frontend.
 * Use only on the backend (in Cloud Run / server).
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

