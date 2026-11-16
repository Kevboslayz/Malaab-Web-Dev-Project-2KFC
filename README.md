# Malaab — Pickup Games (React + Vite + Tailwind CSS)

**Course:** CSC443 Web Programming · Fall 2026 · Section 31
**Institution:** Lebanese American University · Department of Computer Science and Mathematics
**Topic:** 07 — Pickup Games
**Brief reference code:** `CSC443-F26 · T07 · rev A` (from the footer of `topic-07-pickup-games/index.html`; the eight surface pages use `CSC443-F26 · T07 · S01…S08 · rev A`, and the roster reference is `… · C01 · rev A`)

**Team name:** **[TO BE FILLED IN BY THE TEAM]**

## Team

| Full name | Student ID | Role |
| --- | --- | --- |
| Christian Nehman | **[TO BE FILLED IN]** | Surfaces 05–06 (create / organising) |
| Kevin Assi | **[TO BE FILLED IN]** | Surfaces 01–02 (home / browse) |
| Keven Abi Frem | **[TO BE FILLED IN]** | Surfaces 07–08 (playing / auth) |
| Francois Seif | **[TO BE FILLED IN]** | Surfaces 03–04 (game detail / venue) |

> The two columns above that are marked **[TO BE FILLED IN]** are the only
> facts in this document not yet supplied by the team. Do not guess them.

## Live link

**Not deployed yet.** This README will be updated with the live URL once the
build is deployed. The project runs locally with the instructions below, and all
screenshots in this document were captured from the real running application.

## What the project is

Malaab is a Phase 1 web app for organising pickup games: a player sees which
games need people, joins one, and can see exactly where they stand. The
organiser manages the roster and the queue. The design specification is the
`topic-07-pickup-games/` folder in this repository; it was read as a
specification, not copied into the app.

The app is dark on every surface, works down to 390px (including a mobile nav),
makes no network requests, and resets its mock data on reload — all as required
for Phase 1.

## Entities and fields

The data model was settled in `src/data/mockData.ts` and is shared by every
surface. Fields marked *computed* are never stored; they are derived from the
signup list in `src/data/roster.ts`.

### `User`
| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | Stable identifier (`u1`…`u18`, `u<timestamp>` for new accounts) |
| `name` | `string` | Full name shown on rosters |
| `email` | `string` | University address, lowercased; used to sign in |
| `phone` | `string` | Contact number |
| `preferredSports` | `string[]` | Sports the player plays |
| `password` | `string` | Plain text for the Phase 1 mock sign-in only (no server, no hash) |

### `Venue` (reference data — nobody creates, edits or deletes a venue in the app)
| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | `v1`…`v5` |
| `name` | `string` | Venue name |
| `area` | `string` | Neighbourhood |
| `sport` | `'Football' \| 'Basketball' \| 'Padel'` | Main sport |
| `maxPlayers` | `number` | Capacity used by create-game validation |
| `surface` | `string` | e.g. artificial grass |
| `floodlights` | `boolean` | Shown as a "Floodlit" tag |
| `pricePerHour` | `number` | Pitch price per hour |
| `format` | `string` | e.g. `7v7`, `5v5`, `Doubles` |
| `amenities` | `string[]` | Changing rooms, parking, etc. |
| `hours` | `string` | Opening hours |
| `pitches` | `number` | Number of pitches/courts |

### `Game`
| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | `g1`…`g7` or `g<timestamp>` for newly created games |
| `venueId` | `string` | Foreign key to `Venue` |
| `organiserId` | `string` | Foreign key to `User` |
| `sport` | `'Football' \| 'Basketball' \| 'Padel'` | Sport |
| `level` | `'Casual' \| 'Competitive'` | Level |
| `startsAt` | `Date` | Kick-off (seed dates are relative to today) |
| `durationMinutes` | `number` | Length of the game |
| `playersNeeded` | `number` | Spots the organiser asked for |
| `costPerPlayer` | `number` | Cost split |
| `notes` | `string` | Free text (shirt colours, parking, etc.) |
| `status` | `'open' \| 'cancelled' \| 'played'` | Lifecycle state |
| *spots left* | *computed* | `playersNeeded − confirmed signups` (`spotsLeft`) |
| *full* | *computed* | Never stored; derived from spots left |

