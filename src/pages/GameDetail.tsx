import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Layout from '../components/Layout'
import Roster from '../components/Roster'
import {
  dangerButton,
  ghostButton,
  pageTitle,
  primaryButton,
  secondaryButton,
  sizeSmall,
} from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import type { Game, Signup } from '../data/mockData'
import { queueFor, queuePosition, spotsLeft } from '../data/roster'
import { formatWhen, ordinal } from '../utils/format'

// Surface 03 — Game detail: three viewer variants, the roster, and the queue.

type ViewState = 'loading' | 'ready' | 'error'

type PendingAction =
  | { kind: 'drop'; signup: Signup; venueName: string }
  | { kind: 'leave-queue'; signup: Signup; venueName: string; position: number }
  | { kind: 'remove-player'; signup: Signup; playerName: string }
  | { kind: 'cancel-game'; game: Game; venueName: string }

type Toast = {
  title: string
  body: string
}

const COUNTS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
const countWord = (n: number) => COUNTS[n] ?? String(n)

function formatFormatBadge(game: Game) {
  if (game.sport === 'Football' && game.playersNeeded === 10) return '7v7'
  const perSide = Math.floor(game.playersNeeded / 2)
  return perSide > 0 ? `${perSide}v${perSide}` : `${game.playersNeeded}p`
}

