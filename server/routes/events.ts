// server/routes/events.ts
import type { Request, Response } from 'express'
import { supabaseAdmin } from '../supabaseClient'
import { validateToken } from './auth'
import { normalizeEvent } from '../utils/normalizeEvent'
import { eventSchema } from '../schemas/eventSchema'

/**
 * GET /api/events (authenticated)
 * POST /api/events (insert)
 *
 * This handler:
 * - Validates Authorization: Bearer <token> via validateToken()
 * - For GET: queries `events`, normalizes to frontend shape, returns { items: [...] }
 * - For POST: inserts payload validated with Zod
 */
export async function handleEvents(req: Request, res: Response) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const user = await validateToken(token)
  if (!user) return res.status(401).json({ error: 'Invalid token' })

  if (req.method === 'GET') {
    const { startDate, endDate, eventName, platform } = req.query

    try {
      let query = supabaseAdmin
        .from('events')
        .select('id, event_name, user_id, user_name, user_email, platform, country, metadata, raw, ts')
        .order('ts', { ascending: false })
        .limit(400)

      if (eventName) query = query.eq('event_name', String(eventName))
      if (platform) query = query.eq('platform', String(platform))
      if (startDate) query = query.gte('ts', String(startDate))
      if (endDate) query = query.lte('ts', String(endDate))

      const { data, error } = await query
      if (error) throw error

      const items = (data || []).map((e: any) => normalizeEvent(e))
      return res.json({ items })
    } catch (err: any) {
      console.error('events GET error', err)
      return res.status(500).json({ error: err.message || 'internal_error' })
    }
  }

  if (req.method === 'POST') {
    try {
      // Validar body solo para POST
      const parsed = eventSchema.parse(req.body)
      const { error } = await supabaseAdmin.from('events').insert([parsed])
      if (error) throw error
      return res.status(201).json({ success: true })
    } catch (err: any) {
      console.error('events POST error', err)
      return res.status(500).json({ error: 'insert_failed', detail: String(err) })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

