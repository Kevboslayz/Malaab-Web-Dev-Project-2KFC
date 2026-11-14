import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  badgeCancelled,
  badgeMuted,
  badgeQueue,
  badgeYouAreIn,
  ghostButton,
  pageTitle,
  primaryButton,
  secondaryButton,
  sizeSmall,
} from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { queuePosition } from '../data/roster'
import type { Game, Signup, Venue } from '../data/mockData'

// Surface 07 — Playing: where you stand in everyone else's games.
// Organising asks "how full is my game?"; this page asks "where am I in it?",
// so each row shows YOUR status, not the game's count.

type ViewState = 'loading' | 'ready' | 'error'

type Row = {
  game: Game
  venue: Venue
  signup: Signup
  kind: 'in' | 'queue' | 'played' | 'cancelled'
  position: number | null
}

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth']
const ordinal = (n: number) => ORDINALS[n - 1] ?? `#${n}`

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// "Tonight 20:30", "Tomorrow 18:00", "Thursday 22:00", "Last Tuesday 21:00"
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

function hasFinished(game: Game) {
  return (
    game.status === 'played' ||
    game.startsAt.getTime() + game.durationMinutes * 60_000 < Date.now()
  )
}

// Upcoming first (soonest at the top), then cancelled, then history.
const ORDER: Record<Row['kind'], number> = { in: 0, queue: 0, cancelled: 1, played: 2 }
function compareRows(a: Row, b: Row) {
  if (ORDER[a.kind] !== ORDER[b.kind]) return ORDER[a.kind] - ORDER[b.kind]
  const diff = a.game.startsAt.getTime() - b.game.startsAt.getTime()
  return a.kind === 'played' ? -diff : diff
}

export default function Playing() {
  const { currentUser, users } = useAuth()
  const { games, venues, signups, cancelSignup } = useGames()
  const [params, setParams] = useSearchParams()

  // Phase 1 simulates the request. ?state=loading|empty|error forces a state
  // so all four are reachable from a link.
  const forced = params.get('state')
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setViewState('loading')
    const timer = setTimeout(() => setViewState('ready'), 600)
    return () => clearTimeout(timer)
  }, [attempt])

  const [pending, setPending] = useState<Row | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 6000)
    return () => clearTimeout(timer)
  }, [notice])

  const nameOf = (userId: string) => users.find((u) => u.id === userId)?.name ?? 'someone'

  if (!currentUser) {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S07 · rev A">
        <h1 className={pageTitle}>My games</h1>
        <div className="mt-7 rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
            Sign in to see your games
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
            The games you play in and the queues you are waiting in show up here.
          </p>
          <div className="mt-8">
            <Link to="/signin?next=/my-games/playing" className={`${primaryButton} ${sizeSmall}`}>
              Sign in
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const me = currentUser.id

  const rows: Row[] = signups
    .filter((s) => s.playerId === me && s.status !== 'cancelled')
    .flatMap((signup): Row[] => {
      const game = games.find((g) => g.id === signup.gameId)
      const venue = game && venues.find((v) => v.id === game.venueId)
      if (!game || !venue) return []

      if (game.status === 'cancelled') {
        return [{ game, venue, signup, kind: 'cancelled', position: null }]
      }
      if (hasFinished(game)) {
        // Only people who actually had a place played the game.
        return signup.status === 'confirmed'
          ? [{ game, venue, signup, kind: 'played', position: null }]
          : []
      }
      // Upcoming games you organise belong on the Organising tab.
      if (game.organiserId === me) return []

      if (signup.status === 'confirmed') {
        return [{ game, venue, signup, kind: 'in', position: null }]
      }
      return [{ game, venue, signup, kind: 'queue', position: queuePosition(game.id, me, signups) }]
    })
    .sort(compareRows)

  const organisingCount = games.filter(
    (g) => g.organiserId === me && g.status !== 'cancelled' && !hasFinished(g),
  ).length

  const state: 'loading' | 'error' | 'empty' | 'populated' =
    forced === 'loading' || forced === 'error' || forced === 'empty'
      ? forced
      : viewState === 'loading'
        ? 'loading'
        : viewState === 'error'
          ? 'error'
          : rows.length === 0
            ? 'empty'
            : 'populated'

  function retry() {
    if (forced) setParams({}, { replace: true })
    setAttempt((n) => n + 1)
  }

  function confirmPending() {
    if (!pending) return
    const venueName = pending.venue.name
    const promoted = cancelSignup(pending.signup.id)
    if (pending.kind === 'in') {
      setNotice(
        promoted
          ? `You dropped out of ${venueName}. ${nameOf(promoted.playerId)} moved in from the queue.`
          : `You dropped out of ${venueName}. Your spot is open again.`,
      )
    } else {
      setNotice(`You left the queue for ${venueName}. Everybody behind you moved up.`)
    }
    setPending(null)
  }

  const tabActive =
    'border-b-2 border-accent-300 pb-3 font-display text-lg uppercase tracking-wide text-ink'
  const tabInactive =
    'border-b-2 border-transparent pb-3 font-display text-lg uppercase tracking-wide text-muted hover:text-ink'
  const tabCount = 'font-display tabular-nums tracking-wide ml-2 text-base text-muted'

  return (
    <Layout footerCode="CSC443-F26 · T07 · S07 · rev A">
      <h1 className={pageTitle}>My games</h1>

      <div className="mt-7 border-b border-line">
        <nav className="flex gap-8" aria-label="My games">
          <NavLink to="/my-games/organising" className={({ isActive }) => (isActive ? tabActive : tabInactive)}>
            Organising <span className={tabCount}>{organisingCount}</span>
          </NavLink>
          <NavLink to="/my-games/playing" className={({ isActive }) => (isActive ? tabActive : tabInactive)}>
            Playing <span className={tabCount}>{rows.length}</span>
          </NavLink>
        </nav>
      </div>

      <div role="status" aria-live="polite">
        {notice && (
          <div className="mt-6 max-w-sm rounded-card border border-brand-500/50 bg-surface p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-400 text-[11px] font-bold text-[#06120C]">
                &#10003;
              </span>
              <p className="text-xs text-muted">{notice}</p>
            </div>
          </div>
        )}
      </div>

      {state === 'loading' && (
        <ul className="mt-6 space-y-4" aria-busy="true" aria-label="Loading your games">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-surface px-5 py-4"
            >
              <span className="min-w-0 flex-1 space-y-2.5">
                <span className="block h-5 w-48 animate-pulse rounded bg-line"></span>
                <span className="block h-3 w-40 animate-pulse rounded bg-line"></span>
              </span>
              <span className="h-6 w-24 animate-pulse rounded-full bg-line"></span>
              <span className="h-8 w-24 animate-pulse rounded-full bg-line"></span>
            </li>
          ))}
        </ul>
      )}

      {state === 'empty' && (
        <div className="mt-6 rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
            You are not in any games
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
            Take a spot in a game tonight, or join a queue and see exactly where you stand.
          </p>
          <div className="mt-8">
            <Link to="/games" className={`${primaryButton} ${sizeSmall}`}>
              Find a game
            </Link>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="mt-6 rounded-card border border-red-500/40 bg-red-500/10 px-6 py-16 text-center">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-red-200">
            Your games would not load
          </h2>
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

      {state === 'populated' && (
        <ul className="mt-6 space-y-4">
          {rows.map((row) => (
            <PlayingRow
              key={row.signup.id}
              row={row}
              organiser={row.game.organiserId === me ? 'you' : nameOf(row.game.organiserId)}
              onLeave={() => setPending(row)}
            />
          ))}
        </ul>
      )}

      {pending && (
        <ConfirmDialog
          title={pending.kind === 'in' ? `Drop out of ${pending.venue.name}?` : 'Leave the queue?'}
          body={
            pending.kind === 'in'
              ? 'Your spot goes to number one in the queue straight away. If you change your mind you join again at the back.'
              : `You are ${ordinal(pending.position ?? 0)} in line for ${pending.venue.name}. If you leave, you lose your place.`
          }
          confirmLabel={pending.kind === 'in' ? 'Drop out' : 'Leave queue'}
          cancelLabel={pending.kind === 'in' ? 'Stay in' : 'Keep my place'}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        />
      )}
    </Layout>
  )
}

