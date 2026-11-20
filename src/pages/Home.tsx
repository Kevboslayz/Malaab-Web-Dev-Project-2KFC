import { Link } from 'react-router-dom'
import ApiGameCard from '../components/ApiGameCard'
import { EmptyGames, ErrorGames, LoadingCards } from '../components/AsyncState'
import GameCard from '../components/GameCard'
import Layout from '../components/Layout'
import { hasApi, type ApiGame } from '../api/public'
import { usePublicGames } from '../hooks/usePublicGames'
import { useGames } from '../context/GamesContext'
import { confirmedFor } from '../data/roster'
import { hasFinished, isToday } from '../utils/format'
import type { Game } from '../data/mockData'

const rules = [
  { num: '01', title: 'Never oversold', body: 'Confirmed players can never exceed the number the organiser asked for.' },
  { num: '02', title: 'The queue is real', body: 'Full means you join a line, in arrival order, and you can see your place in it.' },
  { num: '03', title: 'Drop out, it moves', body: 'A cancellation promotes number one automatically. Nobody has to ask.' },
]

export default function Home() {
  // Both hooks always run. With no VITE_API_URL the API hook is inert and the
  // Phase 1 context path renders exactly as before.
  const api = usePublicGames({ when: 'next7' })
  const legacy = useGames()

  let featured: ApiGame[] = []
  let legacyFeatured: Game[] = []
  let headline = 'Tonight'
  let loading = false
  let error: string | null = null

  if (hasApi) {
    loading = api.loading
    error = api.error
    const upcoming = api.games.filter((game) => game.status === 'open' && !hasFinished({ ...game, startsAt: new Date(game.startsAt) }))
    const tonight = upcoming.filter((game) => isToday(new Date(game.startsAt)))
    headline = tonight.length > 0 ? 'Tonight' : 'Coming up'
    featured = (tonight.length > 0 ? tonight : upcoming).slice(0, 2)
  } else {
    const upcoming = legacy.games
      .filter((game) => game.status === 'open' && !hasFinished(game))
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    const tonight = upcoming.filter((game) => isToday(game.startsAt))
    headline = tonight.length > 0 ? 'Tonight' : 'Coming up'
    legacyFeatured = (tonight.length > 0 ? tonight : upcoming).slice(0, 2)
  }

  const confirmedCount = hasApi
    ? featured.reduce((total, game) => total + game.confirmed, 0)
    : legacyFeatured.reduce(
        (total, game) => total + confirmedFor(game.id, legacy.signups).length,
        0,
      )

  return (
    <Layout footerCode="CSC443-F26 · T07 · S01 · rev A">
      <section className="relative overflow-hidden rounded-card border border-line bg-[#0E1A14] px-6 py-16 sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-300/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" aria-hidden="true" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-300">
          Pitch booked · {confirmedCount} confirmed
        </p>
        <h1 className="relative mt-5 max-w-3xl font-display text-6xl uppercase leading-[0.86] tracking-[0.01em] text-ink sm:text-7xl">
          The game is<br /><span className="text-brand-300">two short.</span>
        </h1>
        <p className="relative mt-6 max-w-lg text-base text-muted">
          Somebody already paid for the pitch. Malaab is where the last two
          players come from — and where the queue sorts itself out when
          one of them bails at six o'clock.
        </p>
        <div className="relative mt-9 flex flex-wrap gap-3">
          <Link to="/games" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-400 px-5 py-2.5 text-sm font-semibold text-[#06120C] transition hover:bg-brand-300">Find a game</Link>
          <Link to="/create" className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-500">Start one</Link>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">{headline}</h2>
          <Link to="/games" className="text-sm font-semibold text-brand-300 underline decoration-accent-300 decoration-2 underline-offset-4">Every game</Link>
        </div>
        {hasApi ? (
          <div className="mt-6">
            {loading && <LoadingCards />}
            {!loading && error && <ErrorGames message={error} />}
            {!loading && !error && featured.length === 0 && (
              <EmptyGames title="Nothing on the pitch" body="No games are scheduled right now. Be the one who starts it." />
            )}
            {!loading && !error && featured.length > 0 && (
              <ul className="grid gap-5 lg:grid-cols-2">
                {featured.map((game) => <ApiGameCard key={game._id} game={game} />)}
              </ul>
            )}
          </div>
        ) : legacyFeatured.length > 0 ? (
          <ul className="mt-6 grid gap-5 lg:grid-cols-2">
            {legacyFeatured.map((game) => <GameCard key={game.id} game={game} />)}
          </ul>
        ) : (
          <p className="mt-6 rounded-card border border-dashed border-line bg-surface px-6 py-10 text-center text-sm text-muted">
            Nothing on the pitch right now. Be the one who starts it.
          </p>
        )}
      </section>

      <section className="mt-16 grid gap-5 sm:grid-cols-3">
        {rules.map((rule) => (
          <div key={rule.num} className="rounded-card border border-line bg-surface p-6">
            <p className="font-display text-4xl uppercase leading-none text-accent-300">{rule.num}</p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{rule.title}</h3>
            <p className="mt-2 text-sm text-muted">{rule.body}</p>
          </div>
        ))}
      </section>
    </Layout>
  )
}
