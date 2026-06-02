import React from 'react'

export type Nivel = 'verde' | 'amarillo' | 'rojo'

const NIV = {
  verde: { fg: '#138A4E', bg: '#E6F4EC', dot: '#1FA862' },
  amarillo: { fg: '#B07A00', bg: '#FBF1D8', dot: '#E0A000' },
  rojo: { fg: '#C5392F', bg: '#FBE8E6', dot: '#E0463B' },
}

interface PillProps {
  children: React.ReactNode
  level?: Nivel
  style?: React.CSSProperties
}

export function Pill({ children, level, style }: PillProps) {
  const n = level ? NIV[level] : { fg: '#59616E', bg: '#E9ECF1', dot: '#949BA6' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: n.bg,
        color: n.fg,
        borderRadius: 999,
        padding: '4px 11px',
        fontSize: 12.5,
        fontWeight: 680,
        letterSpacing: -0.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {level && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: n.dot,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}

export { NIV }
