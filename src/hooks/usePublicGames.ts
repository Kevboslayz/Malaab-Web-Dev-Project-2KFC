import { useEffect, useState } from 'react'
import { hasApi, fetchGames, type ApiGame, type GameFilters } from '../api/public'

// Real loading / error / empty states: loading is actual latency, error is a
// failed request, empty is a real empty array. No ?state= simulation.
export function usePublicGames(filters: GameFilters) {
  const [games, setGames] = useState<ApiGame[]>([])
  const [loading, setLoading] = useState(hasApi)
  const [error, setError] = useState<string | null>(null)
  const key = JSON.stringify(filters)

  useEffect(() => {
    if (!hasApi) return
    let active = true
    setLoading(true)
    setError(null)
    fetchGames(JSON.parse(key) as GameFilters)
      .then((data) => {
        if (active) setGames(data)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [key])

  return { games, loading, error }
}
