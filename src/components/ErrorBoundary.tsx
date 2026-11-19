import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

// Last-resort screen if a render error escapes a surface. Without this, a
// single bad render would leave the user with a blank page.
type Props = { children: ReactNode }
type State = { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Malaab hit an unexpected error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-card border border-red-500/40 bg-red-500/10 px-6 py-16 text-center">
            <h1 className="font-display text-4xl uppercase leading-none text-red-200">
              Something went wrong
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-sm text-red-200/80">
              The page could not be displayed. Reloading restarts the app with
              fresh Phase 1 mock data.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-400 px-5 py-2.5 text-sm font-semibold text-[#06120C] hover:bg-brand-300"
            >
              Reload Malaab
            </button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
