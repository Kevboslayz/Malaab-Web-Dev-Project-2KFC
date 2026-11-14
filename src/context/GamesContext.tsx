import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { seedGames, seedSignups, venues } from '../data/mockData'
import type { Game, Signup, Venue } from '../data/mockData'
import { cancelSignup as applyCancel } from '../data/roster'

// Games and signups shared by every surface. Held in React state, so a
// drop-out on one page is seen on the game page and the dashboards too.

type GamesValue = {
  games: Game[]
  venues: Venue[]
  signups: Signup[]
  // Returns the signup that was promoted from the queue, if any.
  cancelSignup: (signupId: string) => Signup | null
}

const GamesContext = createContext<GamesValue | null>(null)

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games] = useState<Game[]>(seedGames)
  const [signups, setSignups] = useState<Signup[]>(seedSignups)

  function cancelSignup(signupId: string) {
    const result = applyCancel(signups, signupId)
    setSignups(result.signups)
    return result.promoted
  }

  return (
    <GamesContext.Provider value={{ games, venues, signups, cancelSignup }}>
      {children}
    </GamesContext.Provider>
  )
}

export function useGames() {
  const value = useContext(GamesContext)
  if (!value) throw new Error('useGames must be used inside <GamesProvider>')
  return value
}
