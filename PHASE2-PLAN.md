# Malaab — Phase 2 plan (The Full Stack)

**Team:** 2KFC · **Topic:** 07 Pickup Games · **Due:** Mon 7 Dec 2026, 23:59
**Checkpoint:** Wed 2 Dec 2026, 23:59 — API live on Render, at least one route returning database data, then reply to the Phase 1 submission email with the API link.

## 1. Shape of the solution

| Part | Repo | Host |
| --- | --- | --- |
| Front end (existing React app) | `Kevboslayz/Malaab-Web-Dev-Project-2KFC` | Vercel (already live) + `VITE_API_URL` |
| Back end (new) | `Kevboslayz/Malaab-Web-Dev-Project-2KFC-API` | Render free web service |
| Database | same back end repo connects to it | MongoDB Atlas M0 free cluster |

Both repos have the same four members plus `nagibov` as collaborators.

## 2. Ownership — vertical slices

| Member | Back end (new repo) | Front end |
| --- | --- | --- |
| **Kevin Assi** | Express bootstrap, JSON parsing, request logging, **single error handler**, MongoDB connection, CORS, Render config. `Venue` + `Game` schemas, `GET /api/venues`, `GET /api/games` (list/detail + filters), seed data/script. | Home, Browse, shared `GameCard`, `FilterBar`, public API client, real loading/empty/error states. |
| **Keven Abi Frem** | `User` schema, bcrypt hashing, register/login, JWT, `auth` middleware, `GET/PATCH/DELETE /api/me`. | Auth, Playing, `AuthContext`, authenticated API client (token storage, 401 handling). |
| **Christian Nehman** | Game writes: `POST/PATCH/DELETE /api/games`, ownership middleware that returns **403** when `organiserId` ≠ token user. | Create, Organising: real create/edit/cancel, API validation errors, queue management. |
| **Francois Seif** | `Signup` schema, `POST /api/games/:id/signups`, `DELETE /api/signups/:id`, the **house rule** on the server (capacity, arrival-order queue, automatic promotion of #1), 409 on duplicates. | Game detail, Venue: real roster, join/leave/drop out, promotion toasts, error states. |

## 3. Shared contracts (agree before writing code)

- **IDs:** keep Phase 1 string IDs (`v1`, `g1`, `u1`, …) as Mongo `_id` so existing URLs like `/games/g5` keep working.
- **Error shape:** every failure returns JSON `{ "status": 400, "message": "…", "details": … }` — never HTML or a stack trace.
- **Status codes:** 400 validation, 401 missing/invalid/expired token, 403 not allowed, 404 not found, 409 conflict (duplicate email/signup), 201 created, 200 read/update, 204 optional for delete.
- **Auth:** `Authorization: Bearer <jwt>`. Middleware puts the signed-in user on `req.user`; ownership is checked by loading the record and comparing its owner to `req.user`, never by trusting a client id.
- **Client:** `VITE_API_URL` is the API base; the API allows only `CLIENT_ORIGIN` through CORS.

## 4. API surface to document in the README

- `GET /api/health` — liveness, no auth.
- `POST /api/auth/register` (201), `POST /api/auth/login` (200), `GET/PATCH/DELETE /api/me` (token).
- `GET /api/venues`, `GET /api/venues/:id` — public reference data.
- `GET /api/games` (`q`, `sport`, `level`, `when`), `GET /api/games/:id` — public.
- `POST /api/games` (201, token), `PATCH /api/games/:id`, `DELETE /api/games/:id` (token + organiser → 403 otherwise).
- `GET /api/games/:id/signups` — public.
- `POST /api/games/:id/signups` (201, token, house rule), `DELETE /api/signups/:id` (token; signup owner or game organiser → 403 otherwise; returns who was promoted).

## 5. Timeline

- **20–23 Nov:** API skeleton, Atlas cluster, schemas, auth, seed script, env files.
- **24–28 Nov:** CRUD, ownership, house rule; front-end API clients; each surface begins real calls.
- **29 Nov–2 Dec:** finish wiring, deploy API to Render + seed DB, **checkpoint email**.
- **3–5 Dec:** front end `VITE_API_URL`, fix CORS, full end-to-end browser testing, Phase 2 README (full API docs, schema/relationships, local run for both halves with env var *names* only, updated member-to-files table, honest technical problems section).
- **6–7 Dec:** freeze, wake Render, final email to `n@koein.com` with front end / API / both repos / all full names, CC everyone.

## 6. Rules and risks

- Every member commits their own work from their own GitHub account; `git config user.email` must match GitHub. Never commit a teammate's work or push everyone's work from one laptop.
- Plain-text passwords in the database = automatic failure. bcrypt + JWT, secrets in Render/Atlas dashboards, never in git.
- Render free services sleep after ~15 min and take ~1 min to wake. Do not use Render free PostgreSQL.
- CORS will fail on the first cross-origin call — configure `CLIENT_ORIGIN` explicitly.
- The house rule is enforced by the API, not just hidden buttons; the examiner will try user A modifying user B's record and expect **403**.
- Optional bonus: make the last-seat race safe with an atomic Mongo update.

## 7. Individual examination preparation

Each member must be able to trace one flow end to end — component → state → fetch → route → middleware → authorisation → database query → response → re-render — and make a live five-minute change on code they own. Keep your commits under your own name.
