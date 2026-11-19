import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import StatusScreen from './StatusScreen'
import { statusFromError } from '../data/status'

// Last-resort screen for unexpected render errors. It picks the matching
// status screen (401/403/404/500/503...) from the error, so every failure
// shows the right code instead of a blank page.
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
      return <StatusScreen code={statusFromError(this.state.error)} />
    }
    return this.props.children
  }
}
