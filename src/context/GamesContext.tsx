import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { seedGames, seedSignups, venues } from '../data/mockData'
import type { Game, Signup, Venue } from '../data/mockData'
import { addSignup, cancelSignup as applyCancel } from '../data/roster'

// Games and signups shared by every surface. Held in React state, so a
// drop-out on one page is seen on the game page and the dashboards too.

type GamesValue = {
  games: Game[]
  venues: Venue[]
  signups: Signup[]
  // Signs a player up (confirmed or waitlisted per the house rule).
  joinGame: (gameId: string, playerId: string) => Signup | null
  // Returns the signup that was promoted from the queue, if any.
  cancelSignup: (signupId: string) => Signup | null
  // Cancels a game (organiser action).
  cancelGame: (gameId: string) => void
}

const GamesContext = createContext<GamesValue | null>(null)

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>(seedGames)
  const [signups, setSignups] = useState<Signup[]>(seedSignups)

  function joinGame(gameId: string, playerId: string) {
    const game = games.find((g) => g.id === gameId)
    if (!game) return null
    const result = addSignup(game, playerId, signups)
    setSignups(result.signups)
    return result.signup
  }

  function cancelSignup(signupId: string) {
    const result = applyCancel(signups, signupId)
    setSignups(result.signups)
    return result.promoted
  }

  function cancelGame(gameId: string) {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, status: 'cancelled' as const } : g)),
    )
  }

  return (
    <GamesContext.Provider
      value={{ games, venues, signups, joinGame, cancelSignup, cancelGame }}
    >
      {children}
    </GamesContext.Provider>
  )
}

export function useGames() {
  const value = useContext(GamesContext)
  if (!value) throw new Error('useGames must be used inside <GamesProvider>')
  return value
}
