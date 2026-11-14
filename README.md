# Malaab — Topic 07, Pickup Games (React build)

This project implements the Malaab design pack in **React + Vite + Tailwind CSS**,
following the pack in `topic-07-pickup-games` to the letter.
Update this whenever you finish your part :)

## Assignment

| File | Surface | Owner |
| --- | --- | --- |
| `01-home.html` | Home — the pitch, tonight's games, the three rules | Kevin Assi ✅ |
| `02-browse.html` | Games — the list with filters and four data states | Kevin Assi ✅ |
| `03-game.html` | Game detail — three viewer variants, the roster, the queue | ? |
| `04-venue.html` | Venue — reference data, and the games played there | ? |
| `05-create.html` | Start a game — validation and the unsaved-changes guard | ? |
| `06-organising.html` | Organising — your games and the queue you manage | ? |
| `07-playing.html` | Playing — where you stand in everyone else's games | ? |
| `08-auth.html` | Sign in and sign up — both states, plus a rejected sign-in | ? |

## Where to make your parts

The design pack is in `topic-07-pickup-games`. Your two
surfaces live there — open the matching `.html` file, read the markup, and build
the same thing as a React component here.

Start by opening `index.html`.
The signature component is in `components.html` — build the roster first.

## Checklist

- [ ] Agree who takes which surfaces **before** writing code
- [ ] Record the agreement here in the project README
- [ ] Open `index.html` first in the design pack
- [ ] Build the roster (signature component from `components.html`) first
- [ ] Implement the dark theme as given on **every** surface (or re-skin consistently on all)
- [ ] Implement the four data states (loading, empty, error, populated)
- [ ] Implement the three viewer variants (owner, another signed-in user, signed out)
- [ ] Implement the house rule: confirmed never exceeds needed; full means queue in arrival order; cancellation promotes #1 automatically
- [ ] Confirm the layout works at 390px width
- [ ] Remove the annotation bands and dark strip notes — they are not interface
- [ ] Record who owns each surface in the table above

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
    │   ├── Layout.tsx           ← Header/nav/footer wrapper (auth-aware)
    │   ├── GameCard.tsx         ← Shared game card (badge + action)
    │   ├── FilterBar.tsx        ← Browse filter bar
    │   ├── Field.tsx            ← Labelled input with hint/error + aria wiring
    │   ├── ConfirmDialog.tsx    ← Confirm before anything destructive
    │   └── ui.ts                ← Shared Tailwind class strings (buttons, badges, inputs)
    └── pages/
        ├── Home.tsx             ← Surface 01 (Kevin)
        ├── Browse.tsx           ← Surface 02 (Kevin)
        ├── Playing.tsx          ← Surface 07 — /my-games/playing
        └── Auth.tsx             ← Surface 08 — /signin and /signup
```

## Routes so far

| Route | Surface |
| --- | --- |
| `/` | 01 Home |
| `/games` | 02 Browse |
| `/signin`, `/signup` | 08 Sign in & sign up (`?next=/some/path` returns you there after) |
| `/my-games` | redirects to `/my-games/playing` |
| `/my-games/playing` | 07 Playing |

## Mock data and accounts

Everything lives in `src/data/mockData.ts` and is held in React state by
`AuthContext` and `GamesContext`, so it resets on reload (no localStorage, as the
brief asks). Every seeded user signs in with password `malaab2026`, e.g.
`christian.nehman@lau.edu`.

Spots left and queue positions are never stored — they are computed in
`src/data/roster.ts` from the signups. Use `useGames()` and the roster helpers
on your surfaces so every page agrees on the house rule.

To see the four data states on Playing, add `?state=loading`, `?state=empty` or
`?state=error` to the URL.

## Run it

```powershell
npm run dev
```

Open `http://localhost:5173/`
