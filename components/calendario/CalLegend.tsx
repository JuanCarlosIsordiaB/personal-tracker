interface LegendItem {
  c: string
  label: string
  dot?: boolean
  tripDot?: boolean
  arrivalDot?: boolean
  muted?: boolean
  ring?: string
}

interface CalLegendProps {
  accent?: string
}

export function CalLegend({ accent = '#2A6FDB' }: CalLegendProps) {
  const items = [
    { c: accent, label: 'Cuenta' },
    { c: accent + '12', label: 'En viaje (no cuenta)', tripDot: true },
    { c: '#EFF1F4', label: 'Festivo', dot: true },
    { c: 'transparent', label: 'Domingo', muted: true },
    { c: 'transparent', label: 'Hoy', ring: accent },
    { c: accent, label: 'Llegada / Salida', arrivalDot: true },
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        padding: '2px 2px 4px',
      }}
    >
      {(items as LegendItem[]).map((it, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 7 }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 5,
              background: it.c,
              boxShadow: it.ring ? `0 0 0 2px ${it.ring}` : 'none',
              border: it.muted ? '1px solid #E7EAEF' : 'none',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {it.dot && (
              <span
                style={{ width: 4, height: 4, borderRadius: 99, background: '#949BA6' }}
              />
            )}
            {it.tripDot && (
              <span
                style={{ width: 4, height: 4, borderRadius: 99, background: accent, opacity: 0.6 }}
              />
            )}
            {it.arrivalDot && (
              <span
                style={{
                  position: 'absolute',
                  top: 1,
                  right: 1,
                  width: 5,
                  height: 5,
                  borderRadius: 99,
                  background: '#E0463B',
                  border: '1px solid rgba(255,255,255,0.8)',
                }}
              />
            )}
            {it.muted && (
              <span style={{ fontSize: 9, color: '#949BA6' }}>D</span>
            )}
          </span>
          <span
            style={{ fontSize: 12.5, color: '#59616E', fontWeight: 560 }}
          >
            {it.label}
          </span>
        </div>
      ))}
    </div>
  )
}
