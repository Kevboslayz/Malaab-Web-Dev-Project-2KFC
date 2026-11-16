import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  badgeCancelled,
  badgeMuted,
  badgeQueue,
  badgeYouAreIn,
  pageTitle,
  primaryButton,
  secondaryButton,
  sizeSmall,
} from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import type { Game, Venue as VenueType } from '../data/mockData'
import { confirmedFor, queuePosition, spotsLeft } from '../data/roster'

// Surface 04 — Venue: reference data (never user-owned), and the games played there.

type ViewState = 'loading' | 'ready' | 'error'

type VenueMeta = {
  subtitle: string
  formatTag: string
  extraTags: string[]
  pitches: number
  historicalGames: number
  usualCost: number
}

const VENUE_DETAILS: Record<string, VenueMeta> = {
  v1: {
    subtitle: 'Dekwaneh, behind the municipality · open 08:00 to 00:00',
    formatTag: '7-a-side',
    extraTags: ['Changing rooms', 'Parking'],
    pitches: 3,
    historicalGames: 24,
    usualCost: 8,
  },
  v2: {
    subtitle: 'Achrafieh, Sassine Square · open 09:00 to 23:30',
    formatTag: '5v5 full court',
    extraTags: ['Lockers', 'Showers'],
    pitches: 2,
    historicalGames: 19,
    usualCost: 6,
  },
  v3: {
    subtitle: 'Jounieh coastal road · open 10:00 to 00:00',
    formatTag: '5-a-side',
    extraTags: ['Changing rooms', 'Parking'],
    pitches: 4,
    historicalGames: 31,
    usualCost: 12,
  },
  v4: {
    subtitle: 'Zalka highway exit · open 08:00 to 00:00',
    formatTag: 'Doubles court',
    extraTags: ['Racket rental', 'Parking'],
    pitches: 4,
    historicalGames: 28,
    usualCost: 15,
  },
  v5: {
    subtitle: 'Bourj Hammoud, near the stadium · open 14:00 to 01:00',
    formatTag: '5-a-side',
    extraTags: ['Parking', 'Kiosk'],
    pitches: 2,
    historicalGames: 15,
    usualCost: 7,
  },
}

