'use client'

interface Option {
  value: string
  label: string
}

interface SegmentedControlProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  accent?: string
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    <div
      style={{
        display: 'flex',
        background: '#E9ECF1',
        borderRadius: 13,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              borderRadius: 10,
              padding: '8px 6px',
              fontSize: 13.5,
              fontWeight: 600,
              fontFamily: 'inherit',
              letterSpacing: -0.1,
              background: on ? '#FFFFFF' : 'transparent',
              color: on ? '#181B21' : '#59616E',
              boxShadow: on ? '0 1px 3px rgba(20,28,45,0.12)' : 'none',
              transition: 'all .18s',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
