import type { PropsWithChildren, ReactNode } from 'react'
import { Component } from 'react'

export class ErrorBoundary extends Component<PropsWithChildren<{ fallback: ReactNode }>, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  override componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error)
  }

  override render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

