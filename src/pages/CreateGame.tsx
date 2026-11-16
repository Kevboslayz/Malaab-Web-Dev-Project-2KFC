import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Field from '../components/Field'
import Layout from '../components/Layout'
import { fieldLabel, inputValid, pageTitle, primaryButton, secondaryButton, sizeNormal } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useGames } from '../context/GamesContext'
import type { Game } from '../data/mockData'

type Values = {
  venueId: string
  date: string
  time: string
  playersNeeded: string
  costPerPlayer: string
  level: Game['level']
  notes: string
}

type FieldErrors = Partial<Record<keyof Values, string>>

function dateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function tomorrowAtSeven() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(19, 0, 0, 0)
  return date
}

function valuesFor(game?: Game): Values {
  const startsAt = game?.startsAt ?? tomorrowAtSeven()
  return {
    venueId: game?.venueId ?? 'v1',
    date: dateValue(startsAt),
    time: `${String(startsAt.getHours()).padStart(2, '0')}:${String(startsAt.getMinutes()).padStart(2, '0')}`,
    playersNeeded: String(game?.playersNeeded ?? 10),
    costPerPlayer: String(game?.costPerPlayer ?? 8),
    level: game?.level ?? 'Casual',
    notes: game?.notes ?? '',
  }
}

export default function CreateGame() {
  const { currentUser } = useAuth()
  const { games, venues, createGame, updateGame, signups } = useGames()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const editId = params.get('edit')
  const existingGame = editId ? games.find((game) => game.id === editId) : undefined
  const [values, setValues] = useState(() => valuesFor(existingGame))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [discardPrompt, setDiscardPrompt] = useState(false)

  if (!currentUser) {
    const next = editId ? `/create?edit=${encodeURIComponent(editId)}` : '/create'
    return <Navigate to={`/signin?next=${encodeURIComponent(next)}`} replace />
  }

  const organiserId = currentUser.id

  if (editId && (!existingGame || existingGame.organiserId !== currentUser.id)) {
    return (
      <Layout footerCode="CSC443-F26 · T07 · S05 · rev A">
        <h1 className={pageTitle}>Game not available</h1>
        <p className="mt-4 max-w-prose text-sm text-muted">
          This game could not be found, or you do not organise it.
        </p>
        <Link to="/my-games/organising" className={`${primaryButton} ${sizeNormal} mt-7`}>
          Back to organising
        </Link>
      </Layout>
    )
  }

  const selectedVenue = venues.find((venue) => venue.id === values.venueId)
  const hasChanges = JSON.stringify(values) !== JSON.stringify(valuesFor(existingGame))
  const confirmedCount = existingGame
    ? signups.filter((signup) => signup.gameId === existingGame.id && signup.status === 'confirmed').length
    : 0

  function setValue<Key extends keyof Values>(key: Key, value: Values[Key]) {
    setValues((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!values.venueId) next.venueId = 'Choose a venue.'
    if (!values.date || !values.time) {
      if (!values.date) next.date = 'Choose a date.'
      if (!values.time) next.time = 'Choose a kick-off time.'
    } else if (new Date(`${values.date}T${values.time}`).getTime() <= Date.now()) {
      next.date = 'That time has passed. Choose a future date and time.'
    }

    const players = Number(values.playersNeeded)
    if (!Number.isInteger(players) || players < 1) {
      next.playersNeeded = 'Enter at least one player.'
    } else if (selectedVenue && players > selectedVenue.maxPlayers) {
      next.playersNeeded = `${selectedVenue.name} holds up to ${selectedVenue.maxPlayers} players.`
    } else if (existingGame && players < confirmedCount) {
      next.playersNeeded = `At least ${confirmedCount} players are already confirmed.`
    }

    const cost = Number(values.costPerPlayer)
    if (!values.costPerPlayer.trim()) {
      next.costPerPlayer = 'Enter the cost per player.'
    } else if (!Number.isFinite(cost) || cost < 0) {
      next.costPerPlayer = 'Enter a cost of zero or more.'
    }
    return next
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    const nextErrors = validate()
    setErrors(nextErrors)
    const firstInvalid = (Object.keys(nextErrors) as (keyof Values)[])[0]
    if (firstInvalid) {
      document.getElementById(`game-${firstInvalid}`)?.focus()
      return
    }
    if (!selectedVenue) return

    const details = {
      venueId: selectedVenue.id,
      sport: selectedVenue.sport,
      level: values.level,
      startsAt: new Date(`${values.date}T${values.time}`),
      durationMinutes: existingGame?.durationMinutes ?? 90,
      playersNeeded: Number(values.playersNeeded),
      costPerPlayer: Number(values.costPerPlayer),
      notes: values.notes.trim(),
    }

    if (existingGame) {
      updateGame({ ...existingGame, ...details })
    } else {
      createGame(details, organiserId)
    }
    navigate('/my-games/organising')
  }

  function leaveForm() {
    if (hasChanges) {
      setDiscardPrompt(true)
    } else {
      navigate('/my-games/organising')
    }
  }

  const showError = (key: keyof Values) => (submitted ? errors[key] : undefined)

  return (
    <Layout footerCode="CSC443-F26 · T07 · S05 · rev A">
      <h1 className={pageTitle}>{existingGame ? 'Edit game' : 'Start a game'}</h1>
      <p className="mt-3 max-w-prose text-sm text-muted">
        You have the pitch. Say when, how many you need, and what it costs each.
      </p>

      <form noValidate onSubmit={handleSubmit} className="mt-9 max-w-3xl space-y-7">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="game-venueId" className={fieldLabel}>Venue</label>
            <select
              id="game-venueId"
              value={values.venueId}
              onChange={(event) => {
                const venue = venues.find((item) => item.id === event.target.value)
                setValue('venueId', event.target.value)
                if (venue && Number(values.playersNeeded) > venue.maxPlayers) {
                  setValue('playersNeeded', String(venue.maxPlayers))
                }
              }}
              className={inputValid}
              aria-invalid={showError('venueId') ? true : undefined}
              aria-describedby={showError('venueId') ? 'game-venueId-msg' : 'game-venueId-hint'}
            >
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>{venue.name} · {venue.area}</option>
              ))}
            </select>
            <p
              id={showError('venueId') ? 'game-venueId-msg' : 'game-venueId-hint'}
              className={showError('venueId') ? 'text-xs font-semibold text-red-300' : 'text-xs text-muted'}
            >
              {showError('venueId') ?? (selectedVenue ? `Capacity: ${selectedVenue.maxPlayers} players.` : 'Capacity comes from the venue.')}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="game-sport" className={fieldLabel}>Sport</label>
            <input id="game-sport" value={selectedVenue?.sport ?? 'Choose a venue'} readOnly className={inputValid} />
          </div>

          <Field
            id="game-date"
            label="Date"
            type="date"
            value={values.date}
            onChange={(value) => setValue('date', value)}
            error={showError('date')}
          />
          <Field
            id="game-time"
            label="Kick-off"
            type="time"
            value={values.time}
            onChange={(value) => setValue('time', value)}
            error={showError('time')}
          />
          <Field
            id="game-playersNeeded"
            label="Players needed"
            type="number"
            value={values.playersNeeded}
            onChange={(value) => setValue('playersNeeded', value)}
            error={showError('playersNeeded')}
            hint={selectedVenue ? `Up to ${selectedVenue.maxPlayers} at this venue.` : 'Choose a venue to see its capacity.'}
          />
          <Field
            id="game-costPerPlayer"
            label="Cost a player"
            type="number"
            value={values.costPerPlayer}
            onChange={(value) => setValue('costPerPlayer', value)}
            error={showError('costPerPlayer')}
            hint="The pitch fee split. Settled between you."
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={fieldLabel}>Level</legend>
          <div className="flex flex-wrap gap-2.5">
            {(['Casual', 'Competitive'] as const).map((level) => (
              <button
                key={level}
                type="button"
                aria-pressed={values.level === level}
                onClick={() => setValue('level', level)}
                className={`${values.level === level ? primaryButton : secondaryButton} ${sizeNormal}`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">Say honestly. Mismatched games are why people stop showing up.</p>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="game-notes" className={fieldLabel}>Anything else</label>
          <textarea
            id="game-notes"
            rows={3}
            value={values.notes}
            onChange={(event) => setValue('notes', event.target.value)}
            placeholder="Shirt colours, parking, who brings the ball"
            className={inputValid}
          />
          <p className="text-xs text-muted">Optional.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <button type="submit" className={`${primaryButton} ${sizeNormal}`}>
            {existingGame ? 'Save changes' : 'Put the game up'}
          </button>
          <button type="button" onClick={leaveForm} className={`${secondaryButton} ${sizeNormal}`}>
            Cancel
          </button>
          {Object.values(errors).some(Boolean) && submitted && (
            <span role="alert" className="text-xs font-semibold text-red-300">
              {Object.values(errors).filter(Boolean).length} {Object.values(errors).filter(Boolean).length === 1 ? 'field needs' : 'fields need'} attention
            </span>
          )}
        </div>
      </form>

      {discardPrompt && (
        <ConfirmDialog
          title="Leave without saving?"
          body="Nothing is saved until you post the game. Your changes will be discarded."
          confirmLabel="Discard"
          cancelLabel="Keep editing"
          onConfirm={() => navigate('/my-games/organising')}
          onCancel={() => setDiscardPrompt(false)}
        />
      )}
    </Layout>
  )
}
