import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  badgeCancelled,
  badgeMuted,
  badgeOneSpot,
  badgeOpen,
  badgeOrganising,
  badgeQueue,
  badgeYouAreIn,
  primaryButton,
  secondaryButton,
  sizeSmall,
} from './ui'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { confirmedFor, queuePosition, signupFor, spotsLeft } from '../data/roster'
import type { Game } from '../data/mockData'
import { formatWhen, hasFinished, ordinal } from '../utils/format'

// One card, used on Home, Browse and Venue. It reads the shared roster so
// spots, queue positions and actions agree with every other surface.
export default function GameCard({ game }: { game: Game }) {
  const { currentUser } = useAuth()
  const { venues, signups, joinGame } = useGames()
  const navigate = useNavigate()
  const location = useLocation()

  const venue = venues.find((item) => item.id === game.venueId)
  const confirmed = confirmedFor(game.id, signups).length
  const spots = spotsLeft(game, signups)
  const mine = currentUser ? signupFor(game.id, currentUser.id, signups) : undefined
  const position = currentUser ? queuePosition(game.id, currentUser.id, signups) : null
  const isOrganiser = currentUser?.id === game.organiserId
  const isOpen = game.status === 'open' && !hasFinished(game)
  const detail = `/games/${game.id}`

  let badge: { className: string; label: string }
  if (game.status === 'cancelled') {
    badge = { className: badgeCancelled, label: 'Cancelled' }
  } else if (hasFinished(game)) {
    badge = { className: badgeMuted, label: 'Played' }
  } else if (isOrganiser) {
    badge = { className: badgeOrganising, label: 'You are organising' }
  } else if (mine?.status === 'confirmed') {
    badge = { className: badgeYouAreIn, label: 'You are in' }
  } else if (mine?.status === 'waitlisted') {
    badge = { className: badgeQueue, label: `Queue · ${ordinal(position ?? 0)}` }
  } else if (spots === 0) {
    badge = { className: badgeMuted, label: 'Full' }
  } else if (spots === 1) {
    badge = { className: badgeOneSpot, label: '1 spot' }
  } else {
    badge = { className: badgeOpen, label: `${spots} spots` }
  }

  let action: React.ReactNode
  if (!isOpen) {
    action = null
  } else if (isOrganiser || mine) {
    action = (
      <Link to={detail} className={`${secondaryButton} ${sizeSmall}`}>
        View game
      </Link>
    )
  } else if (!currentUser) {
    const next = `${location.pathname}${location.search}`
    action = (
      <Link
        to={`/signin?next=${encodeURIComponent(next)}`}
        className={`${secondaryButton} ${sizeSmall}`}
      >
        Sign in
      </Link>
    )
  } else if (spots > 0) {
    action = (
      <button
        type="button"
        className={`${primaryButton} ${sizeSmall}`}
        onClick={() => {
          const joined = joinGame(game.id, currentUser.id)
          if (joined && joined.status === 'waitlisted') navigate(detail)
        }}
      >
        Join
      </button>
    )
  } else {
    action = (
      <button
        type="button"
        className={`${secondaryButton} ${sizeSmall}`}
        onClick={() => {
          joinGame(game.id, currentUser.id)
          navigate(detail)
        }}
      >
        Join the queue
      </button>
    )
  }

  return (
    <li className="group relative rounded-card border border-line bg-surface p-5 transition hover:border-brand-500/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">
            {game.sport} &middot; {game.level}
          </p>
          <h3 className="mt-1.5 font-display text-2xl uppercase leading-none tracking-wide text-ink">
            <Link to={detail} className="after:absolute after:inset-0">
              {venue?.name ?? 'Game'}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-muted">
            {venue?.area ?? 'Unknown'} &middot; {formatWhen(game.startsAt)} &middot;{' '}
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
          {confirmed}<span className="text-muted">/{game.playersNeeded}</span>
        </span>
        {action && <span className="relative z-10">{action}</span>}
      </div>
    </li>
  )
}
