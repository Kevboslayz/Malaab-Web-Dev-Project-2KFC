import { badgeCancelled, badgeMuted } from './ui'
import { initials, useAuth } from '../context/AuthContext'
import type { Game, Signup } from '../data/mockData'
import { confirmedFor, queueFor, spotsLeft } from '../data/roster'

// Signature component from components.html — The roster & ordered waitlist.
// Given a game and the signups list, computes confirmed slots, open slots,
// and the arrival-ordered waitlist without storing spotsLeft or queue positions.

const openBadge =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-brand-500/15 text-brand-300 ring-brand-500/40'
const oneSpotBadge =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-accent-400/15 text-accent-300 ring-accent-400/40'

type RosterProps = {
  game: Game
  signups: Signup[]
  onRemovePlayer?: (signup: Signup, playerName: string) => void
}

export default function Roster({ game, signups, onRemovePlayer }: RosterProps) {
  const { currentUser, users } = useAuth()

  const confirmed = confirmedFor(game.id, signups)
  const queue = queueFor(game.id, signups)
  const spots = Math.max(0, spotsLeft(game, signups))
  const isFull = spots === 0
  const isClosed = game.status === 'cancelled' || game.status === 'played'
  const isOrganiser = Boolean(currentUser && currentUser.id === game.organiserId)

  const nameOf = (userId: string) => users.find((u) => u.id === userId)?.name ?? 'Player'

  let rosterBadge: { className: string; label: string }
  if (game.status === 'cancelled') {
    rosterBadge = { className: badgeCancelled, label: 'Game cancelled' }
  } else if (game.status === 'played') {
    rosterBadge = { className: badgeMuted, label: 'Played' }
  } else if (isFull) {
    rosterBadge = { className: badgeMuted, label: 'Full' }
  } else if (spots === 1) {
    rosterBadge = { className: oneSpotBadge, label: '1 spot' }
  } else {
    rosterBadge = { className: openBadge, label: `${spots} spots` }
  }

  return (
    <section className="mt-6 overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-ink">The roster</h2>
        <span className="flex-1"></span>
        <span className="flex items-center gap-3">
          <span className="font-display tabular-nums tracking-wide text-2xl text-ink">
            {confirmed.length}
            <span className="text-muted">/{game.playersNeeded}</span>
          </span>
          <span className={rosterBadge.className}>{rosterBadge.label}</span>
        </span>
      </div>

      <div className="px-5 py-6">
        <div className="flex flex-wrap gap-2.5">
          {confirmed.map((signup) => {
            const playerName = nameOf(signup.playerId)
            const isMe = Boolean(currentUser && signup.playerId === currentUser.id)
            const canRemove = isOrganiser && !isMe && !isClosed && Boolean(onRemovePlayer)
            const slotClasses = isMe
              ? 'flex h-14 w-14 flex-none items-center justify-center rounded-full text-xs font-bold bg-brand-400 text-[#06120C] ring-2 ring-accent-300'
              : 'flex h-14 w-14 flex-none items-center justify-center rounded-full text-xs font-bold bg-brand-500/20 text-brand-200 ring-2 ring-brand-500/50'

            if (canRemove && onRemovePlayer) {
              return (
                <button
                  key={signup.id}
                  type="button"
                  onClick={() => onRemovePlayer(signup, playerName)}
                  className={`${slotClasses} transition hover:ring-red-400`}
                  title={`Remove ${playerName}`}
                  aria-label={`Remove ${playerName} from the roster`}
                >
                  {initials(playerName)}
                </button>
              )
            }

            return (
              <span
                key={signup.id}
                className={slotClasses}
                title={isMe ? 'you' : 'filled'}
                aria-label={isMe ? `${playerName} (you)` : playerName}
              >
                {initials(playerName)}
              </span>
            )
          })}

          {Array.from({ length: spots }).map((_, i) => (
            <span
              key={`open-${i}`}
              className="flex h-14 w-14 flex-none items-center justify-center rounded-full text-xs font-bold border-2 border-dashed border-line text-muted"
              title="open"
              aria-label="Open spot"
            >
              +
            </span>
          ))}
        </div>
      </div>

      {queue.length > 0 && (
        <div className="border-t border-line px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Waiting, in order
          </p>
          <ol className="mt-3 space-y-2">
            {queue.map((entry, idx) => {
              const playerName = nameOf(entry.playerId)
              const isMe = Boolean(currentUser && entry.playerId === currentUser.id)
              const canRemove = isOrganiser && !isMe && !isClosed && Boolean(onRemovePlayer)

              return (
                <li
                  key={entry.id}
                  className={
                    isMe
                      ? 'flex items-center gap-3 rounded-lg border border-accent-300/50 bg-accent-300/10 px-3.5 py-2.5'
                      : 'flex items-center gap-3 rounded-lg border border-line bg-[#0E1A14] px-3.5 py-2.5'
                  }
                >
                  <span className="font-display tabular-nums tracking-wide inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-line text-[11px] text-ink">
                    {idx + 1}
                  </span>
                  <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-surface text-[11px] font-bold text-muted">
                    {initials(playerName)}
                  </span>
                  <span className="min-w-0 truncate text-sm text-ink">{playerName}</span>
                  {isMe && (
                    <span className="ml-auto text-xs font-semibold uppercase tracking-wide text-accent-300">
                      you
                    </span>
                  )}
                  {canRemove && onRemovePlayer && (
                    <button
                      type="button"
                      onClick={() => onRemovePlayer(entry, playerName)}
                      className="ml-auto text-xs font-semibold text-muted hover:text-red-300"
                    >
                      Remove
                    </button>
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
