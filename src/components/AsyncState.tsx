import { Link } from 'react-router-dom'
import { primaryButton, secondaryButton, sizeNormal } from './ui'

// Shared presentation for the three non-populated states, used by Home and
// Browse and reusable by the other members as they migrate their surfaces.
export function LoadingCards({ count = 2 }: { count?: number }) {
  return (
    <ul className="grid gap-5 lg:grid-cols-2" aria-busy="true" aria-label="Loading games">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="rounded-card border border-line bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="w-full space-y-2.5">
              <span className="block h-3 w-24 animate-pulse rounded bg-line" />
              <span className="block h-7 w-3/5 animate-pulse rounded bg-line" />
              <span className="block h-3.5 w-2/5 animate-pulse rounded bg-line" />
            </div>
            <span className="h-7 w-20 flex-none animate-pulse rounded-full bg-line" />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="h-6 w-14 animate-pulse rounded bg-line" />
            <span className="h-8 w-24 animate-pulse rounded-full bg-line" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function EmptyGames({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
      <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-sm text-sm text-muted">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/games" className={`${secondaryButton} ${sizeNormal}`}>
          Find a game
        </Link>
        <Link to="/create" className={`${primaryButton} ${sizeNormal}`}>
          Start a game
        </Link>
      </div>
    </div>
  )
}

export function ErrorGames({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-red-500/40 bg-red-500/10 px-6 py-14 text-center">
      <h3 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-red-200">
        The games would not load
      </h3>
      <p className="mx-auto mt-4 max-w-sm text-sm text-red-200/80">{message}</p>
      <p className="mt-6 text-xs text-muted">Try again in a moment.</p>
    </div>
  )
}
