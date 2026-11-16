# Malaab — Topic 07, Pickup Games (React build)

- **Course:** CSC443 Web Programming · Fall 2026 · Section 31
- **Topic:** Topic 07 — Pickup Games (`CSC443-F26 · T07 · rev A`)
- **Phase 1 Reference:** `CSC443-F26 · P1 · rev A`

This project implements the Malaab design pack in **React + Vite + Tailwind CSS**,
following the pack in `topic-07-pickup-games` to the letter.
Update this whenever you finish your part :)

## Assignment (Member-to-Surfaces & Files Table)

| Design Pack | Surface | Route | Implementation Files | Owner |
| --- | --- | --- | --- | --- |
| `01-home.html` | Home — the pitch, tonight's games, the three rules | `/` | `src/pages/Home.tsx`, `src/components/GameCard.tsx` | Kevin Assi ✅ |
| `02-browse.html` | Games — the list with filters and four data states | `/games` | `src/pages/Browse.tsx`, `src/components/FilterBar.tsx` | Kevin Assi ✅ |
| `03-game.html` | Game detail — three viewer variants, the roster, the queue | `/games/:id` | `src/pages/GameDetail.tsx`, `src/components/Roster.tsx` | Francois Seif ✅ |
| `04-venue.html` | Venue — reference data, and the games played there | `/venues/:id` | `src/pages/Venue.tsx` | Francois Seif ✅ |
| `05-create.html` | Start a game — validation and the unsaved-changes guard | `/games/new`, `/games/:id/edit` | *Pending (Member 3)* | ? |
| `06-organising.html` | Organising — your games and the queue you manage | `/my-games/organising` | *Pending (Member 3)* | ? |
| `07-playing.html` | Playing — where you stand in everyone else's games | `/my-games/playing` | `src/pages/Playing.tsx`, `src/components/ConfirmDialog.tsx` | Keven Abi Frem ✅ |
| `08-auth.html` | Sign in and sign up — both states, plus a rejected sign-in | `/signin`, `/signup` | `src/pages/Auth.tsx`, `src/components/Field.tsx` | Keven Abi Frem ✅ |

## Entities and Fields (`src/data/mockData.ts`)

1. **User** — `id`, `name`, `email`, `phone`, `preferredSports`, `password` (plain-text in Phase 1 mock state; replaced by server-side `passwordHash` in Phase 2).
2. **Venue** *(reference data, not user-owned)* — `id`, `name`, `area`, `sport` (`'Football' | 'Basketball' | 'Padel'`), `surface`, `floodlights`, `pricePerHour`.
3. **Game** *(owned by a user, the organiser)* — `id`, `venueId`, `organiserId`, `sport`, `level` (`'Casual' | 'Competitive'`), `startsAt`, `durationMinutes`, `playersNeeded`, `costPerPlayer`, `notes`, `status` (`'open' | 'cancelled' | 'played'`; `'full'` is computed at read time from confirmed signups).
4. **Signup** *(owned by a user, the player)* — `id`, `gameId`, `playerId`, `status` (`'confirmed' | 'waitlisted' | 'cancelled'`), `signedUpAt` (queue position is never stored; it is computed from the arrival-ordered waitlist in `src/data/roster.ts`).

## Where to make your parts

The design pack is in `topic-07-pickup-games`. Your two
surfaces live there — open the matching `.html` file, read the markup, and build
the same thing as a React component here.

Start by opening `index.html`.
The signature component is in `components.html` — build the roster first (`src/components/Roster.tsx`).

## Checklist

- [x] Agree who takes which surfaces **before** writing code
- [x] Record the agreement here in the project README
- [x] Open `index.html` first in the design pack
- [x] Build the roster (signature component from `components.html`) first (`src/components/Roster.tsx`)
- [x] Implement the dark theme as given on **every** surface (or re-skin consistently on all)
- [x] Implement the four data states (loading, empty, error, populated)
- [x] Implement the three viewer variants (owner, another signed-in user, signed out)
- [x] Implement the house rule: confirmed never exceeds needed; full means queue in arrival order; cancellation promotes #1 automatically
- [x] Confirm the layout works at 390px width
- [x] Remove the annotation bands and dark strip notes — they are not interface
- [x] Record who owns each surface in the table above

