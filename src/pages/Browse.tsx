import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import FilterBar from '../components/FilterBar'
import GameCard from '../components/GameCard'

type ViewState = 'populated' | 'loading' | 'empty' | 'error'

const games = [
  {
    id: 1,
    sport: 'Football',
    level: 'Casual',
    title: 'Dekwaneh Sports Club',
    location: 'Dekwaneh',
    time: 'Tonight 19:00',
    price: 8,
    confirmed: 8,
    needed: 10,
    status: 'open' as const,
  },
  {
    id: 2,
    sport: 'Basketball',
    level: 'Competitive',
    title: 'Hoops Achrafieh',
    location: 'Achrafieh',
    time: 'Tonight 20:30',
    price: 6,
    confirmed: 9,
    needed: 10,
    status: 'open' as const,
  },
  {
    id: 3,
    sport: 'Football',
    level: 'Casual',
    title: 'Jounieh Five-a-side',
    location: 'Jounieh',
    time: 'Tomorrow 18:00',
    price: 12,
    confirmed: 10,
    needed: 10,
    status: 'full' as const,
  },
  {
    id: 4,
    sport: 'Padel',
    level: 'Casual',
    title: 'Padel Point Zalka',
    location: 'Zalka',
    time: 'Tomorrow 21:00',
    price: 15,
    confirmed: 3,
    needed: 4,
    status: 'open' as const,
  },
  {
    id: 5,
    sport: 'Football',
    level: 'Competitive',
    title: 'Bourj Hammoud Pitch',
    location: 'Bourj Hammoud',
    time: 'Thursday 22:00',
    price: 7,
    confirmed: 9,
    needed: 10,
    status: 'open' as const,
  },
]

const baseButton =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 px-3.5 py-1.5 text-xs'

const brandButton =
  baseButton +
  ' bg-brand-400 text-[#06120C] hover:bg-brand-300 focus-visible:outline-brand-400'

const surfaceButton =
  baseButton +
  ' border border-line bg-surface text-ink hover:border-brand-500'

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

export default function Browse({
  state = 'populated',
}: {
  state?: ViewState
}) {
  return (
    <Layout footerCode="CSC443-F26 &middot; T07 &middot; S02 &middot; rev A">
      <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-ink">
        Games
      </h1>
      <p className="mt-3 max-w-prose text-sm text-muted">
        Everything in the next week. A full game still takes you &mdash; you go
        in the queue and the app tells you where you stand.
      </p>
      <div className="mt-7 space-y-6">
        {state === 'populated' && (
          <>
            <FilterBar />
            <ul className="grid gap-5 lg:grid-cols-2">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </ul>
            <nav className="flex items-center gap-2" aria-label="Pagination">
              <button
                className={`${baseButton} border border-line bg-surface text-ink hover:border-brand-500`}
              >
                Previous
              </button>
              <span
                aria-current="page"
                className={`${baseButton} bg-brand-400 text-[#06120C] hover:bg-brand-300 focus-visible:outline-brand-400`}
              >
                1
              </span>
              <button
                className={`${baseButton} border border-line bg-surface text-ink hover:border-brand-500`}
              >
                2
              </button>
              <button
                className={`${baseButton} border border-line bg-surface text-ink hover:border-brand-500`}
              >
                Next
              </button>
            </nav>
          </>
        )}

        {state === 'loading' && (
          <div className="mt-14 border-t border-dashed border-[#3A5546] pt-4">
            <ul className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <li key={i}>{skeletonCard()}</li>
              ))}
            </ul>
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
              <button className={surfaceButton}>Search anywhere</button>
              <Link to="/create" className={brandButton}>Start a game</Link>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="rounded-card border border-red-500/40 bg-red-500/10 px-6 py-16 text-center">
            <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink text-red-200">
              The games would not load
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-sm text-red-200/70">
              The server did not answer. This usually passes in a moment.
            </p>
            <div className="mt-8">
              <button className={brandButton}>Try again</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
