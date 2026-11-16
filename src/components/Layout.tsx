import { Link, NavLink, useNavigate } from 'react-router-dom'
import { initials, useAuth } from '../context/AuthContext'

export default function Layout({
  children,
  footerCode,
}: {
  children: React.ReactNode
  footerCode?: string
}) {
  const activeClasses =
    'rounded-full px-3.5 py-2 text-sm font-semibold bg-brand-400 text-[#06120C]'
  const inactiveClasses =
    'rounded-full px-3.5 py-2 text-sm font-semibold text-muted hover:bg-surface hover:text-ink'

  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    navigate('/')
    signOut()
  }

  return (
    <>
      <header className="border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5">
          <NavLink to="/" className="flex items-baseline gap-2.5">
            <span className="font-display text-2xl uppercase tracking-wide text-ink">
              Malaab
            </span>
            <span className="hidden h-2 w-2 rounded-full bg-accent-300 sm:inline-block"></span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-muted sm:inline">
              The game is two short
            </span>
          </NavLink>
          <nav className="ml-4 hidden gap-1.5 md:flex">
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? activeClasses : inactiveClasses
              }
            >
              Games
            </NavLink>
            <Link to="/create" className={inactiveClasses}>
              Start a game
            </Link>
            <NavLink
              to="/my-games"
              className={({ isActive }) =>
                isActive ? activeClasses : inactiveClasses
              }
            >
              My games
            </NavLink>
          </nav>
          <span className="flex-1"></span>
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted hover:bg-surface hover:text-ink"
              >
                Sign out
              </button>
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/25 text-xs font-bold text-brand-200 ring-1 ring-brand-500/40"
                title={currentUser.name}
                aria-label={`Signed in as ${currentUser.name}`}
              >
                {initials(currentUser.name)}
              </span>
            </>
          ) : (
            <NavLink
              to="/signin"
              className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-brand-500"
            >
              Sign in
            </NavLink>
          )}
        </div>
        <nav className="flex gap-1.5 border-t border-line px-4 py-2 md:hidden" aria-label="Main navigation">
          <NavLink to="/games" className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}>
            Games
          </NavLink>
          <Link to="/create" className={inactiveClasses}>
            Start a game
          </Link>
          <NavLink to="/my-games" className={({ isActive }) => (isActive ? activeClasses : inactiveClasses)}>
            My games
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <footer className="mx-auto mt-20 max-w-6xl border-t border-line px-4 py-8 text-xs text-muted">
        <span className="font-display font-bold tracking-wide">MALAAB</span>
        &middot; CSC443 Web Programming &middot; Fall 2026 &middot; design reference
        &middot;
        <span className="font-mono">
          {footerCode ?? 'CSC443-F26 · T07 · rev A'}
        </span>
      </footer>
    </>
  )
}
