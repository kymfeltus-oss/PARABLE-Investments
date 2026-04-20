'use client';

/**
 * Fallback when the root layout fails (e.g. font/CSS load). Keep minimal — no app CSS tokens assumed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100dvh', background: '#070708', color: '#fff', fontFamily: 'system-ui' }}>
        <div
          style={{
            display: 'flex',
            minHeight: '100dvh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.875rem', opacity: 0.85 }}>Something went wrong. Please try again.</p>
          {process.env.NODE_ENV === 'development' && error.message ? (
            <p style={{ fontSize: '0.75rem', color: '#fca5a5', maxWidth: '32rem', wordBreak: 'break-word' }}>
              {error.message}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: '1px solid rgba(0, 242, 255, 0.4)',
              background: 'rgba(0, 242, 255, 0.1)',
              color: '#00f2ff',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
