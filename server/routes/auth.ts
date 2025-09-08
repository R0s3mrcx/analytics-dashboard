// server/routes/auth.ts
import type { Request, Response } from 'express'
import { supabase } from '../supabaseClient'
import { supabaseAdmin } from '../supabaseClient'

/**
 * POST /api/auth/login
 * - Proxy sign-in via Supabase Auth (email + password).
 * - Returns access token (access_token) to the client.
 *
 * Note: in production it's common to let the frontend call Supabase Auth directly
 * and use HttpOnly cookies for sessions. This proxy is useful for controlled flows.
 */
export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    // 401 for invalid credentials
    return res.status(401).json({ error: error.message })
  }
  // send back access token and basic user info
  return res.json({ token: data.session?.access_token, user: data.user })
}

/**
 * POST /api/auth/logout
 * - Acknowledge logout. If you implement refresh tokens you can revoke them here.
 */
export async function handleLogout(req: Request, res: Response) {
  return res.json({ message: 'Logged out' })
}

/**
 * validateToken(token)
 * - Validates a token server-side using the admin client.
 * - Returns user object on success, null on failure.
 */
export async function validateToken(token?: string | null) {
  if (!token) return null

  // pass token to Supabase admin to fetch user info
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error) {
    // optional: console.warn('validateToken error', error)
    return null
  }
  return data?.user ?? null
}