function PlayingRow({
  row,
  organiser,
  onLeave,
}: {
  row: Row
  organiser: string
  onLeave: () => void
}) {
  const { game, venue, kind, position } = row
  const when = formatWhen(game.startsAt)

  const detail =
    kind === 'cancelled' ? `${when} · cancelled by ${organiser}` : `${when} · organised by ${organiser}`

  let badge: { className: string; label: string }
  let action: ReactNode = null

  switch (kind) {
    case 'in':
      badge = { className: badgeYouAreIn, label: 'You are in' }
      action = (
        <button type="button" onClick={onLeave} className={`${secondaryButton} ${sizeSmall}`}>
          Drop out
        </button>
      )
      break
    case 'queue':
      badge = { className: badgeQueue, label: `Queue · ${ordinal(position ?? 0)}` }
      action = (
        <button type="button" onClick={onLeave} className={`${ghostButton} ${sizeSmall}`}>
          Leave queue
        </button>
      )
      break
    case 'cancelled':
      badge = { className: badgeCancelled, label: 'Game cancelled' }
      action = (
        <Link to="/games" className={`${secondaryButton} ${sizeSmall}`}>
          Find another
        </Link>
      )
      break
    case 'played':
      badge = { className: badgeMuted, label: 'Played' }
      break
  }

  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-surface px-5 py-4">
      <span className="min-w-0 flex-1">
        <Link
          to={`/games/${game.id}`}
          className="block font-display text-xl uppercase leading-none tracking-wide text-ink hover:text-brand-300"
        >
          {venue.name}
        </Link>
        <span className="mt-2 block text-xs text-muted">{detail}</span>
      </span>
      <span className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
        <span className={badge.className}>{badge.label}</span>
        <span className="flex-1 sm:flex-none"></span>
        {action}
      </span>
    </li>
  )
}
