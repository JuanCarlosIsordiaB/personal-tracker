'use client'

interface RingVizProps {
  value: number
  max: number
  accent?: string
  size?: number
  stroke?: number
}

export function RingViz({
  value,
  max,
  accent = '#2A6FDB',
  size = 188,
  stroke = 16,
}: RingVizProps) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const frac = Math.min(1, value / max)
  const dash = circ * frac

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E9ECF1"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 46,
            fontWeight: 760,
            color: '#181B21',
            letterSpacing: -1.5,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 15,
            color: '#949BA6',
            fontWeight: 560,
            marginTop: 3,
          }}
        >
          de {max} días
        </div>
      </div>
    </div>
  )
}
