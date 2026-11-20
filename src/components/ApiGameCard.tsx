import { Link } from 'react-router-dom'
import {
  badgeMuted,
  badgeOneSpot,
  badgeOpen,
  secondaryButton,
  sizeSmall,
} from './ui'
import type { ApiGame } from '../api/public'
import { formatWhen } from '../utils/format'

// The card for API-backed games. Joining stays on the game detail surface
// (Francois owns that endpoint), so this card's only action is "View game".
export default function ApiGameCard({ game }: { game: ApiGame }) {
  const spots = game.spotsLeft
  const badge =
    game.status !== 'open'
      ? { className: badgeMuted, label: game.status === 'cancelled' ? 'Cancelled' : 'Played' }
      : spots === 0
        ? { className: badgeMuted, label: 'Full' }
        : spots === 1
          ? { className: badgeOneSpot, label: '1 spot' }
          : { className: badgeOpen, label: `${spots} spots` }

  return (
    <li className="group relative rounded-card border border-line bg-surface p-5 transition hover:border-brand-500/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">
            {game.sport} · {game.level}
          </p>
          <h3 className="mt-1.5 font-display text-2xl uppercase leading-none tracking-wide text-ink">
            <Link to={`/games/${game._id}`} className="after:absolute after:inset-0">
              {game.venue?.name ?? 'Game'}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-muted">
            {game.venue?.area ?? 'Unknown'} · {formatWhen(new Date(game.startsAt))} ·{' '}
            <span className="font-display tabular-nums tracking-wide text-ink">
              ${game.costPerPlayer}
            </span>{' '}
            a player
          </p>
        </div>
        <span className={badge.className}>{badge.label}</span>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <span className="font-display tabular-nums tracking-wide text-xl text-ink">
          {game.confirmed}<span className="text-muted">/{game.playersNeeded}</span>
        </span>
        <span className="relative z-10">
          <Link to={`/games/${game._id}`} className={`${secondaryButton} ${sizeSmall}`}>
            View game
          </Link>
        </span>
      </div>
    </li>
  )
}
