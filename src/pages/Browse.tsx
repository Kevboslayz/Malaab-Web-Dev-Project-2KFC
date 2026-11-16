import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import FilterBar from '../components/FilterBar'
import GameCard from '../components/GameCard'
import { primaryButton, secondaryButton, sizeSmall } from '../components/ui'
import { useGames } from '../context/GamesContext'
import { hasFinished, isToday } from '../utils/format'

type ViewState = 'populated' | 'loading' | 'empty' | 'error'

const emptyFilters = { query: '', sport: 'Any', when: 'Next 7 days', level: 'Any' }

function skeletonCard() {
  return (
    <li className="rounded-card border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full space-y-2.5">
          <span className="block h-3 w-24 animate-pulse rounded bg-line"></span>
          <span className="block h-7 w-3/5 animate-pulse rounded bg-line"></span>
          <span className="block h-3.5 w-2/5 animate-pulse rounded bg-line"></span>
        </div>
        <span className="h-7 w-20 flex-none animate-pulse rounded-full bg-line"></span>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="h-6 w-14 animate-pulse rounded bg-line"></span>
        <span className="h-8 w-24 animate-pulse rounded-full bg-line"></span>
      </div>
    </li>
  )
}

export default function Browse() {
  const { games, venues } = useGames()
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState(emptyFilters)
  const forced = params.get('state')
  const state: ViewState =
    forced === 'loading' || forced === 'empty' || forced === 'error' ? forced : 'populated'

  const results = games
    .filter((game) => game.status === 'open' && !hasFinished(game))
    .filter((game) => {
      const venue = venues.find((item) => item.id === game.venueId)
      const haystack = `${venue?.name ?? ''} ${venue?.area ?? ''}`.toLowerCase()
      if (filters.query && !haystack.includes(filters.query.trim().toLowerCase())) return false
      if (filters.sport !== 'Any' && game.sport !== filters.sport) return false
      if (filters.level !== 'Any' && game.level !== filters.level) return false
      if (filters.when === 'Tonight') {
        return isToday(game.startsAt) && game.startsAt.getHours() >= 17
      }
      if (filters.when === 'Weekend') {
        const day = game.startsAt.getDay()
        return day === 0 || day === 6
      }
      return game.startsAt.getTime() - Date.now() < 7 * 86_400_000
    })
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

  const set = (key: keyof typeof emptyFilters) => (value: string) =>
    setFilters((previous) => ({ ...previous, [key]: value }))

  function retry() {
    if (forced) setParams({}, { replace: true })
  }

  return (
    <Layout footerCode="CSC443-F26 · T07 · S02 · rev A">
      <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-ink">
        Games
      </h1>
      <p className="mt-3 max-w-prose text-sm text-muted">
        Everything in the next week. A full game still takes you — you go
        in the queue and the app tells you where you stand.
      </p>
      <div className="mt-7 space-y-6">
        {state === 'loading' && (
          <ul className="grid gap-5 lg:grid-cols-2" aria-busy="true" aria-label="Loading games">
            {[0, 1].map((index) => (
              <li key={index}>{skeletonCard()}</li>
            ))}
          </ul>
        )}

        {state === 'error' && (
          <div className="rounded-card border border-red-500/40 bg-red-500/10 px-6 py-16 text-center">
            <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-red-200">
              The games would not load
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-sm text-red-200/70">
              The server did not answer. This usually passes in a moment.
            </p>
            <div className="mt-8">
              <button type="button" onClick={retry} className={`${primaryButton} ${sizeSmall}`}>
                Try again
              </button>
            </div>
          </div>
        )}

        {state === 'empty' && (
          <div className="rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
            <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
              No padel in Jounieh this week
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
              Two padel games are on in Zalka, twenty minutes away. Or book a
              court and let people come to you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setParams({}, { replace: true })}
                className={`${secondaryButton} ${sizeSmall}`}
              >
                Search anywhere
              </button>
              <Link to="/create" className={primaryButton + ' ' + sizeSmall}>Start a game</Link>
            </div>
          </div>
        )}

        {state === 'populated' && (
          <>
            <FilterBar
              query={filters.query}
              sport={filters.sport}
              when={filters.when}
              level={filters.level}
              onQuery={set('query')}
              onSport={set('sport')}
              onWhen={set('when')}
              onLevel={set('level')}
              onClear={() => setFilters(emptyFilters)}
              count={results.length}
            />
            {results.length > 0 ? (
              <ul className="grid gap-5 lg:grid-cols-2">
                {results.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </ul>
            ) : (
              <div className="rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
                <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
                  Nothing matches those filters
                </h3>
                <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
                  Try another area or sport, or clear the filters to see every game.
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setFilters(emptyFilters)}
                    className={`${secondaryButton} ${sizeSmall}`}
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
