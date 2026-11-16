# Malaab — Topic 07, Pickup Games (React build)

This project implements the Malaab design pack in **React + Vite + Tailwind CSS**,
following the pack in `topic-07-pickup-games`. All eight surfaces are built and
wired together.

## Assignment

| File | Surface | Owner |
| --- | --- | --- |
| `01-home.html` | Home — the pitch, tonight's games, the three rules | Kevin Assi ✅ |
| `02-browse.html` | Games — the list with filters and four data states | Kevin Assi ✅ |
| `03-game.html` | Game detail — three viewer variants, the roster, the queue | Francois Seif ✅ |
| `04-venue.html` | Venue — reference data, and the games played there | Francois Seif ✅ |
| `05-create.html` | Start a game — validation and the unsaved-changes guard | Christian Nehman ✅ |
| `06-organising.html` | Organising — your games and the queue you manage | Christian Nehman ✅ |
| `07-playing.html` | Playing — where you stand in everyone else's games | Keven Abi Frem ✅ |
| `08-auth.html` | Sign in and sign up — both states, plus a rejected sign-in | Keven Abi Frem ✅ |

The agreement is recorded here, member by member: Kevin took surfaces 01–02,
Francois took 03–04, Christian took 05–06, and Keven took 07–08. Surfaces 03–04
were completed in the final integration pass along with the shared roster,
routing and data wiring.

## Where the design pack lives

The design pack is in `topic-07-pickup-games`. Your two
surfaces live there — open the matching `.html` file, read the markup, and build
the same thing as a React component here.

Open `index.html` in the design pack first.
The signature component is in `components.html` — the roster was built first.

## Checklist

- [x] Agree who takes which surfaces **before** writing code
- [x] Record the agreement here in the project README
- [x] Open `index.html` first in the design pack
- [x] Build the roster (signature component from `components.html`) first
- [x] Implement the dark theme as given on **every** surface
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
    │   └── roster.ts            ← The house rule: confirmed/queue/position/cancel + promote
    ├── context/
    │   ├── AuthContext.tsx      ← Who is signed in: signIn, signUp, signOut, useAuth()
    │   └── GamesContext.tsx     ← Shared games + signups state, useGames()
    ├── components/
    │   ├── Layout.tsx           ← Header/nav (incl. mobile)/footer wrapper
    │   ├── GameCard.tsx         ← Shared game card, data-driven, with a real action
    │   ├── Roster.tsx           ← The signature component: slots + ordered queue
    │   ├── FilterBar.tsx        ← Controlled browse filter bar
    │   ├── Field.tsx            ← Labelled input with hint/error + aria wiring
    │   ├── ConfirmDialog.tsx    ← Confirm before anything destructive
    │   └── ui.ts                ← Shared Tailwind class strings (buttons, badges, inputs)
    ├── utils/
    │   └── format.ts            ← Shared date/ordinal formatting
    └── pages/
        ├── Home.tsx             ← Surface 01
        ├── Browse.tsx           ← Surface 02
        ├── GameDetail.tsx       ← Surface 03 — /games/:id
        ├── Venue.tsx            ← Surface 04 — /venues/:id
        ├── CreateGame.tsx       ← Surface 05 — /create
        ├── Organising.tsx       ← Surface 06 — /my-games/organising
        ├── Playing.tsx          ← Surface 07 — /my-games/playing
        └── Auth.tsx             ← Surface 08 — /signin and /signup
```

## Routes

| Route | Surface |
| --- | --- |
| `/` | 01 Home |
| `/games` | 02 Browse |
| `/games/:id` | 03 Game detail |
| `/venues/:id` | 04 Venue |
| `/create` | 05 Start or edit a game (`?edit=<id>`) |
| `/signin`, `/signup` | 08 Sign in & sign up (`?next=/some/path` returns you there after) |
| `/my-games` | redirects to `/my-games/playing` |
| `/my-games/organising` | 06 Organising |
| `/my-games/playing` | 07 Playing |

## Mock data and accounts

Everything lives in `src/data/mockData.ts` and is held in React state by
`AuthContext` and `GamesContext`, so it resets on reload (no localStorage, as the
brief asks). Every seeded user signs in with password `malaab2026`, e.g.
`christian.nehman@lau.edu`.

Spots left and queue positions are never stored — they are computed in
`src/data/roster.ts` from the signups, and `Roster.tsx` is the only component
that draws them. Use `useGames()` and the roster helpers on your surfaces so
every page agrees on the house rule. Joining a game adds a `confirmed` signup
while a spot remains and a `waitlisted` signup once full; cancelling a confirmed
signup promotes the first person waiting in the same update.

## Viewing the built-in states

The four data states and the viewer variants are reachable without editing code:

- `?state=loading`, `?state=empty`, `?state=error` on `/games` (Browse) and
  `/my-games/playing` (Playing). `?state=loading` / `?state=error` also work on
  `/games/:id`.
- Sign out to see the **signed-out** variant of a game; sign in as the organiser
  (`christian.nehman@lau.edu` on game `g5`) for the **owner** variant, or as any
  other user for the **another signed-in player** variant.
- Games `g1`, `g2` and `g5` have queues, so the ordered waitlist and automatic
  promotion can be tried straight away.

The app is dark on every surface, uses no network requests, and works down to
390px (there is a mobile nav in the header).

## Run it

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/`.

`npm run build` type-checks and produces a production build in `dist/`.

## Branches

`main` is the integrated, working build. The `feat/03-game` and
`feature/playing-auth` branches are kept in sync with `main` so every branch has
the same fix; no work is lost on them.
