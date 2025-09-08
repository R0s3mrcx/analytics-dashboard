import { z } from "zod";

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

const loginResponseSchema = z.object({
  token: z.string().optional(),
  user: z
    .object({
      id: z.string().or(z.number()).transform(String).optional(),
      email: z.string().email().optional(),
    })
    .optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type EventItem = {
  id?: string;
  createdAt?: string;
  userId: string | number;
  userName: string;
  userEmail: string;
  eventoName: string;
  country?: string | null;
  platform?: string | null;
  productName?: string | null;
  productQty?: number | null;
  serviceName?: string | null;
  storeName?: string | null;
  typeStore?: string | null;
  walkerName?: string | null;
};

export type EventsResponse = {
  items: EventItem[];
  total?: number;
};

export type EventsFilters = {
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  eventName?: string;
  platform?: string;
  limit?: number;
  page?: number;
};

function authHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function toQuery(params: Record<string, string | number | undefined | null>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) usp.set(k, String(v));
  });
  return usp.toString();
}
/**
 * Authenticate user with Supabase via backend proxy.
 * Stores token in localStorage on success.
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = loginResponseSchema.parse(await res.json());
  if (data.token) localStorage.setItem("accessToken", data.token);
  localStorage.setItem("isAuthenticated", "true");
  return data;
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
  } catch {}
  localStorage.removeItem("accessToken");
  localStorage.removeItem("isAuthenticated");
}
/**
 * Fetch events from backend, applying optional filters.
 * Returns normalized items array.
 */
export async function fetchEvents(filters: EventsFilters = {}): Promise<EventsResponse> {
  const query = toQuery({
    startDate: filters.startDate,
    endDate: filters.endDate,
    eventName: filters.eventoName,
    platform: filters.platform,
    limit: filters.limit ?? 50,
    page: filters.page ?? 1,
  });
  const res = await fetch(`${API_BASE_URL}/events${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: authHeaders(),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);
  const data = (await res.json()) as EventsResponse | EventItem[];
  if (Array.isArray(data)) return { items: data };
  return data;
}
/**
 * Compute simple metrics for dashboard visualizations.
 * - total: count of events
 * - uniqueUsers: distinct users
 * - topEvents: most frequent event types
 * - byType, byPlatform: frequency breakdowns
 */
export function computeMetrics(items: EventItem[]) {
  const total = items.length;
  const uniqueUsers = new Set(items.map((e) => String(e.userId))).size;
  const topEvents = Object.entries(
    items.reduce<Record<string, number>>((acc, e) => {
      const key = e.eventoName ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const byType = Object.entries(
    items.reduce<Record<string, number>>((acc, e) => {
      const key = e.eventoName ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  );
  const byPlatform = Object.entries(
    items.reduce<Record<string, number>>((acc, e) => {
      const key = e.platform ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  );
  return { total, uniqueUsers, topEvents, byType, byPlatform };
}
