import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { seedGames, seedSignups, venues } from '../data/mockData'
import type { Game, Signup, Venue } from '../data/mockData'
import { cancelSignup as applyCancel, signupFor, spotsLeft } from '../data/roster'

// Games and signups shared by every surface. Held in React state, so a
// drop-out on one page is seen on the game page and the dashboards too.

type GamesValue = {
  games: Game[]
  venues: Venue[]
  signups: Signup[]
  createGame: (game: Omit<Game, 'id' | 'organiserId' | 'status'>, organiserId: string) => Game
  updateGame: (game: Game) => void
  cancelGame: (gameId: string) => void
  // A join is confirmed while a spot remains, waitlisted once full. The
  // status is derived at join time from the current roster, never assumed.
  joinGame: (gameId: string, playerId: string) => Signup | null
  // Returns the signup that was promoted from the queue, if any.
  cancelSignup: (signupId: string) => Signup | null
}

const GamesContext = createContext<GamesValue | null>(null)

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>(seedGames)
  const [signups, setSignups] = useState<Signup[]>(seedSignups)

  function createGame(
    details: Omit<Game, 'id' | 'organiserId' | 'status'>,
    organiserId: string,
  ) {
    const game: Game = {
      ...details,
      id: `g${Date.now()}`,
      organiserId,
      status: 'open',
    }
    setGames((previous) => [...previous, game])
    setSignups((previous) => [
      ...previous,
      {
        id: `${game.id}-organiser`,
        gameId: game.id,
        playerId: organiserId,
        status: 'confirmed',
        signedUpAt: new Date(),
      },
    ])
    return game
  }

  function updateGame(game: Game) {
    setGames((previous) => previous.map((item) => (item.id === game.id ? game : item)))
  }

  function cancelGame(gameId: string) {
    setGames((previous) =>
      previous.map((game) => (game.id === gameId ? { ...game, status: 'cancelled' } : game)),
    )
  }

  function joinGame(gameId: string, playerId: string): Signup | null {
    const game = games.find((item) => item.id === gameId)
    if (!game || game.status !== 'open') return null

    const existing = signupFor(gameId, playerId, signups)
    if (existing) return existing

    const signup: Signup = {
      id: `${gameId}-${playerId}-${Date.now()}`,
      gameId,
      playerId,
      status: spotsLeft(game, signups) > 0 ? 'confirmed' : 'waitlisted',
      signedUpAt: new Date(),
    }
    setSignups((previous) => [...previous, signup])
    return signup
  }

  function cancelSignup(signupId: string) {
    const result = applyCancel(signups, signupId)
    setSignups(result.signups)
    return result.promoted
  }

  return (
    <GamesContext.Provider
      value={{ games, venues, signups, createGame, updateGame, cancelGame, joinGame, cancelSignup }}
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
