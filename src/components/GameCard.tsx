type Game = {
  id: number
  sport: string
  level: string
  title: string
  location: string
  time: string
  price: number
  confirmed: number
  needed: number
  status: 'open' | 'full'
}

const baseButton =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 px-3.5 py-1.5 text-xs'

const joinButton =
  baseButton +
  ' bg-brand-400 text-[#06120C] hover:bg-brand-300 focus-visible:outline-brand-400'

const queueButton =
  baseButton +
  ' border border-line bg-surface text-ink hover:border-brand-500'

const openBadge =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-brand-500/15 text-brand-300 ring-brand-500/40'

const oneSpotBadge =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-accent-400/15 text-accent-300 ring-accent-400/40'

const fullBadge =
  'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset bg-ink/10 text-muted ring-line'

export default function GameCard({ game }: { game: Game }) {
  const spots = game.needed - game.confirmed
  const open = game.status === 'open' && spots > 0

  let badge: string
  let label: string
  if (!open) {
    badge = fullBadge
    label = 'Full'
  } else if (spots === 1) {
    badge = oneSpotBadge
    label = '1 spot'
  } else {
    badge = openBadge
    label = `${spots} spots`
  }

  const action = open ? (
    <button className={joinButton}>Join</button>
  ) : (
    <button className={queueButton}>Join the queue</button>
  )

  return (
    <li className="group relative rounded-card border border-line bg-surface p-5 transition hover:border-brand-500/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-brand-300">
            {game.sport} &middot; {game.level}
          </p>
          <h3 className="mt-1.5 font-display text-2xl uppercase leading-none tracking-wide text-ink">
            <a href="#" className="after:absolute after:inset-0">
              {game.title}
            </a>
          </h3>
          <p className="mt-2 text-sm text-muted">
            {game.location} &middot; {game.time} &middot;{' '}
            <span className="font-display tabular-nums tracking-wide text-ink">
              ${game.price}
            </span>{' '}
            a player
          </p>
        </div>
        <span className={badge}>{label}</span>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <span className="font-display tabular-nums tracking-wide text-xl text-ink">
          {game.confirmed}<span className="text-muted">/{game.needed}</span>
        </span>
        {action}
      </div>
    </li>
  )
}
