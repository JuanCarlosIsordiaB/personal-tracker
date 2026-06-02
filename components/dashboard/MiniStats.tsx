import { Card } from '@/components/ui/Card'
import { money } from '@/lib/domain/calculos'

interface MiniStatsProps {
  cumplidos: number
  meta: number
  nViajes: number
  costoPorDia: number | null
}

export function MiniStats({
  cumplidos,
  meta,
  nViajes,
  costoPorDia,
}: MiniStatsProps) {
  const items = [
    {
      label: 'Costo por día',
      value: costoPorDia != null ? money(costoPorDia) : '—',
      sub: 'gasto ÷ días',
    },
    {
      label: 'Días cumplidos',
      value: `${cumplidos} / ${meta}`,
      sub: `${nViajes} viaje${nViajes !== 1 ? 's' : ''}`,
    },
  ]

  return (
    <div className="grid-2col">
      {items.map((it, i) => (
        <Card key={i} pad={16}>
          <div
            style={{
              fontSize: 12.5,
              color: '#949BA6',
              fontWeight: 600,
              letterSpacing: 0.1,
            }}
          >
            {it.label}
          </div>
          <div
            style={{
              fontSize: 23,
              fontWeight: 760,
              color: '#181B21',
              letterSpacing: -0.6,
              marginTop: 6,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {it.value}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#949BA6',
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {it.sub}
          </div>
        </Card>
      ))}
    </div>
  )
}
