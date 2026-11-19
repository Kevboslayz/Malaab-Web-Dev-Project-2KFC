import { STATUS, type StatusCode } from '../data/status'

// Purely presentational — no hooks, no router, no context — so it is safe to
// render from the app-wide error boundary even if a provider itself failed.
// Plain anchors (not <Link>) keep it working outside the Router too.
export default function StatusScreen({ code }: { code: StatusCode }) {
  const info = STATUS[code]
  const tone =
    code >= 500
      ? 'border-red-500/40 bg-red-500/10 text-red-200'
      : code === 404
        ? 'border-line bg-surface text-ink'
        : 'border-accent-300/40 bg-accent-300/5 text-ink'

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink antialiased">
      <header className="border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-3.5">
          <a href="/" className="font-display text-2xl uppercase tracking-wide text-ink">
            Malaab
          </a>
          <span className="h-2 w-2 rounded-full bg-accent-300"></span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16">
        <div className={`w-full rounded-card border px-6 py-16 text-center ${tone}`}>
          <p className="font-display text-7xl uppercase leading-none tracking-wide text-accent-300">
            {code}
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {info.label}
          </p>
          <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-[0.01em] sm:text-5xl">
            {info.title}
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">{info.body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="/games"
              className="inline-flex items-center justify-center rounded-full bg-brand-400 px-5 py-2.5 text-sm font-semibold text-[#06120C] transition hover:bg-brand-300"
            >
              Browse games
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-500"
            >
              Back home
            </a>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl border-t border-line px-4 py-8 text-xs text-muted">
        <span className="font-display font-bold tracking-wide">MALAAB</span>
        {' · '}CSC443 Web Programming · Fall 2026 ·{' '}
        <span className="font-mono">CSC443-F26 · T07 · rev A</span>
      </footer>
    </div>
  )
}
