import { z } from "zod";

export const metadataSchema = z.object({
  ts: z.string().optional(),
  country: z.string().optional(),
  platform: z.string().optional(),
  product_name: z.string().optional(),
  product_qty: z.union([z.string(), z.number()]).optional(),
  service_name: z.string().optional(),
  store_name: z.string().optional(),
  store_type: z.string().optional(),
  walker_name: z.string().optional(),
}).passthrough();

export const eventSchema = z.object({
  event_name: z.string(),
  user_id: z.union([z.string(), z.number()]),
  user_name: z.string().optional(),
  user_email: z.string().email().optional(),
  platform: z.string().optional(),
  country: z.string().optional(),
  metadata: metadataSchema.optional(),
  ts: z.string().optional(),
}).strict();