### `Signup`
| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | Signup identifier |
| `gameId` | `string` | Foreign key to `Game` |
| `playerId` | `string` | Foreign key to `User` |
| `status` | `'confirmed' \| 'waitlisted' \| 'cancelled'` | Roster or queue state |
| `signedUpAt` | `Date` | Arrival time; the queue is sorted by this |
| *queue position* | *computed* | 1-based index in the arrival-ordered waitlist (`queuePosition`); never written into a row |

**House rule (enforced in `src/data/roster.ts` and `src/context/GamesContext.tsx`):**
confirmed signups never exceed `playersNeeded`; once full, players wait in
arrival order and a new join goes to the back of the line; cancelling a
confirmed signup promotes the first player waiting, and everybody else shifts
up automatically because positions are computed, not stored.

## Member → surface → file mapping

| Member | Surface | Route | Source file(s) |
| --- | --- | --- | --- |
| Kevin Assi | 01 Home — pitch, tonight's games, three rules | `/` | `src/pages/Home.tsx` |
| Kevin Assi | 02 Browse — list, filters, four data states | `/games` | `src/pages/Browse.tsx`, `src/components/FilterBar.tsx` |
| Francois Seif | 03 Game detail — viewer variants, roster, queue | `/games/:id` | `src/pages/GameDetail.tsx`, `src/components/Roster.tsx` |
| Francois Seif | 04 Venue — reference data and games at the venue | `/venues/:id` | `src/pages/Venue.tsx` |
| Christian Nehman | 05 Start a game — validation, unsaved-changes guard | `/create` | `src/pages/CreateGame.tsx`, `src/components/Field.tsx` |
| Christian Nehman | 06 Organising — your games and the queue you manage | `/my-games/organising` | `src/pages/Organising.tsx` |
| Keven Abi Frem | 07 Playing — where you stand in other people's games | `/my-games/playing` | `src/pages/Playing.tsx` |
| Keven Abi Frem | 08 Sign in / sign up — both states and a rejected sign-in | `/signin`, `/signup` | `src/pages/Auth.tsx`, `src/context/AuthContext.tsx` |

Shared infrastructure used by all surfaces: `src/App.tsx` (routing),
`src/components/Layout.tsx` (header, mobile nav, footer),
`src/components/GameCard.tsx` (one data-driven card for Home, Browse and Venue),
`src/components/ui.ts` (buttons/badges/input classes), `src/components/ConfirmDialog.tsx`,
`src/context/GamesContext.tsx`, `src/data/mockData.ts`, `src/data/roster.ts`,
`src/utils/format.ts`.

`feat/francois-part` was merged into `main` and is the source of the game
detail, venue and roster components; `feat/03-game` and `feature/playing-auth`
are kept in sync with `main`.

## How the mock data is structured and where it lives

- **`src/data/mockData.ts`** is the single source of seed data: `seedUsers`
  (18 members), `venues` (5), `seedGames` (7), `seedSignups`, plus `DEMO_EMAIL`
  (`demo.player@lau.edu`) and `DEMO_PASSWORD` (`malaab2026`). Game and signup
  dates are computed relative to "today" so "Tonight"/"Tomorrow" stay true.
  Signups are listed in arrival order; the first `playersNeeded` are confirmed
  and the rest are waitlisted, so the house rule holds on the very first render.
- **`src/context/AuthContext.tsx`** holds `users` and `currentUser` in React
  state and exposes `signIn`, `signUp`, `signOut`, `emailTaken`. It also supplies
  the avatar initials used by the roster.
- **`src/context/GamesContext.tsx`** holds `games` and `signups` in React state
  and exposes `createGame`, `updateGame`, `joinGame`, `cancelSignup` and
  `cancelGame`. Because the state is shared, a cancellation on one page is
  immediately visible on every other page.
