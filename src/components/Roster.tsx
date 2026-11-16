import { badgeMuted, badgeOneSpot, badgeOpen } from './ui'
import { initials } from '../context/AuthContext'
import { confirmedFor, queueFor } from '../data/roster'
import type { Game, Signup, User } from '../data/mockData'

// The signature component. It is given a game, the shared signups and the
// viewer. Spots and queue positions are computed here, never stored.
type RosterProps = {
  game: Game
  signups: Signup[]
  users: User[]
  viewerId?: string
  showQueue?: boolean
}

export default function Roster({ game, signups, users, viewerId, showQueue = true }: RosterProps) {
  const confirmed = confirmedFor(game.id, signups)
  const waiting = queueFor(game.id, signups)
  const spots = game.playersNeeded - confirmed.length
  const nameOf = (id: string) => users.find((user) => user.id === id)?.name ?? 'Unknown player'

  const spotsBadge =
    spots === 0 ? (
      <span className={badgeMuted}>Full</span>
    ) : spots === 1 ? (
      <span className={badgeOneSpot}>1 spot</span>
    ) : (
      <span className={badgeOpen}>{spots} spots</span>
    )

  return (
    <section className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-ink">The roster</h2>
        <span className="flex-1"></span>
        <span className="flex items-center gap-3">
          <span className="font-display tabular-nums tracking-wide text-2xl text-ink">
            {confirmed.length}<span className="text-muted">/{game.playersNeeded}</span>
          </span>
          {spotsBadge}
        </span>
      </div>

      <div className="px-5 py-6">
        <div className="flex flex-wrap gap-2.5">
          {confirmed.map((signup) => {
            const isYou = signup.playerId === viewerId
            return (
              <span
                key={signup.id}
                title={isYou ? 'you' : nameOf(signup.playerId)}
                aria-label={isYou ? `You — ${nameOf(signup.playerId)}` : nameOf(signup.playerId)}
                className={
                  isYou
                    ? 'flex h-14 w-14 flex-none items-center justify-center rounded-full text-xs font-bold bg-brand-400 text-[#06120C] ring-2 ring-accent-300'
                    : 'flex h-14 w-14 flex-none items-center justify-center rounded-full text-xs font-bold bg-brand-500/20 text-brand-200 ring-2 ring-brand-500/50'
                }
              >
                {initials(nameOf(signup.playerId))}
              </span>
            )
          })}
          {Array.from({ length: Math.max(0, spots) }, (_, index) => (
            <span
              key={`open-${index}`}
              title="open"
              aria-label="Open spot"
              className="flex h-14 w-14 flex-none items-center justify-center rounded-full text-xs font-bold border-2 border-dashed border-line text-muted"
            >
              +
            </span>
          ))}
        </div>
      </div>

      {showQueue && waiting.length > 0 && (
        <div className="border-t border-line px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Waiting, in order
          </p>
          <ol className="mt-3 space-y-2">
            {waiting.map((signup, index) => {
              const isYou = signup.playerId === viewerId
              return (
                <li
                  key={signup.id}
                  className={
                    isYou
                      ? 'flex items-center gap-3 rounded-lg border border-accent-300/50 bg-accent-300/10 px-3.5 py-2.5'
                      : 'flex items-center gap-3 rounded-lg border border-line bg-[#0E1A14] px-3.5 py-2.5'
                  }
                >
                  <span className="font-display tabular-nums tracking-wide inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-line text-[11px] text-ink">
                    {index + 1}
                  </span>
                  <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-surface text-[11px] font-bold text-muted">
                    {initials(nameOf(signup.playerId))}
                  </span>
                  <span className="min-w-0 truncate text-sm text-ink">{nameOf(signup.playerId)}</span>
                  {isYou && (
                    <span className="ml-auto text-xs font-semibold uppercase tracking-wide text-accent-300">
                      you
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
          <p className="mt-3 text-xs text-muted">
            Somebody drops out and number one is moved in automatically. Everybody else shifts up.
          </p>
        </div>
      )}
    </section>
  )
}
