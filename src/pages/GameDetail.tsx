import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Layout from '../components/Layout'
import Roster from '../components/Roster'
import {
  badgeCancelled,
  badgeMuted,
  dangerButton,
  ghostButton,
  pageTitle,
  primaryButton,
  secondaryButton,
  sizeNormal,
  sizeSmall,
} from '../components/ui'
import { initials, useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { queueFor, queuePosition, signupFor, spotsLeft } from '../data/roster'
import { formatWhen, hasFinished, ordinal } from '../utils/format'

// Surface 03 — Game detail. The action bar is chosen by asking who the viewer
// is relative to this game, not by a flag stored on the game.
export default function GameDetail() {
  const { id } = useParams()
  const { currentUser, users } = useAuth()
  const { games, venues, signups, cancelGame, joinGame, cancelSignup } = useGames()
  const [params, setParams] = useSearchParams()
  const [pending, setPending] = useState<'drop' | 'queue' | 'game' | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const game = games.find((item) => item.id === id)
  const forced = params.get('state')

  if (forced === 'loading') {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
        <div className="h-3 w-32 animate-pulse rounded bg-line" />
        <div className="mt-6 h-14 w-2/3 animate-pulse rounded bg-line" />
        <div className="mt-10 h-40 animate-pulse rounded-card bg-surface" />
      </Layout>
    )
  }

  if (forced === 'error') {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
        <h1 className={pageTitle}>Game unavailable</h1>
        <div className="mt-7 rounded-card border border-red-500/40 bg-red-500/10 px-6 py-14 text-center">
          <p className="text-sm text-red-200">The game could not be loaded. Please try again.</p>
          <button
            type="button"
            onClick={() => setParams({}, { replace: true })}
            className={`${primaryButton} ${sizeSmall} mt-6`}
          >
            Try again
          </button>
        </div>
      </Layout>
    )
  }

  if (!game) {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
        <h1 className={pageTitle}>Game not found</h1>
        <p className="mt-4 max-w-prose text-sm text-muted">
          This game is no longer available.
        </p>
        <Link to="/games" className={`${primaryButton} ${sizeNormal} mt-7`}>
          Back to games
        </Link>
      </Layout>
    )
  }

  const venue = venues.find((item) => item.id === game.venueId)
  const organiser = users.find((user) => user.id === game.organiserId)
  const waiting = queueFor(game.id, signups)
  const spots = spotsLeft(game, signups)
  const mine = currentUser ? signupFor(game.id, currentUser.id, signups) : undefined
  const position = currentUser ? queuePosition(game.id, currentUser.id, signups) : null
  const isOwner = currentUser?.id === game.organiserId
  const isCancelled = game.status === 'cancelled'
  const finished = hasFinished(game)

  function join() {
    if (!currentUser) return
    const signup = joinGame(game!.id, currentUser.id)
    if (signup) {
      setNotice(
        signup.status === 'confirmed'
          ? 'You are in. Bring the cash and a dark shirt.'
          : `This game is full. You are ${ordinal(waiting.length + 1)} in the queue.`,
      )
    }
  }

  function confirmPending() {
    if (!currentUser || !pending) return
    if (pending === 'game') {
      cancelGame(game!.id)
      setNotice('This game has been cancelled. It no longer appears in the games list.')
    } else if (mine) {
      const promoted = cancelSignup(mine.id)
      setNotice(
        promoted
          ? `You are out. ${users.find((user) => user.id === promoted.playerId)?.name ?? 'The next player'} moved up from the queue.`
          : pending === 'drop'
            ? 'You have dropped out. Your spot is open again.'
            : 'You have left the queue. Everybody behind you moved up.',
      )
    }
    setPending(null)
  }

  function nameOf(userId: string) {
    return users.find((user) => user.id === userId)?.name ?? 'the organiser'
  }

  return (
    <Layout footerCode="CSC443-F26 · T07 · S03 · rev A">
      <nav className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted" aria-label="Breadcrumb">
        <Link to="/games" className="hover:text-ink">Games</Link>
        <span className="text-brand-400"> / </span>
        {game.sport}
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">
            {game.sport} · {game.level} · {game.durationMinutes} minutes
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-ink">
            {venue?.name ?? 'Game'}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {formatWhen(game.startsAt)} · {venue?.area ?? 'Unknown'} ·{' '}
            <span className="font-display tabular-nums tracking-wide text-ink">${game.costPerPlayer}</span>{' '}
            a player
          </p>
          {game.notes && <p className="mt-3 max-w-prose text-sm text-muted">{game.notes}</p>}
        </div>
        {venue && (
          <Link
            to={`/venues/${venue.id}`}
            className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3 hover:border-brand-500/60"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-200">
              {venue.format}
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-ink">{venue.name}</span>
              <span className="block text-xs text-muted">{venue.floodlights ? 'Floodlit' : venue.surface} · view venue</span>
            </span>
          </Link>
        )}
      </div>

      {notice && (
        <div role="status" aria-live="polite" className="mt-6 max-w-sm rounded-card border border-brand-500/50 bg-surface p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-400 text-[11px] font-bold text-[#06120C]">
              ✓
            </span>
            <p className="text-xs text-muted">{notice}</p>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mt-6 flex items-center gap-3 rounded-card border border-red-500/40 bg-red-500/10 px-5 py-4">
          <span className={badgeCancelled}>Game cancelled</span>
          <span className="text-sm text-muted">This game is no longer taking players.</span>
        </div>
      )}

      {!isCancelled && finished && (
        <div className="mt-6 flex items-center gap-3 rounded-card border border-line bg-surface px-5 py-4">
          <span className={badgeMuted}>Played</span>
          <span className="text-sm text-muted">This game has finished.</span>
        </div>
      )}

      {!isCancelled && !finished && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card border border-line bg-surface px-5 py-4">
          {isOwner ? (
            <>
              <span className="text-sm text-ink">
                <strong className="font-semibold">You are organising this.</strong>{' '}
                <span className="text-muted">
                  {spots > 0 ? `${spots} ${spots === 1 ? 'spot' : 'spots'} still open.` : 'The roster is full.'}
                </span>
              </span>
              <span className="flex-1"></span>
              <Link to={`/create?edit=${encodeURIComponent(game.id)}`} className={`${secondaryButton} ${sizeSmall}`}>
                Edit game
              </Link>
              <button type="button" onClick={() => setPending('game')} className={`${dangerButton} ${sizeSmall}`}>
                Cancel game
              </button>
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
          ) : mine?.status === 'confirmed' ? (
            <>
              <span className="text-sm text-ink">
                You are playing. <span className="text-muted">Bring ${game.costPerPlayer} and a dark shirt.</span>
              </span>
              <span className="flex-1"></span>
              <button type="button" onClick={() => setPending('drop')} className={`${secondaryButton} ${sizeSmall}`}>
                Drop out
              </button>
            </>
          ) : mine?.status === 'waitlisted' ? (
            <>
              <span className="text-sm text-ink">
                This game is full. <span className="text-muted">You are {ordinal(position ?? 1)} if somebody drops.</span>
              </span>
              <span className="flex-1"></span>
              <button type="button" onClick={() => setPending('queue')} className={`${ghostButton} ${sizeSmall}`}>
                Leave the queue
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-ink">
                {spots > 0 ? `${spots} ${spots === 1 ? 'spot' : 'spots'} left.` : 'This game is full.'}{' '}
                <span className="text-muted">Organised by {nameOf(game.organiserId)}.</span>
              </span>
              <span className="flex-1"></span>
              {spots > 0 ? (
                <button type="button" onClick={join} className={`${primaryButton} ${sizeSmall}`}>
                  Join this game
                </button>
              ) : (
                <button type="button" onClick={join} className={`${secondaryButton} ${sizeSmall}`}>
                  Join the queue
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-6">
        <Roster game={game} signups={signups} users={users} viewerId={currentUser?.id} />
      </div>

      {!isOwner && waiting.length === 0 && spots === 0 && !mine && currentUser && (
        <p className="mt-4 text-xs text-muted">Nobody is waiting yet — you would be first in line.</p>
      )}

      {organiser && !isOwner && (
        <div className="mt-6 flex items-center gap-3 text-xs text-muted">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/25 text-[11px] font-bold text-brand-200">
            {initials(organiser.name)}
          </span>
          Organised by {organiser.name}
        </div>
      )}

      {pending && (
        <ConfirmDialog
          title={
            pending === 'game'
              ? `Cancel ${venue?.name ?? 'this game'}?`
              : pending === 'drop'
                ? 'Drop out of this game?'
                : 'Leave the queue?'
          }
          body={
            pending === 'game'
              ? 'The game will no longer appear in the games list. Players will not be notified automatically in Phase 1.'
              : pending === 'drop'
                ? 'Your spot goes to number one in the queue straight away.'
                : `You are ${ordinal(position ?? 1)} in line. If you leave, you lose your place.`
          }
          confirmLabel={pending === 'game' ? 'Cancel game' : pending === 'drop' ? 'Drop out' : 'Leave queue'}
          cancelLabel={pending === 'game' ? 'Keep game' : 'Keep my place'}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        />
      )}
    </Layout>
  )
}
