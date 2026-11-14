// Mock data for Phase 1. It lives in React state (see the contexts) and is
// lost on reload — that is expected. Phase 2 replaces this with the API.

export type User = {
  id: string
  name: string
  email: string
  phone: string
  preferredSports: string[]
  // Phase 1 only: plain text so the mock sign-in can compare it.
  // Phase 2 stores a password hash on the server, never this.
  password: string
}

export type Venue = {
  id: string
  name: string
  area: string
  sport: 'Football' | 'Basketball' | 'Padel'
  surface: string
  floodlights: boolean
  pricePerHour: number
}

// "full" is not stored: it is computed from the confirmed signups.
export type GameStatus = 'open' | 'cancelled' | 'played'

export type Game = {
  id: string
  venueId: string
  organiserId: string
  sport: 'Football' | 'Basketball' | 'Padel'
  level: 'Casual' | 'Competitive'
  startsAt: Date
  durationMinutes: number
  playersNeeded: number
  costPerPlayer: number
  notes: string
  status: GameStatus
}

// A queue position is never stored: it is the index in the ordered waitlist.
export type Signup = {
  id: string
  gameId: string
  playerId: string
  status: 'confirmed' | 'waitlisted' | 'cancelled'
  signedUpAt: Date
}

export const DEMO_PASSWORD = 'malaab2026'

function person(id: string, name: string, sports: string[], phone: string): User {
  const email = name.toLowerCase().replace(/\s+/g, '.') + '@lau.edu'
  return { id, name, email, phone, preferredSports: sports, password: DEMO_PASSWORD }
}

export const seedUsers: User[] = [
  person('u1', 'Christian Nehman', ['Football', 'Padel'], '+961 70 112 340'),
  person('u2', 'Kevin Assi', ['Football', 'Basketball'], '+961 71 220 418'),
  person('u3', 'Keven Abi Frem', ['Football'], '+961 76 381 905'),
  person('u4', 'Francois Seif', ['Football', 'Basketball'], '+961 03 447 120'),
  person('u5', 'Maya Saad', ['Football'], '+961 70 903 551'),
  person('u6', 'Bilal Itani', ['Football', 'Basketball'], '+961 71 665 027'),
  person('u7', 'William Chamoun', ['Basketball'], '+961 81 210 774'),
  person('u8', 'Georges Fares', ['Football'], '+961 76 054 382'),
  person('u9', 'Elie Khoury', ['Football', 'Padel'], '+961 70 731 609'),
  person('u10', 'Nour Barakat', ['Basketball', 'Padel'], '+961 03 812 436'),
  person('u11', 'Marc Hebbo', ['Football'], '+961 71 349 288'),
  person('u12', 'Andrew Wehbe', ['Football', 'Basketball'], '+961 81 477 913'),
  person('u13', 'Hana Ali', ['Padel', 'Football'], '+961 76 590 142'),
  person('u14', 'Owen Nammour', ['Football'], '+961 70 268 735'),
  person('u15', 'Lea Mansour', ['Padel'], '+961 71 935 604'),
  person('u16', 'Rami Haddad', ['Football', 'Padel'], '+961 03 126 859'),
  person('u17', 'Joe Saliba', ['Basketball'], '+961 76 708 213'),
  person('u18', 'Tony Karam', ['Football', 'Padel'], '+961 81 359 670'),
]

export const venues: Venue[] = [
  { id: 'v1', name: 'Dekwaneh Sports Club', area: 'Dekwaneh', sport: 'Football', surface: 'Artificial grass', floodlights: true, pricePerHour: 60 },
  { id: 'v2', name: 'Hoops Achrafieh', area: 'Achrafieh', sport: 'Basketball', surface: 'Indoor hardwood', floodlights: true, pricePerHour: 50 },
  { id: 'v3', name: 'Jounieh Five-a-side', area: 'Jounieh', sport: 'Football', surface: 'Artificial grass', floodlights: true, pricePerHour: 70 },
  { id: 'v4', name: 'Padel Point Zalka', area: 'Zalka', sport: 'Padel', surface: 'Glass court', floodlights: true, pricePerHour: 40 },
  { id: 'v5', name: 'Bourj Hammoud Pitch', area: 'Bourj Hammoud', sport: 'Football', surface: 'Artificial grass', floodlights: true, pricePerHour: 55 },
]

