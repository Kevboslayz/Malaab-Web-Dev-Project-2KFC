import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import GameCard from '../components/GameCard'
import Layout from '../components/Layout'
import { pageTitle, primaryButton, secondaryButton, sizeSmall } from '../components/ui'
import { useGames } from '../context/GamesContext'
import type { Game, Venue as VenueType } from '../data/mockData'

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

const tagClass =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-brand-500/15 text-brand-300 ring-brand-500/40'

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

export default function Venue() {
  const { id } = useParams<{ id: string }>()
  const [params, setParams] = useSearchParams()
  const { venues, games } = useGames()

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

  const venue = forced === 'empty' ? undefined : venues.find((v) => v.id === id)

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
      <Layout footerCode="CSC443-F26 · T07 · S04 · rev A">
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
      <Layout footerCode="CSC443-F26 · T07 · S04 · rev A">
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
      <Layout footerCode="CSC443-F26 · T07 · S04 · rev A">
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
    <Layout footerCode="CSC443-F26 · T07 · S04 · rev A">
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
              <span key={item} className={tagClass}>
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
                {venueGames.length}
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
            {venueGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </ul>
        )}
      </section>
    </Layout>
  )
}
