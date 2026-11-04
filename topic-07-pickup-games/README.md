# Malaab — Topic 07, Pickup Games · design pack

**Christian Nehman · Kevin Assi · Keven Abi Frem · Francois Seif**

Open `index.html` first.

## What this is

The eight surfaces your team implements for Phase 1, as static HTML and Tailwind CSS.
This is a specification, not a starting codebase: you do not copy these files into your
project. You read them, and you build the same thing in React.

The class names are real Tailwind classes, so when you rebuild a screen as a component
they carry across unchanged. That is why you were given HTML rather than a picture.

Everything works offline — the fonts are embedded in `styles.css`, nothing is fetched.

## Your eight surfaces

Two for each of you. Agree who takes which **before** you write any code, and record it in
your project README. That table is what your individual examination is built from.

| File | Surface |
|---|---|
| `01-home.html` | Home — the pitch, tonight's games, the three rules |
| `02-browse.html` | Games — the list with filters and four data states |
| `03-game.html` | Game detail — three viewer variants, the roster, the queue |
| `04-venue.html` | Venue — reference data, and the games played there |
| `05-create.html` | Start a game — validation and the unsaved-changes guard |
| `06-organising.html` | Organising — your games and the queue you manage |
| `07-playing.html` | Playing — where you stand in everyone else's games |
| `08-auth.html` | Sign in and sign up — both states, plus a rejected sign-in |

Two more files that are not surfaces: `components.html` (your signature component in every
state) and `index.html` (the hub).

## Build the roster first

Six of your eight surfaces contain it, and it is the only place your house rule is
visible: confirmed players never exceed the number needed; once full, people queue in
arrival order; a cancellation promotes number one automatically and everybody shifts up.

Spots remaining is computed from confirmed signups, never stored. A queue position is an
index in an ordered list, never a number you write into a row.

**This pack is dark on purpose** — the game is at night, under lights. A light re-skin is
allowed, but then every surface goes light and the contrast has to hold just as well.
Half-dark is the one outcome that will cost you marks.

In Phase 1 the rule lives in the interface. In Phase 2 it moves to your API, because the
interface can be bypassed and the API cannot.

## What is fixed, what is yours

**Fixed** — the eight surfaces, the four data states (loading, empty, error, populated),
the three viewer variants (owner, another signed-in user, signed out), and the house rule.
Every one is marked in the files. These carry the marks.

**A direction, not a cage** — Malaab is a complete identity: name, palette, type, and its
own visual language. Implement it as given and you will do well. If your team would rather
take it somewhere else you may re-skin it, but the new skin has to be applied just as
consistently, on every surface, and expect to be asked why you changed it.

**Yours regardless** — component boundaries, props, where state lives, routing. The design
says nothing about any of that, and it is where most of the marks are.

## Reading the files

- The dark strip at the top of each page and every grey annotation band are notes to you.
  They are not interface and they do not go into your application.
- HTML comments in the markup explain anything non-obvious.
- Values that come from data use inline styles rather than utility classes. That is
  deliberate — you will compute them the same way in React.
- Resize the window. Everything here works at 390px and so must yours.

`CSC443-F26 · T07 · rev A`
