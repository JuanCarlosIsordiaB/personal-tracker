interface BarVizProps {
  value: number
  max: number
  accent?: string
}

export function BarViz({ value, max, accent = '#2A6FDB' }: BarVizProps) {
  const weeks = 6
  const perWeek = max / weeks

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 760,
            color: '#181B21',
            letterSpacing: -1.5,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
          <span
            style={{ fontSize: 22, color: '#949BA6', fontWeight: 600 }}
          >
            {' '}/ {max}
          </span>
        </div>
        <div
          style={{ fontSize: 14, color: '#949BA6', fontWeight: 560 }}
        >
          {Math.round((value / max) * 100)}% de la meta
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {Array.from({ length: weeks }).map((_, w) => {
          const start = w * perWeek
          const fill = Math.max(0, Math.min(perWeek, value - start)) / perWeek
          return (
            <div key={w} style={{ flex: 1 }}>
              <div
                style={{
                  height: 14,
                  borderRadius: 7,
                  background: '#E9ECF1',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${fill * 100}%`,
                    background: accent,
                    borderRadius: 7,
                    transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: '#949BA6',
                  textAlign: 'center',
                  marginTop: 6,
                }}
              >
                Sem {w + 1}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
