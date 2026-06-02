'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'

interface Quarter {
  id: string
  fecha_inicio: string
  fecha_fin: string
}

interface QuarterSelectorProps {
  quarters: Quarter[]
  currentId: string
}

export function QuarterSelector({
  quarters,
  currentId,
}: QuarterSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href)
    url.searchParams.set('quarter', e.target.value)
    router.push(`${pathname}?quarter=${e.target.value}`)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select
        value={currentId}
        onChange={handleChange}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          background: '#FFFFFF',
          border: '1px solid #E7EAEF',
          borderRadius: 12,
          padding: '8px 36px 8px 12px',
          fontSize: 13.5,
          fontWeight: 600,
          fontFamily: 'inherit',
          color: '#181B21',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {quarters.map((q) => (
          <option key={q.id} value={q.id}>
            {q.id.replace('-', ' · ')}
          </option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: 10, pointerEvents: 'none' }}>
        <Icon name="chevD" size={14} color="#949BA6" />
      </span>
    </div>
  )
}
