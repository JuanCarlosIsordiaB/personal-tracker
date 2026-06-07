'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 16,
        padding: 32,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 32 }}>⚠️</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#181B21', margin: 0 }}>
        Algo salió mal
      </h2>
      <p style={{ fontSize: 14, color: '#59616E', margin: 0, maxWidth: 320 }}>
        No se pudo cargar esta sección. Revisa tu conexión e intenta de nuevo.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: 8,
          padding: '10px 24px',
          background: '#2A6FDB',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Reintentar
      </button>
    </div>
  )
}