export default function GameDetail() {
  const { id } = useParams<{ id: string }>()
  const [params, setParams] = useSearchParams()
  const { currentUser, users } = useAuth()
  const { games, venues, signups, joinGame, cancelSignup, cancelGame } = useGames()

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

  const [pending, setPending] = useState<PendingAction | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(timer)
  }, [toast])

  const game = forced === 'empty' ? undefined : games.find((g) => g.id === id)
  const venue = game ? venues.find((v) => v.id === game.venueId) : undefined

  const state: 'loading' | 'error' | 'empty' | 'populated' =
    forced === 'loading' || forced === 'error' || forced === 'empty'
      ? forced
      : viewState === 'loading'
        ? 'loading'
        : viewState === 'error'
          ? 'error'
          : !game || !venue
            ? 'empty'
            : 'populated'

  function retry() {
    if (forced) setParams({}, { replace: true })
    setAttempt((n) => n + 1)
  }

  const nameOf = (userId: string) => users.find((u) => u.id === userId)?.name ?? 'Player'

  if (state === 'loading') {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
        <div aria-busy="true" aria-label="Loading game details" className="space-y-6">
          <span className="block h-3.5 w-32 animate-pulse rounded bg-line"></span>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <span className="block h-3.5 w-48 animate-pulse rounded bg-line"></span>
              <span className="block h-12 w-72 animate-pulse rounded bg-line sm:w-96"></span>
              <span className="block h-4 w-56 animate-pulse rounded bg-line"></span>
            </div>
            <span className="h-16 w-56 animate-pulse rounded-card bg-surface border border-line"></span>
          </div>
          <div className="h-16 w-full animate-pulse rounded-card border border-line bg-surface"></div>
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="h-6 w-28 animate-pulse rounded bg-line"></span>
              <span className="h-7 w-32 animate-pulse rounded-full bg-line"></span>
            </div>
            <div className="flex flex-wrap gap-2.5 px-5 py-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="h-14 w-14 flex-none animate-pulse rounded-full bg-line"></span>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (state === 'error') {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
        <div className="rounded-card border border-red-500/40 bg-red-500/10 px-6 py-16 text-center">
          <h1 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-red-200">
            This game would not load
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

  if (state === 'empty' || !game || !venue) {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
        <div className="rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <h1 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
            Game not found
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
            No pickup game matches this link. It may have been cancelled or moved.
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

  // House rule: computed from signups, never stored as a field.
  const queue = queueFor(game.id, signups)
  const spots = Math.max(0, spotsLeft(game, signups))
  const isFull = spots === 0
  const isClosed = game.status === 'cancelled' || game.status === 'played'

  // Viewer variant: asked as a real question ("is this mine?"), never a static flag.
  const isOrganiser = Boolean(currentUser && currentUser.id === game.organiserId)
  const mySignup = currentUser
    ? signups.find(
        (s) => s.gameId === game.id && s.playerId === currentUser.id && s.status !== 'cancelled',
      )
    : undefined
  const myQueuePos =
    currentUser && mySignup?.status === 'waitlisted'
      ? queuePosition(game.id, currentUser.id, signups)
      : null

  const organiserName = nameOf(game.organiserId)
  const when = formatWhen(game.startsAt)

  function handleJoin() {
    if (!currentUser || !game || !venue || mySignup || isClosed) return
    const created = joinGame(game.id, currentUser.id)
    if (!created) return

    if (created.status === 'confirmed') {
      setToast({
        title: 'You are in',
        body: `You took a confirmed spot for ${when.toLowerCase()} at ${venue.name}.`,
      })
    } else {
      const pos = queue.length + 1
      setToast({
        title: `Queue · ${ordinal(pos)}`,
        body: `${venue.name} is full. You are ${ordinal(pos)} in line and will move in automatically if someone drops.`,
      })
    }
  }

  function confirmAction() {
    if (!pending || !game || !venue) return

    if (pending.kind === 'drop') {
      const promoted = cancelSignup(pending.signup.id)
      setToast({
        title: 'You dropped out',
        body: promoted
          ? `You left ${venue.name}. ${nameOf(promoted.playerId)} moved up from the queue to take your spot.`
          : `Your spot at ${venue.name} is open again.`,
      })
    } else if (pending.kind === 'leave-queue') {
      cancelSignup(pending.signup.id)
      setToast({
        title: 'Left the queue',
        body: `You left the queue for ${venue.name}. Everybody behind you shifted up.`,
      })
    } else if (pending.kind === 'remove-player') {
      const promoted = cancelSignup(pending.signup.id)
      setToast({
        title: 'Player removed',
        body: promoted
          ? `${pending.playerName} was removed. ${nameOf(promoted.playerId)} moved up from the queue into the roster.`
          : `${pending.playerName} was removed from the roster.`,
      })
    } else if (pending.kind === 'cancel-game') {
      cancelGame(game.id)
      setToast({
        title: 'Game cancelled',
        body: `${venue.name} (${when}) has been cancelled.`,
      })
    }

    setPending(null)
  }

  return (
    <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
      <nav
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted"
        aria-label="Breadcrumb"
      >
        <Link to="/games" className="hover:text-ink">
          Games
        </Link>{' '}
        <span className="text-brand-400">/</span> {game.sport}
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted text-brand-300">
            {game.sport} &middot; {game.level} &middot; {game.durationMinutes} minutes
          </p>
          <h1 className={`${pageTitle} mt-2`}>{venue.name}</h1>
          <p className="mt-3 text-sm text-muted">
            {when} &middot; {venue.area} &middot;{' '}
            <span className="font-display tabular-nums tracking-wide text-ink">
              ${game.costPerPlayer}
            </span>{' '}
            a player
          </p>
          {game.notes && <p className="mt-3 max-w-prose text-sm text-muted">{game.notes}</p>}
        </div>
        <Link
          to={`/venues/${venue.id}`}
          className="rounded-card border border-line bg-surface flex items-center gap-3 px-4 py-3 hover:border-brand-500/60"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-200">
            {formatFormatBadge(game)}
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold text-ink">{venue.name}</span>
            <span className="block text-xs text-muted">
              {venue.floodlights ? 'Floodlit' : venue.surface} &middot; view venue
            </span>
          </span>
        </Link>
      </div>

      {/* Viewer-aware action bar: Organiser / Another signed-in player / Signed out */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card border border-line bg-surface px-5 py-4">
        {game.status === 'cancelled' ? (
          <>
            <span className="text-sm text-ink">
              <strong className="font-semibold text-red-300">This game was cancelled.</strong>{' '}
              <span className="text-muted">Organised by {organiserName}.</span>
            </span>
            <span className="flex-1"></span>
            <Link to="/games" className={`${secondaryButton} ${sizeSmall}`}>
              Find another
            </Link>
          </>
        ) : game.status === 'played' ? (
          <>
            <span className="text-sm text-ink">
              This game has already been played.{' '}
              <span className="text-muted">Organised by {organiserName}.</span>
            </span>
            <span className="flex-1"></span>
            <Link to="/games" className={`${secondaryButton} ${sizeSmall}`}>
              Browse games
            </Link>
          </>
        ) : !currentUser ? (
          <>
            <span className="text-sm text-ink">Sign in to take a spot.</span>
            <span className="flex-1"></span>
            <Link
              to={`/signin?next=${encodeURIComponent(`/games/${game.id}`)}`}
              className={`${secondaryButton} ${sizeSmall}`}
            >
              Sign in
            </Link>
          </>
        ) : isOrganiser ? (
          <>
            <span className="text-sm text-ink">
              <strong className="font-semibold">You are organising this.</strong>{' '}
              <span className="text-muted">
                {isFull
                  ? 'The roster is full.'
                  : `${countWord(spots)} ${spots === 1 ? 'spot' : 'spots'} still open.`}
              </span>
            </span>
            <span className="flex-1"></span>
            <Link
              to={`/create?edit=${encodeURIComponent(game.id)}`}
              className={`${secondaryButton} ${sizeSmall}`}
            >
              Edit game
            </Link>
            <button
              type="button"
              onClick={() => setPending({ kind: 'cancel-game', game, venueName: venue.name })}
              className={`${dangerButton} ${sizeSmall}`}
            >
              Cancel game
            </button>
          </>
        ) : mySignup?.status === 'confirmed' ? (
          <>
            <span className="text-sm text-ink">
              You are playing.{' '}
              <span className="text-muted">
                Bring ${game.costPerPlayer} and a dark shirt.
              </span>
            </span>
            <span className="flex-1"></span>
            <button
              type="button"
              onClick={() => setPending({ kind: 'drop', signup: mySignup, venueName: venue.name })}
              className={`${secondaryButton} ${sizeSmall}`}
            >
              Drop out
            </button>
          </>
        ) : mySignup?.status === 'waitlisted' ? (
          <>
            <span className="text-sm text-ink">
              This game is full.{' '}
              <span className="text-muted">
                You are {ordinal(myQueuePos ?? 1)} if somebody drops.
              </span>
            </span>
            <span className="flex-1"></span>
            <button
              type="button"
              onClick={() =>
                setPending({
                  kind: 'leave-queue',
                  signup: mySignup,
                  venueName: venue.name,
                  position: myQueuePos ?? 1,
                })
              }
              className={`${ghostButton} ${sizeSmall}`}
            >
              Leave the queue
            </button>
          </>
        ) : isFull ? (
          <>
            <span className="text-sm text-ink">
              This game is full.{' '}
              <span className="text-muted">Organised by {organiserName}.</span>
            </span>
            <span className="flex-1"></span>
            <button
              type="button"
              onClick={handleJoin}
              className={`${secondaryButton} ${sizeSmall}`}
            >
              Join the queue
            </button>
          </>
        ) : (
          <>
            <span className="text-sm text-ink">
              {countWord(spots)} {spots === 1 ? 'spot' : 'spots'} left.{' '}
              <span className="text-muted">Organised by {organiserName}.</span>
            </span>
            <span className="flex-1"></span>
            <button
              type="button"
              onClick={handleJoin}
              className={`${primaryButton} ${sizeSmall}`}
            >
              Join this game
            </button>
          </>
        )}
      </div>

      {/* The roster — signature component */}
      <Roster
        game={game}
        signups={signups}
        onRemovePlayer={(signup, playerName) =>
          setPending({ kind: 'remove-player', signup, playerName })
        }
      />

      {/* Promotion / status moment toast */}
      <div role="status" aria-live="polite">
        {toast && (
          <div className="mt-6 max-w-sm rounded-card border border-line bg-surface border-brand-500/50 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-400 text-[11px] font-bold text-[#06120C]">
                &#10003;
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{toast.title}</p>
                <p className="mt-1 text-xs text-muted">{toast.body}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {pending && (
        <ConfirmDialog
          title={
            pending.kind === 'drop'
              ? `Drop out of ${pending.venueName}?`
              : pending.kind === 'leave-queue'
                ? 'Leave the queue?'
                : pending.kind === 'remove-player'
                  ? `Remove ${pending.playerName}?`
                  : `Cancel ${pending.venueName}?`
          }
          body={
            pending.kind === 'drop'
              ? 'Your spot goes to number one in the queue straight away. If you change your mind you join again at the back.'
              : pending.kind === 'leave-queue'
                ? `You are ${ordinal(pending.position)} in line for ${pending.venueName}. If you leave, you lose your place.`
                : pending.kind === 'remove-player'
                  ? `Removing ${pending.playerName} frees their place and promotes number one from the queue if anyone is waiting.`
                  : 'Cancelling this game marks it as cancelled for everyone on the roster and in the queue.'
          }
          confirmLabel={
            pending.kind === 'drop'
              ? 'Drop out'
              : pending.kind === 'leave-queue'
                ? 'Leave queue'
                : pending.kind === 'remove-player'
                  ? 'Remove player'
                  : 'Cancel game'
          }
          cancelLabel={
            pending.kind === 'drop'
              ? 'Stay in'
              : pending.kind === 'leave-queue'
                ? 'Keep my place'
                : 'Keep'
          }
          onConfirm={confirmAction}
          onCancel={() => setPending(null)}
        />
      )}
    </Layout>
  )
}
