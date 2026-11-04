import Layout from '../components/Layout'
import GameCard from '../components/GameCard'

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
]

const rules = [
  {
    num: '01',
    title: 'Never oversold',
    body: 'Confirmed players can never exceed the number the organiser asked for.',
  },
  {
    num: '02',
    title: 'The queue is real',
    body: 'Full means you join a line, in arrival order, and you can see your place in it.',
  },
  {
    num: '03',
    title: 'Drop out, it moves',
    body: 'A cancellation promotes number one automatically. Nobody has to ask.',
  },
]

export default function Home() {
  return (
    <Layout footerCode="CSC443-F26 &middot; T07 &middot; S01 &middot; rev A">
      <section
        className="relative overflow-hidden rounded-card border border-line bg-[#0E1A14] px-6 py-16 sm:px-12 sm:py-24"
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-300/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl"
          aria-hidden="true"
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-accent-300">
          Pitch booked &middot; eight confirmed
        </p>
        <h1 className="relative mt-5 max-w-3xl font-display text-6xl uppercase leading-[0.86] tracking-[0.01em] text-ink sm:text-7xl">
          The game is<br />
          <span className="text-brand-300">two short.</span>
        </h1>
        <p className="relative mt-6 max-w-lg text-base text-muted">
          Somebody already paid for the pitch. Malaab is where the last two
          players come from &mdash; and where the queue sorts itself out when
          one of them bails at six o'clock.
        </p>
        <div className="relative mt-9 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-brand-400 text-[#06120C] hover:bg-brand-300 focus-visible:outline-brand-400"
          >
            Find a game
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border border-line bg-surface text-ink hover:border-brand-500"
          >
            Start one
          </button>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
            Tonight
          </h2>
          <a
            href="/games"
            className="text-sm font-semibold text-brand-300 underline decoration-accent-300 decoration-2 underline-offset-4"
          >
            Every game
          </a>
        </div>
        <ul className="mt-6 grid gap-5 lg:grid-cols-2">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-5 sm:grid-cols-3">
        {rules.map((rule) => (
          <div key={rule.num} className="rounded-card border border-line bg-surface p-6">
            <p className="font-display text-4xl uppercase leading-none text-accent-300">
              {rule.num}
            </p>
            <h3 className="text-lg font-semibold tracking-tight text-ink mt-3">
              {rule.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{rule.body}</p>
          </div>
        ))}
      </section>
    </Layout>
  )
}
