// Kevin's public read client. It only calls read endpoints owned by this
// slice; authenticated calls belong to Keven's client in src/api/client.ts.
export type ApiVenue = {
  _id: string
  name: string
  area: string
  sport: string
}

export type ApiGame = {
  _id: string
  venueId: string
  venue: ApiVenue | null
  sport: string
  level: string
  startsAt: string
  durationMinutes: number
  playersNeeded: number
  costPerPlayer: number
  notes: string
  status: string
  confirmed: number
  waiting: number
  spotsLeft: number
}

export type GameFilters = { q?: string; sport?: string; level?: string; when?: string }

const base = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

// Until the API is configured (Phase 1 deployment), the pages keep using the
// shared mock context. Switching VITE_API_URL on in Vercel flips them to real
// data with no code change.
export const hasApi = Boolean(base)

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${base}/api${path}`, {
    headers: { Accept: 'application/json' },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(response.status, body?.message || `Request failed (${response.status})`)
  }
  return body as T
}

export function fetchGames(filters: GameFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'Any' && value !== 'Next 7 days') params.set(key, value)
  })
  const query = params.toString()
  return getJson<ApiGame[]>(`/games${query ? `?${query}` : ''}`)
}

export function fetchGame(id: string) {
  return getJson<ApiGame>(`/games/${encodeURIComponent(id)}`)
}

export function fetchVenues() {
  return getJson<ApiVenue[]>(`/venues`)
}

export function fetchVenue(id: string) {
  return getJson<ApiVenue>(`/venues/${encodeURIComponent(id)}`)
}
