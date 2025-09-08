// server/utils/normalizeEvent.ts
/**
 * Normalize a DB row from the `events` table into the frontend-friendly shape.
 * Accepts possible variations in metadata naming (product_name vs productName).
 */
export function normalizeEvent(row: any) {
  if (!row) return null
  const md = row.metadata || {}

  return {
    id: row.id,
    eventoName: row.event_name || md.evento_name || md.eventName || 'unknown',
    userId: row.user_id ?? null,
    userName: row.user_name ?? null,
    userEmail: row.user_email ?? null,
    platform: row.platform || md.platform || null,
    country: row.country || md.country || null,
    productName: md.product_name || md.productName || null,
    productQty: md.product_qty || md.productQty || null,
    serviceName: md.service_name || md.serviceName || null,
    storeName: md.store_name || md.storeName || null,
    typeStore: md.store_type || md.typeStore || null,
    walkerName: md.walker_name || md.walkerName || null,
    ts: row.ts ?? null,
    raw: row.raw ?? null
  }
}
