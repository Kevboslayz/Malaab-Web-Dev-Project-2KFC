import type { Game, Signup } from './mockData'

// The house rule lives here, in one place, so every surface agrees:
//  1. confirmed signups never exceed playersNeeded
//  2. once full, people wait in the order they arrived
//  3. a confirmed player leaving promotes number one automatically

const byArrival = (a: Signup, b: Signup) => a.signedUpAt.getTime() - b.signedUpAt.getTime()

export function confirmedFor(gameId: string, signups: Signup[]): Signup[] {
  return signups.filter((s) => s.gameId === gameId && s.status === 'confirmed').sort(byArrival)
}

export function queueFor(gameId: string, signups: Signup[]): Signup[] {
  return signups.filter((s) => s.gameId === gameId && s.status === 'waitlisted').sort(byArrival)
}

export function spotsLeft(game: Game, signups: Signup[]): number {
  return game.playersNeeded - confirmedFor(game.id, signups).length
}

// A player's active signup for a game, if they have one. Cancelled signups
// do not count — leaving and joining again puts you at the back of the line.
export function signupFor(gameId: string, playerId: string, signups: Signup[]): Signup | undefined {
  return signups.find(
    (s) => s.gameId === gameId && s.playerId === playerId && s.status !== 'cancelled',
  )
}

// 1-based place in the queue, or null if this player is not waiting.
export function queuePosition(gameId: string, playerId: string, signups: Signup[]): number | null {
  const index = queueFor(gameId, signups).findIndex((s) => s.playerId === playerId)
  return index === -1 ? null : index + 1
}

// Cancels one signup. If it was a confirmed place, the first waitlisted
// player takes it in the same update. Positions close up by themselves
// because they are computed from the list, not stored.
export function cancelSignup(
  signups: Signup[],
  signupId: string,
): { signups: Signup[]; promoted: Signup | null } {
  const target = signups.find((s) => s.id === signupId)
  if (!target || target.status === 'cancelled') return { signups, promoted: null }

  let next = signups.map((s) => (s.id === signupId ? { ...s, status: 'cancelled' as const } : s))

  let promoted: Signup | null = null
  if (target.status === 'confirmed') {
    const first = queueFor(target.gameId, next)[0]
    if (first) {
      promoted = { ...first, status: 'confirmed' }
      next = next.map((s) => (s.id === first.id ? promoted! : s))
    }
  }
  return { signups: next, promoted }
}
