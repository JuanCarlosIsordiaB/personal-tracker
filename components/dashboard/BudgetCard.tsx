import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Pill, NIV } from '@/components/ui/Pill'
import { Icon } from '@/components/ui/Icon'
import { money } from '@/lib/domain/calculos'
import type { Nivel } from '@/components/ui/Pill'

interface BudgetCardProps {
  gastado: number
  proyeccion: number | null
  limite: number | null
  nivel: Nivel
}

const MSGS: Record<Nivel, string> = {
  verde: 'Dentro de presupuesto.',
  amarillo: 'Cerca del límite.',
  rojo: 'Te pasas del límite.',
}

export function BudgetCard({
  gastado,
  proyeccion,
  limite,
  nivel,
}: BudgetCardProps) {
  const n = NIV[nivel]
  const frac = limite ? Math.min(1, gastado / limite) : 0
  const projFrac =
    proyeccion && limite ? Math.min(1, proyeccion / limite) : 0

  return (
    <Link href="/gastos" style={{ textDecoration: 'none', display: 'block' }}>
      <Card pad={18} style={{ cursor: 'pointer' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 720,
              color: '#181B21',
              letterSpacing: -0.3,
            }}
          >
            Presupuesto
          </div>
          <Pill level={nivel}>{MSGS[nivel]}</Pill>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 7,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 760,
              color: '#181B21',
              letterSpacing: -0.8,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {money(gastado)}
          </span>
          {limite && (
            <span
              style={{ fontSize: 14, color: '#949BA6', fontWeight: 560 }}
            >
              de {money(limite, false)}
            </span>
          )}
        </div>

        {/* bar */}
        <div
          style={{
            position: 'relative',
            height: 12,
            borderRadius: 7,
            background: '#E9ECF1',
            overflow: 'hidden',
            marginTop: 13,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${projFrac * 100}%`,
              background: n.bg,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${frac * 100}%`,
              background: n.dot,
              borderRadius: 7,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 9,
            alignItems: 'center',
          }}
        >
          <span
            style={{ fontSize: 12.5, color: '#59616E', fontWeight: 540 }}
          >
            Proyección{' '}
            <b style={{ color: n.fg, fontWeight: 720 }}>
              {proyeccion != null ? money(proyeccion, false) : '—'}
            </b>{' '}
            <span style={{ color: '#949BA6' }}>est.</span>
          </span>
          <Icon name="chevR" size={16} color="#949BA6" />
        </div>
      </Card>
    </Link>
  )
}
