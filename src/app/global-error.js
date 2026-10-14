"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: '60px 24px',
        backgroundColor: '#ffffff',
        color: '#111111',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        <div style={{ maxWidth: '440px', textAlign: 'center' }}>
          <span style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#d32f2f',
            marginBottom: '12px'
          }}>CRITICAL ERROR</span>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            margin: '0 0 16px'
          }}>System Failure</h1>
          <p style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#666666',
            margin: '0 0 28px'
          }}>
            A critical system issue occurred while loading Throve. Please refresh or retry.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '14px 32px',
              backgroundColor: '#111111',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
