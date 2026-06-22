'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { RingViz } from './RingViz'
import { WeeksViz } from './WeeksViz'
import { BarViz } from './BarViz'
import type { Nivel } from '@/components/ui/Pill'

interface DayProgressCardProps {
  cumplidos: number
  meta: number
  nivel: Nivel
  accent?: string
}

const VIZ_OPTIONS = [
  { value: 'anillo', label: 'Anillo' },
  { value: 'semanas', label: 'Semanas' },
  { value: 'barra', label: 'Barra' },
]

export function DayProgressCard({
  cumplidos,
  meta,
  nivel,
  accent = '#2A6FDB',
}: DayProgressCardProps) {
  const [viz, setViz] = useState('anillo')

  return (
    <Card pad={18}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 720,
              color: '#181B21',
              letterSpacing: -0.3,
            }}
          >
            Días en oficina
          </div>
          <div
            style={{
              fontSize: 13,
              color: '#949BA6',
              marginTop: 1,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Lun–Vie · {meta} días
          </div>
        </div>
        <Pill level={nivel}>
          {Math.round((cumplidos / meta) * 100)}%
        </Pill>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SegmentedControl
          options={VIZ_OPTIONS}
          value={viz}
          onChange={setViz}
          accent={accent}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: viz === 'anillo' ? 188 : 'auto',
          alignItems: 'center',
          padding: viz === 'anillo' ? '4px 0' : '4px 2px',
        }}
      >
        {viz === 'anillo' && (
          <RingViz value={cumplidos} max={meta} accent={accent} />
        )}
        {viz === 'semanas' && (
          <WeeksViz value={cumplidos} accent={accent} />
        )}
        {viz === 'barra' && (
          <BarViz value={cumplidos} max={meta} accent={accent} />
        )}
      </div>
    </Card>
  )
}
