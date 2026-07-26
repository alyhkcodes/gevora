'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

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
        onClick={reset}
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