- **`src/data/roster.ts`** contains the house rule as pure functions
  (`confirmedFor`, `queueFor`, `spotsLeft`, `signupFor`, `queuePosition`,
  `cancelSignup`). Spots and queue positions are computed from the signups,
  never stored.
- No `localStorage`, no API calls and no backend in Phase 1: **a full page
  reload resets everything to the seed data.** This is why the browser testing
  signs in and then navigates inside the app rather than reloading.

### Reaching the built-in states

- `/games?state=loading`, `?state=empty`, `?state=error` — Browse data states.
- `/my-games/playing?state=loading|empty|error` — Playing data states.
- `/games/:id?state=loading|error|empty` — Game detail states.
- Sign out for the signed-out variant; sign in as the organiser of `g5`
  (Christian Nehman) for the owner variant, or as any other user for the
  member variant. `g1` and `g2` start with queues so promotion can be tried.

## How to run locally (from clone to running dev server)

You need **Node.js 22 LTS** (Node 20.19+ also works) and npm 10+, plus Git.
No API keys, database or backend are required.

```powershell
# 1. Clone the repository
git clone https://github.com/Kevboslayz/Malaab-Web-Dev-Project-2KFC.git

# 2. Enter the project folder
cd Malaab-Web-Dev-Project-2KFC

# 3. Install the dependencies
npm install

# 4. Start the Vite dev server
npm run dev
```

Open **http://localhost:5173/** in a browser. Press `Ctrl+C` in the terminal to
stop the server.

Optional commands:

```powershell
npm run build      # TypeScript check + production build into dist/
npx vite preview   # serve the production build locally
```

All branches (`main`, `feat/francois-part`, `feat/03-game`,
`feature/playing-auth`) point at the same working commit, so checking out any
of them gives you the same application.

**Demo sign-in:** `demo.player@lau.edu` / `malaab2026` (a dummy account).
Every seeded user uses the password `malaab2026`.

## Screenshots and recording

All screenshots below were captured from the running app in headless Chrome;
the two mobile shots are at **390px**. Click an image to open it full-size.

| Surface | Screenshot |
| --- | --- |
| 01 Home | [![Home](docs/screenshots/01-home.png "Home")](docs/screenshots/01-home.png) |
| 02 Browse | [![Browse](docs/screenshots/02-browse.png "Browse")](docs/screenshots/02-browse.png) |
| 03 Game detail — signed out | [![Game detail, signed out](docs/screenshots/03-game-signed-out.png "Game detail, signed out")](docs/screenshots/03-game-signed-out.png) |
| 03 Game detail — organiser, roster + queue | [![Game detail, organiser](docs/screenshots/03-game-organiser.png "Game detail, organiser")](docs/screenshots/03-game-organiser.png) |
| 04 Venue | [![Venue](docs/screenshots/04-venue.png "Venue")](docs/screenshots/04-venue.png) |
| 05 Start a game | [![Create game](docs/screenshots/05-create.png "Create game")](docs/screenshots/05-create.png) |
| 06 Organising | [![Organising](docs/screenshots/06-organising.png "Organising")](docs/screenshots/06-organising.png) |
| 07 Playing | [![Playing](docs/screenshots/07-playing.png "Playing")](docs/screenshots/07-playing.png) |
| 08 Sign in | [![Sign in](docs/screenshots/08-signin.png "Sign in")](docs/screenshots/08-signin.png) |
| 390px — Home | [![Home at 390px](docs/screenshots/mobile-home.png "Home at 390px")](docs/screenshots/mobile-home.png) |
| 390px — Game detail | [![Game detail at 390px](docs/screenshots/mobile-game.png "Game detail at 390px")](docs/screenshots/mobile-game.png) |

A short recording can be added here once the team exports one; the screenshots
above cover every surface and the responsive layout.

## Verification performed

- `npm run build` — TypeScript type-check and production build both pass.
- Automated headless-browser run: 23 checks across all eight surfaces,
  including the four data states, the three viewer variants, join/leave/drop
  out, automatic queue promotion, validation, the unsaved-changes guard,
  `?next=` redirects, 390px layout and zero console/page errors.
