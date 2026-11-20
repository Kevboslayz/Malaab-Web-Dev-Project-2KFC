import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ApiGameCard from '../components/ApiGameCard'
import { EmptyGames, ErrorGames, LoadingCards } from '../components/AsyncState'
import FilterBar from '../components/FilterBar'
import GameCard from '../components/GameCard'
import Layout from '../components/Layout'
import { primaryButton, secondaryButton, sizeSmall } from '../components/ui'
import { hasApi } from '../api/public'
import { usePublicGames } from '../hooks/usePublicGames'
import { useGames } from '../context/GamesContext'
import { hasFinished, isToday } from '../utils/format'

type ViewState = 'populated' | 'loading' | 'empty' | 'error'
const emptyFilters = { query: '', sport: 'Any', when: 'Next 7 days', level: 'Any' }

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState(emptyFilters)
  const legacy = useGames()
  const forced = params.get('state')
  const legacyState: ViewState =
    forced === 'loading' || forced === 'empty' || forced === 'error' ? forced : 'populated'

  // The API hook is always called; it is inert until VITE_API_URL is set.
  const api = usePublicGames({
    q: filters.query,
    sport: filters.sport,
    when: filters.when,
    level: filters.level,
  })

  const set = (key: keyof typeof emptyFilters) => (value: string) =>
    setFilters((previous) => ({ ...previous, [key]: value }))

  // Phase 1 fallback list, kept while the other members migrate their routes.
  const legacyGames = legacy.games
    .filter((game) => game.status === 'open' && !hasFinished(game))
    .filter((game) => {
      const venue = legacy.venues.find((item) => item.id === game.venueId)
      const haystack = `${venue?.name ?? ''} ${venue?.area ?? ''}`.toLowerCase()
      if (filters.query && !haystack.includes(filters.query.trim().toLowerCase())) return false
      if (filters.sport !== 'Any' && game.sport !== filters.sport) return false
      if (filters.level !== 'Any' && game.level !== filters.level) return false
      if (filters.when === 'Tonight') return isToday(game.startsAt) && game.startsAt.getHours() >= 17
      if (filters.when === 'Weekend') return game.startsAt.getDay() === 0 || game.startsAt.getDay() === 6
      return game.startsAt.getTime() - Date.now() < 7 * 86_400_000
    })
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

  const filterBar = (
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
      count={hasApi ? api.games.length : legacyGames.length}
    />
  )

  return (
    <Layout footerCode="CSC443-F26 · T07 · S02 · rev A">
      <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-ink">Games</h1>
      <p className="mt-3 max-w-prose text-sm text-muted">
        Everything in the next week. A full game still takes you — you go
        in the queue and the app tells you where you stand.
      </p>

      <div className="mt-7 space-y-6">
        {hasApi ? (
          <>
            {filterBar}
            {api.loading && <LoadingCards count={3} />}
            {!api.loading && api.error && <ErrorGames message={api.error} />}
            {!api.loading && !api.error && api.games.length === 0 && (
              <EmptyGames
                title="Nothing matches those filters"
                body="Try another area or sport, or clear the filters to see every game."
              />
            )}
            {!api.loading && !api.error && api.games.length > 0 && (
              <ul className="grid gap-5 lg:grid-cols-2">
                {api.games.map((game) => <ApiGameCard key={game._id} game={game} />)}
              </ul>
            )}
          </>
        ) : (
          <>
            {legacyState === 'populated' && (
              <>
                {filterBar}
                <ul className="grid gap-5 lg:grid-cols-2">
                  {legacyGames.map((game) => <GameCard key={game.id} game={game} />)}
                </ul>
              </>
            )}
            {legacyState === 'loading' && <LoadingCards count={2} />}
            {legacyState === 'empty' && (
              <EmptyGames title="No padel in Jounieh this week" body="Two padel games are on in Zalka, twenty minutes away. Or book a court and let people come to you." />
            )}
            {legacyState === 'error' && (
              <div className="rounded-card border border-red-500/40 bg-red-500/10 px-6 py-16 text-center">
                <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-red-200">The games would not load</h3>
                <p className="mx-auto mt-4 max-w-sm text-sm text-red-200/70">The server did not answer. This usually passes in a moment.</p>
                <div className="mt-8">
                  <button type="button" onClick={() => setParams({}, { replace: true })} className={`${primaryButton} ${sizeSmall}`}>Try again</button>
                </div>
              </div>
            )}
            {legacyGames.length === 0 && legacyState === 'populated' && (
              <div className="rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
                <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">Nothing matches those filters</h3>
                <p className="mx-auto mt-4 max-w-sm text-sm text-muted">Try another area or sport, or clear the filters to see every game.</p>
                <div className="mt-8">
                  <button type="button" onClick={() => setFilters(emptyFilters)} className={`${secondaryButton} ${sizeSmall}`}>Clear filters</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
