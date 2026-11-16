import { Link, useParams } from 'react-router-dom'
import GameCard from '../components/GameCard'
import Layout from '../components/Layout'
import { pageTitle, primaryButton, sizeNormal } from '../components/ui'
import { useGames } from '../context/GamesContext'
import { hasFinished } from '../utils/format'

// Surface 04 — Venue. Venues are reference data: nobody creates, edits or
// deletes them here. The page shows the place and the games played there.
export default function Venue() {
  const { id } = useParams()
  const { games, venues } = useGames()
  const venue = venues.find((item) => item.id === id)

  if (!venue) {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S04 · rev A">
        <h1 className={pageTitle}>Venue not found</h1>
        <p className="mt-4 max-w-prose text-sm text-muted">This venue is not in our list.</p>
        <Link to="/games" className={`${primaryButton} ${sizeNormal} mt-7`}>
          Back to games
        </Link>
      </Layout>
    )
  }

  const atVenue = games.filter((game) => game.venueId === venue.id)
  const upcoming = atVenue
    .filter((game) => game.status === 'open' && !hasFinished(game))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
  const usualCost = atVenue.length > 0 ? atVenue[0].costPerPlayer : null

  const tags = [
    ...(venue.floodlights ? ['Floodlit'] : []),
    venue.format,
    venue.surface,
    ...venue.amenities.filter((amenity) => amenity !== 'Floodlit'),
  ]

  return (
    <Layout footerCode="CSC443-F26 · T07 · S04 · rev A">
      <nav className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted" aria-label="Breadcrumb">
        <Link to="/games" className="hover:text-ink">Games</Link>
        <span className="text-brand-400"> / </span>
        Venue
      </nav>

      <div className="mt-4 overflow-hidden rounded-card border border-line bg-surface">
        <div className="flex h-48 items-center justify-center bg-[#0E1A14] text-xs uppercase tracking-widest text-muted">
          Venue photo · 16 : 5
        </div>
        <div className="p-6">
          <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-ink">
            {venue.name}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {venue.area} · open {venue.hours}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-brand-500/15 text-brand-300 ring-brand-500/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-6 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Per hour</dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">${venue.pricePerHour}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Pitches</dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">{venue.pitches}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Games here</dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">{atVenue.length}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Usual cost</dt>
              <dd className="font-display tabular-nums tracking-wide mt-1.5 text-3xl text-ink">
                {usualCost === null ? '—' : `$${usualCost}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
          Games at this venue
        </h2>
        {upcoming.length > 0 ? (
          <ul className="mt-6 grid gap-5 lg:grid-cols-2">
            {upcoming.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-card border border-dashed border-line bg-surface px-6 py-10 text-center text-sm text-muted">
            No games are scheduled here right now.
          </p>
        )}
      </section>
    </Layout>
  )
}
