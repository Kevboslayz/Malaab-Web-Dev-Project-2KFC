const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth']

export const ordinal = (n: number) => ORDINALS[n - 1] ?? `#${n}`

// "Tonight 19:00", "Tomorrow 18:00", "Saturday 10:00", "12 Oct 19:00"
export function formatWhen(date: Date) {
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
  if (diff < -1 && diff > -7) return `Last ${WEEKDAYS[date.getDay()]} ${time}`
  return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${time}`
}

export function isToday(date: Date) {
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function hasFinished(game: { status: string; startsAt: Date; durationMinutes: number }) {
  return (
    game.status === 'played' ||
    game.startsAt.getTime() + game.durationMinutes * 60_000 < Date.now()
  )
}