// Dates are relative to today so "Tonight" and "Tomorrow" stay true.
function at(dayOffset: number, hours: number, minutes = 0): Date {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hours, minutes, 0, 0)
  return d
}

export const seedGames: Game[] = [
  { id: 'g1', venueId: 'v2', organiserId: 'u2', sport: 'Basketball', level: 'Competitive', startsAt: at(0, 20, 30), durationMinutes: 90, playersNeeded: 10, costPerPlayer: 6, notes: 'Full court. Bring a light and a dark shirt.', status: 'open' },
  { id: 'g2', venueId: 'v3', organiserId: 'u3', sport: 'Football', level: 'Casual', startsAt: at(1, 18), durationMinutes: 60, playersNeeded: 10, costPerPlayer: 12, notes: 'Five-a-side. Parking behind the pitch.', status: 'open' },
  { id: 'g3', venueId: 'v4', organiserId: 'u1', sport: 'Padel', level: 'Casual', startsAt: at(-4, 21), durationMinutes: 90, playersNeeded: 4, costPerPlayer: 15, notes: 'Rackets available at the desk.', status: 'played' },
  { id: 'g4', venueId: 'v5', organiserId: 'u4', sport: 'Football', level: 'Competitive', startsAt: at(3, 22), durationMinutes: 90, playersNeeded: 10, costPerPlayer: 7, notes: 'Late kick-off, pitch is free from 22:00.', status: 'cancelled' },
  { id: 'g5', venueId: 'v1', organiserId: 'u1', sport: 'Football', level: 'Casual', startsAt: at(0, 19), durationMinutes: 90, playersNeeded: 10, costPerPlayer: 8, notes: 'Dark shirts. I bring the ball.', status: 'open' },
  { id: 'g6', venueId: 'v1', organiserId: 'u1', sport: 'Football', level: 'Casual', startsAt: at(2, 10), durationMinutes: 90, playersNeeded: 10, costPerPlayer: 8, notes: 'Morning game, all levels welcome.', status: 'open' },
  { id: 'g7', venueId: 'v4', organiserId: 'u15', sport: 'Padel', level: 'Casual', startsAt: at(1, 21), durationMinutes: 90, playersNeeded: 4, costPerPlayer: 15, notes: 'Doubles, we rotate partners.', status: 'open' },
]

// Players are listed in the order they signed up. The first `needed` are
// confirmed and everyone after them is waitlisted — the house rule holds
// from the very first render.
function signupsFor(game: Game, playerIds: string[]): Signup[] {
  const hour = 60 * 60 * 1000
  return playerIds.map((playerId, i) => ({
    id: `${game.id}-s${i + 1}`,
    gameId: game.id,
    playerId,
    status: i < game.playersNeeded ? 'confirmed' : 'waitlisted',
    signedUpAt: new Date(game.startsAt.getTime() - (playerIds.length - i) * 3 * hour),
  }))
}

const byId = (id: string) => seedGames.find((g) => g.id === id)!

export const seedSignups: Signup[] = [
  ...signupsFor(byId('g1'), ['u2', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u1', 'u16', 'u11', 'u17']),
  ...signupsFor(byId('g2'), ['u3', 'u2', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u18', 'u11', 'u12', 'u1', 'u14']),
  ...signupsFor(byId('g3'), ['u1', 'u15', 'u13', 'u16']),
  ...signupsFor(byId('g4'), ['u4', 'u1', 'u6', 'u8', 'u11', 'u12', 'u14', 'u18', 'u3']),
  ...signupsFor(byId('g5'), ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8']),
  ...signupsFor(byId('g6'), ['u1', 'u12', 'u14', 'u15']),
  ...signupsFor(byId('g7'), ['u15', 'u13', 'u18']),
]