## Project structure

```
malaab-t07-react
├── index.html                   ← HTML shell (#root + script)
├── tailwind.config.js           ← Dark palette + Anton/Barlow fonts
├── postcss.config.js            ← Tailwind + Autoprefixer
├── package.json                 ← react, react-dom, react-router-dom
└── src/
    ├── main.tsx                 ← Entry: mounts React, imports ./index.css
    ├── App.tsx                  ← Providers + routes
    ├── index.css                ← @import fonts + @tailwind directives
    ├── fonts.css                ← Embedded Anton + Barlow (offline)
    ├── data/
    │   ├── mockData.ts          ← Users, venues, games, signups (Phase 1 mock data)
    │   └── roster.ts            ← The house rule: confirmed/queue/position/join/cancel + promote
    ├── context/
    │   ├── AuthContext.tsx      ← Who is signed in: signIn, signUp, signOut, useAuth()
    │   └── GamesContext.tsx     ← Shared games + signups state: joinGame, cancelSignup, cancelGame
    ├── components/
    │   ├── Layout.tsx           ← Header/nav/footer wrapper (auth-aware)
    │   ├── Roster.tsx           ← Signature roster + ordered queue component (components.html)
    │   ├── GameCard.tsx         ← Shared game card (badge + action)
    │   ├── FilterBar.tsx        ← Browse filter bar
    │   ├── Field.tsx            ← Labelled input with hint/error + aria wiring
    │   ├── ConfirmDialog.tsx    ← Confirm before anything destructive
    │   └── ui.ts                ← Shared Tailwind class strings (buttons, badges, inputs)
    └── pages/
        ├── Home.tsx             ← Surface 01 — / (Kevin Assi)
        ├── Browse.tsx           ← Surface 02 — /games (Kevin Assi)
        ├── GameDetail.tsx       ← Surface 03 — /games/:id (Francois Seif)
        ├── Venue.tsx            ← Surface 04 — /venues/:id (Francois Seif)
        ├── Playing.tsx          ← Surface 07 — /my-games/playing (Keven Abi Frem)
        └── Auth.tsx             ← Surface 08 — /signin and /signup (Keven Abi Frem)
```

## Routes so far

| Route | Surface |
| --- | --- |
| `/` | 01 Home |
| `/games` | 02 Browse |
| `/games/:id` | 03 Game detail (e.g. `/games/g5` for Dekwaneh 8/10 open, `/games/g2` for Jounieh 10/10 + queue) |
| `/venues/:id` | 04 Venue (e.g. `/venues/v1` for Dekwaneh Sports Club) |
| `/signin`, `/signup` | 08 Sign in & sign up (`?next=/some/path` returns you there after) |
| `/my-games` | redirects to `/my-games/playing` |
| `/my-games/playing` | 07 Playing |

## Mock data and accounts

Everything lives in `src/data/mockData.ts` and is held in React state by
`AuthContext` and `GamesContext`, so it resets on reload (no `localStorage`, as the
brief asks). Every seeded user signs in with password `malaab2026`, e.g.:
- `christian.nehman@lau.edu` (organiser of `g5` and `g6` at Dekwaneh Sports Club)
- `francois.seif@lau.edu` (confirmed player in `g1`, `g2`, `g5`; organiser of `g4`)
- `hana.ali@lau.edu` (player in `g3`, `g7`)

Spots left and queue positions are never stored — they are computed in
`src/data/roster.ts` from the signups. Use `useGames()` and the roster helpers
on your surfaces so every page agrees on the house rule.

To see the four data states on **Game detail** (`/games/:id`), **Venue** (`/venues/:id`), or **Playing** (`/my-games/playing`), add `?state=loading`, `?state=empty` or `?state=error` to the URL.

## Run it locally

```powershell
git clone <repository-url>
cd Malaab-Web-Dev-Project-2KFC
npm install
npm run dev
```

Open `http://localhost:5173/`
