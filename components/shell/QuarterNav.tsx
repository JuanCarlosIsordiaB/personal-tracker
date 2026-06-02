'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { generateQuarters } from '@/lib/domain/quarters'

// Generate FY25 → FY29 (past + future)
const ALL_QUARTERS = generateQuarters(25, 29)

interface QuarterNavProps {
  currentId: string
  isFuture?: boolean
}

const ACCENT = '#2A6FDB'
const FUTURE_ACCENT = '#7C3AED'

export function QuarterNav({ currentId, isFuture }: QuarterNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const idx = ALL_QUARTERS.findIndex((q) => q.id === currentId)
  const prev = idx > 0 ? ALL_QUARTERS[idx - 1] : null
  const next = idx < ALL_QUARTERS.length - 1 ? ALL_QUARTERS[idx + 1] : null

  const go = (id: string) => router.push(`${pathname}?quarter=${id}`)

  const color = isFuture ? FUTURE_ACCENT : ACCENT

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: isFuture ? FUTURE_ACCENT + '0E' : '#FFFFFF',
        border: `1px solid ${isFuture ? FUTURE_ACCENT + '30' : '#EEF1F5'}`,
        borderRadius: 14,
        padding: '4px 6px',
      }}
    >
      <button
        onClick={() => prev && go(prev.id)}
        disabled={!prev}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: prev ? 'pointer' : 'default',
          padding: '4px 6px',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          opacity: prev ? 1 : 0.25,
        }}
      >
        <Icon name="chevL" size={16} color={color} stroke={2} />
      </button>

      <span
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: color,
          letterSpacing: -0.1,
          minWidth: 76,
          textAlign: 'center',
        }}
      >
        {currentId.replace('-', ' · ')}
      </span>

      <button
        onClick={() => next && go(next.id)}
        disabled={!next}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: next ? 'pointer' : 'default',
          padding: '4px 6px',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          opacity: next ? 1 : 0.25,
        }}
      >
        <Icon name="chevR" size={16} color={color} stroke={2} />
      </button>
    </div>
  )
}
