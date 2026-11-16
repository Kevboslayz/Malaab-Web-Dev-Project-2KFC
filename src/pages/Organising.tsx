import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Layout from '../components/Layout'
import {
  badgeMuted,
  badgeQueue,
  dangerButton,
  pageTitle,
  primaryButton,
  secondaryButton,
  sizeSmall,
} from '../components/ui'
import { initials, useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import { confirmedFor, queueFor, spotsLeft } from '../data/roster'
import type { Game, Signup, Venue } from '../data/mockData'

type OrganisedGame = { game: Game; venue: Venue }

function hasFinished(game: Game) {
  return game.status === 'played' || game.startsAt.getTime() + game.durationMinutes * 60_000 < Date.now()
}

function formatWhen(date: Date) {
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  const diff = Math.round((day.getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return `${date.getHours() >= 17 ? 'Tonight' : 'Today'} ${time}`
  if (diff === 1) return `Tomorrow ${time}`
  if (diff > 1 && diff < 7) return `${date.toLocaleDateString('en-GB', { weekday: 'long' })} ${time}`
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ` ${time}`
}

export default function Organising() {
  const { currentUser, users } = useAuth()
  const { games, venues, signups, cancelGame, cancelSignup } = useGames()
  const [openRoster, setOpenRoster] = useState<string | null>(null)
  const [pendingSignup, setPendingSignup] = useState<{ game: Game; signup: Signup } | null>(null)
  const [pendingGame, setPendingGame] = useState<OrganisedGame | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (!currentUser) {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S06 · rev A">
        <h1 className={pageTitle}>My games</h1>
        <div className="mt-7 rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
            Sign in to see your games
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
            The games you organise and the queues you manage show up here.
          </p>
          <div className="mt-8">
            <Link to="/signin?next=%2Fmy-games%2Forganising" className={`${primaryButton} ${sizeSmall}`}>
              Sign in
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const organisedGames = games
    .filter((game) => game.organiserId === currentUser.id && game.status !== 'cancelled' && !hasFinished(game))
    .flatMap((game): OrganisedGame[] => {
      const venue = venues.find((item) => item.id === game.venueId)
      return venue ? [{ game, venue }] : []
    })
    .sort((a, b) => a.game.startsAt.getTime() - b.game.startsAt.getTime())

  function removePlayer() {
    if (!pendingSignup) return
    const removedName = users.find((user) => user.id === pendingSignup.signup.playerId)?.name ?? 'The player'
    const promoted = cancelSignup(pendingSignup.signup.id)
    setNotice(
      promoted
        ? `${removedName} was removed. ${users.find((user) => user.id === promoted.playerId)?.name ?? 'The next player'} moved up from the queue.`
        : `${removedName} was removed from the game.`,
    )
    setPendingSignup(null)
  }

  return (
    <Layout footerCode="CSC443-F26 · T07 · S06 · rev A">
      <h1 className={pageTitle}>My games</h1>
      <div className="mt-7 border-b border-line">
        <nav className="flex gap-8" aria-label="My games">
          <NavLink
            to="/my-games/organising"
            className={({ isActive }) => isActive
              ? 'border-b-2 border-accent-300 pb-3 font-display text-lg uppercase tracking-wide text-ink'
              : 'border-b-2 border-transparent pb-3 font-display text-lg uppercase tracking-wide text-muted hover:text-ink'}
          >
            Organising <span className="ml-2 font-display tabular-nums text-base text-muted">{organisedGames.length}</span>
          </NavLink>
          <NavLink
            to="/my-games/playing"
            className={({ isActive }) => isActive
              ? 'border-b-2 border-accent-300 pb-3 font-display text-lg uppercase tracking-wide text-ink'
              : 'border-b-2 border-transparent pb-3 font-display text-lg uppercase tracking-wide text-muted hover:text-ink'}
          >
            Playing
          </NavLink>
        </nav>
      </div>

      {notice && (
        <div role="status" aria-live="polite" className="mt-5 max-w-xl rounded-card border border-brand-500/50 bg-surface p-4 text-sm text-muted">
          {notice}
        </div>
      )}

      {organisedGames.length === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.01em] text-ink">
            You have not started a game
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
            Book a pitch, put it up here, and let the roster fill itself.
          </p>
          <div className="mt-8">
            <Link to="/create" className={`${primaryButton} ${sizeSmall}`}>Start a game</Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {organisedGames.map(({ game, venue }) => {
            const confirmed = confirmedFor(game.id, signups)
            const waiting = queueFor(game.id, signups)
            const remaining = spotsLeft(game, signups)
            const rosterIsOpen = openRoster === game.id
            return (
              <li key={game.id} className="rounded-card border border-line bg-surface px-5 py-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl uppercase leading-none tracking-wide text-ink">{venue.name}</span>
                    <span className="mt-2 block text-xs text-muted">
                      {formatWhen(game.startsAt)} · {game.sport.toLowerCase()} · ${game.costPerPlayer} a player
                    </span>
                  </span>
                  <span className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                    <span className="flex items-center gap-3">
                      <span className="font-display tabular-nums text-2xl text-ink">
                        {confirmed.length}<span className="text-muted">/{game.playersNeeded}</span>
                      </span>
                      <span className={remaining > 0 ? badgeQueue : badgeMuted}>
                        {remaining > 0 ? `${remaining} ${remaining === 1 ? 'spot' : 'spots'}` : 'Full'}
                      </span>
                    </span>
                    {waiting.length > 0 && (
                      <span className={badgeQueue}>{waiting.length} waiting</span>
                    )}
                    <span className="flex-1 sm:flex-none" />
                    <Link to={`/create?edit=${encodeURIComponent(game.id)}`} className={`${secondaryButton} ${sizeSmall}`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpenRoster(rosterIsOpen ? null : game.id)}
                      className={`${secondaryButton} ${sizeSmall}`}
                      aria-expanded={rosterIsOpen}
                    >
                      {waiting.length > 0 ? 'Manage queue' : 'Manage roster'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingGame({ game, venue })}
                      className={`${dangerButton} ${sizeSmall}`}
                    >
                      Cancel game
                    </button>
                  </span>
                </div>

                {rosterIsOpen && (
                  <div className="mt-5 border-t border-line pt-4">
                    <h2 className="text-sm font-semibold text-ink">Roster and queue</h2>
                    {[...confirmed, ...waiting].length === 0 ? (
                      <p className="mt-3 text-xs text-muted">No players have joined yet.</p>
                    ) : (
                      <ul className="mt-3 divide-y divide-line">
                        {[...confirmed, ...waiting].map((signup, index) => {
                          const player = users.find((user) => user.id === signup.playerId)
                          const isOrganiser = signup.playerId === currentUser.id
                          return (
                            <li key={signup.id} className="flex flex-wrap items-center gap-3 py-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/25 text-[11px] font-bold text-brand-200">
                                {initials(player?.name ?? '?')}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm text-ink">{player?.name ?? 'Unknown player'}{isOrganiser ? ' · organiser' : ''}</span>
                                <span className="text-xs text-muted">
                                  {signup.status === 'confirmed' ? 'Confirmed' : `Queue · ${index - confirmed.length + 1}`}
                                </span>
                              </span>
                              {!isOrganiser && (
                                <button
                                  type="button"
                                  onClick={() => setPendingSignup({ game, signup })}
                                  className={`${secondaryButton} ${sizeSmall}`}
                                >
                                  Remove
                                </button>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {pendingSignup && (
        <ConfirmDialog
          title="Remove this player?"
          body="If they had a confirmed spot, the first person in the queue will take it immediately."
          confirmLabel="Remove player"
          cancelLabel="Keep player"
          onConfirm={removePlayer}
          onCancel={() => setPendingSignup(null)}
        />
      )}
      {pendingGame && (
        <ConfirmDialog
          title={`Cancel ${pendingGame.venue.name}?`}
          body="The game will no longer appear in the upcoming games list."
          confirmLabel="Cancel game"
          cancelLabel="Keep game"
          onConfirm={() => {
            cancelGame(pendingGame.game.id)
            setPendingGame(null)
          }}
          onCancel={() => setPendingGame(null)}
        />
      )}
    </Layout>
  )
}
