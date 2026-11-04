import { NavLink } from 'react-router-dom'

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
            <a href="#" className={inactiveClasses}>
              Start a game
            </a>
            <a href="#" className={inactiveClasses}>
              My games
            </a>
          </nav>
          <span className="flex-1"></span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/25 text-xs font-bold text-brand-200 ring-1 ring-brand-500/40">
            CN
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <footer className="mx-auto mt-20 max-w-6xl border-t border-line px-4 py-8 text-xs text-muted">
        <span className="font-display font-bold tracking-wide">MALAAB</span>
        &middot; CSC443 Web Programming &middot; Fall 2026 &middot; design reference
        &middot;
        <span className="font-mono">
          {footerCode ?? 'CSC443-F26 &middot; T07 &middot; rev A'}
        </span>
      </footer>
    </>
  )
}
