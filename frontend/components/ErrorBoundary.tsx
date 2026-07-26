'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FAF7EE',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C0392B', marginBottom: 12 }}>
            Something went wrong
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 28, color: '#2C2820', marginBottom: 12 }}>
            This page hit an unexpected error
          </h1>
          <p style={{ fontSize: 14, color: '#7A7060', marginBottom: 24, maxWidth: 420 }}>
            Please try again. If the problem continues, refresh the page or come back later.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#2C2820',
              color: '#FAF7EE',
              border: 'none',
              borderRadius: 10,
              padding: '10px 22px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}