const ORDINALS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
]
const ordinal = (n: number) => ORDINALS[n - 1] ?? `#${n}`

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatWhen(date: Date) {
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  const diff = Math.round((day.getTime() - today.getTime()) / 86_400_000)

  if (diff === 0) return `${date.getHours() >= 17 ? 'Tonight' : 'Today'} ${time}`
  if (diff === 1) return `Tomorrow ${time}`
  if (diff === -1) return `Yesterday ${time}`
  if (diff > 1 && diff < 7) return `${WEEKDAYS[date.getDay()]} ${time}`
  if (diff < -1 && diff > -8) return `Last ${WEEKDAYS[date.getDay()]} ${time}`
  return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${time}`
}

const openBadge =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-brand-500/15 text-brand-300 ring-brand-500/40'
const oneSpotBadge =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-accent-400/15 text-accent-300 ring-accent-400/40'

function getVenueMeta(venue: VenueType, venueGames: Game[]): VenueMeta {
  const preset = VENUE_DETAILS[venue.id]
  if (preset) return preset

  const usualCost =
    venueGames.length > 0
      ? Math.round(venueGames.reduce((sum, g) => sum + g.costPerPlayer, 0) / venueGames.length)
      : Math.round(venue.pricePerHour / 8)

  return {
    subtitle: `${venue.area} · open 08:00 to 00:00`,
    formatTag: venue.sport === 'Padel' ? 'Doubles' : '5-a-side',
    extraTags: ['Changing rooms', 'Parking'],
    pitches: 2,
    historicalGames: venueGames.length,
    usualCost,
  }
}

const VENUE_ID_MAP: Record<string, string> = {
  '1': 'v1',
  '2': 'v2',
  '3': 'v3',
  '4': 'v4',
  '5': 'v5',
}

export default function Venue() {
  const { id } = useParams<{ id: string }>()
  const [params, setParams] = useSearchParams()
  const { currentUser } = useAuth()
  const { venues, games, signups } = useGames()

  // Phase 1 simulates the request. ?state=loading|empty|error forces a state
  // so all four are reachable from a URL.
  const forced = params.get('state')
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setViewState('loading')
    const timer = setTimeout(() => setViewState('ready'), 450)
    return () => clearTimeout(timer)
  }, [id, attempt])

  const resolvedId = id ? (VENUE_ID_MAP[id] ?? id) : ''
  const venue = forced === 'empty' ? undefined : venues.find((v) => v.id === resolvedId)

  const state: 'loading' | 'error' | 'empty' | 'populated' =
    forced === 'loading' || forced === 'error' || forced === 'empty'
      ? forced
      : viewState === 'loading'
        ? 'loading'
        : viewState === 'error'
          ? 'error'
          : !venue
            ? 'empty'
            : 'populated'

  function retry() {
    if (forced) setParams({}, { replace: true })
    setAttempt((n) => n + 1)
  }

  if (state === 'loading') {
    return (
      <Layout footerCode="CSC443-F26 &middot; T07 &middot; S04 &middot; rev A">
        <div aria-busy="true" aria-label="Loading venue details" className="space-y-6">
          <span className="block h-3.5 w-28 animate-pulse rounded bg-line"></span>
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="h-48 animate-pulse bg-[#0E1A14]"></div>
            <div className="space-y-4 p-6">
              <span className="block h-12 w-72 animate-pulse rounded bg-line sm:w-96"></span>
              <span className="block h-4 w-64 animate-pulse rounded bg-line"></span>
              <div className="flex flex-wrap gap-2 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="h-6 w-24 animate-pulse rounded-full bg-line"></span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-5 border-t border-line pt-6 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <span className="block h-3 w-20 animate-pulse rounded bg-line"></span>
                    <span className="block h-8 w-16 animate-pulse rounded bg-line"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (state === 'error') {
    return (
      <Layout footerCode="CSC443-F26 &middot; T07 &middot; S04 &middot; rev A">
        <div className="rounded-card border border-red-500/40 bg-red-500/10 px-6 py-16 text-center">
          <h1 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-red-200">
            This venue would not load
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-red-200/70">
            The server did not answer. This usually passes in a moment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={retry} className={`${primaryButton} ${sizeSmall}`}>
              Try again
            </button>
            <Link to="/games" className={`${secondaryButton} ${sizeSmall}`}>
              Back to games
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (state === 'empty' || !venue) {
    return (
      <Layout footerCode="CSC443-F26 &middot; T07 &middot; S04 &middot; rev A">
        <div className="rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <h1 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
            Venue not found
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
            No venue matches this link. Browse open pickup games to see where people are playing this week.
          </p>
          <div className="mt-8">
            <Link to="/games" className={`${primaryButton} ${sizeSmall}`}>
              Browse all games
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const venueGames = games
    .filter((g) => g.venueId === venue.id && g.status !== 'cancelled')
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

  const meta = getVenueMeta(venue, venueGames)
  const amenities = [
    venue.floodlights ? 'Floodlit' : 'Daylight',
    meta.formatTag,
    venue.surface,
    ...meta.extraTags,
  ]

  return (
    <Layout footerCode="CSC443-F26 &middot; T07 &middot; S04 &middot; rev A">
      <nav
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted"
        aria-label="Breadcrumb"
      >
        <Link to="/games" className="hover:text-ink">
          Games
        </Link>{' '}
        <span className="text-brand-400">/</span> Venue
      </nav>

      <div className="mt-4 overflow-hidden rounded-card border border-line bg-surface">
        <div
          role="img"
          aria-label={`${venue.name} (${venue.surface} ${venue.sport.toLowerCase()} venue in ${venue.area})`}
          className="flex h-48 items-center justify-center bg-[#0E1A14] text-xs uppercase tracking-widest text-muted"
        >
          Venue photo &middot; 16 : 5
        </div>
        <div className="p-6">
          <h1 className={pageTitle}>{venue.name}</h1>
          <p className="mt-3 text-sm text-muted">{meta.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {amenities.map((item) => (
              <span key={item} className={openBadge}>
                {item}
              </span>
            ))}
          </div>
          <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-6 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Per hour
              </dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">
                ${venue.pricePerHour}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Pitches
              </dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">
                {meta.pitches}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Games here
              </dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">
                {meta.historicalGames}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Usual cost
              </dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">
                ${meta.usualCost}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
          Games at this venue
        </h2>

        {venueGames.length === 0 ? (
          <div className="mt-6 rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center">
            <p className="text-sm text-muted">
              No upcoming games are scheduled at {venue.name} right now.
            </p>
            <div className="mt-5">
              <Link to="/games" className={`${secondaryButton} ${sizeSmall}`}>
                Browse other venues
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 lg:grid-cols-2">
            {venueGames.map((game) => {
              const confirmed = confirmedFor(game.id, signups)
              const spots = Math.max(0, spotsLeft(game, signups))
              const isFull = spots === 0
              const mySignup = currentUser
                ? signups.find(
                    (s) =>
                      s.gameId === game.id &&
                      s.playerId === currentUser.id &&
                      s.status !== 'cancelled',
                  )
                : undefined
              const myPos =
                currentUser && mySignup?.status === 'waitlisted'
                  ? queuePosition(game.id, currentUser.id, signups)
                  : null

              let badgeClass = openBadge
              let badgeLabel = `${spots} spots`
              if (game.status === 'cancelled') {
                badgeClass = badgeCancelled
                badgeLabel = 'Game cancelled'
              } else if (game.status === 'played') {
                badgeClass = badgeMuted
                badgeLabel = 'Played'
              } else if (mySignup?.status === 'confirmed') {
                badgeClass = badgeYouAreIn
                badgeLabel = 'You are in'
              } else if (mySignup?.status === 'waitlisted') {
                badgeClass = badgeQueue
                badgeLabel = `Queue · ${ordinal(myPos ?? 1)}`
              } else if (isFull) {
                badgeClass = badgeMuted
                badgeLabel = 'Full'
              } else if (spots === 1) {
                badgeClass = oneSpotBadge
                badgeLabel = '1 spot'
              }

              let actionClass = `${primaryButton} ${sizeSmall}`
              let actionLabel = 'Join'
              if (game.status === 'played') {
                actionClass = `${secondaryButton} ${sizeSmall}`
                actionLabel = 'View'
              } else if (currentUser && game.organiserId === currentUser.id) {
                actionClass = `${secondaryButton} ${sizeSmall}`
                actionLabel = 'Manage'
              } else if (mySignup) {
                actionClass = `${secondaryButton} ${sizeSmall}`
                actionLabel = 'View'
              } else if (isFull) {
                actionClass = `${secondaryButton} ${sizeSmall}`
                actionLabel = 'Join the queue'
              }

              return (
                <li
                  key={game.id}
                  className="group relative rounded-card border border-line bg-surface p-5 transition hover:border-brand-500/60"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-brand-300">
                        {game.sport} &middot; {game.level}
                      </p>
                      <h3 className="mt-1.5 font-display text-2xl uppercase leading-none tracking-wide text-ink">
                        <Link to={`/games/${game.id}`} className="after:absolute after:inset-0">
                          {venue.name}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        {venue.area} &middot; {formatWhen(game.startsAt)} &middot;{' '}
                        <span className="font-display tabular-nums tracking-wide text-ink">
                          ${game.costPerPlayer}
                        </span>{' '}
                        a player
                      </p>
                    </div>
                    <span className={badgeClass}>{badgeLabel}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                    <span className="font-display tabular-nums tracking-wide text-xl text-ink">
                      {confirmed.length}
                      <span className="text-muted">/{game.playersNeeded}</span>
                    </span>
                    <span className={actionClass}>{actionLabel}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </Layout>
  )
}
