import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { Icon } from '@/components/ui/Icon'
import { DayStrip } from './DayStrip'
import type { DiaContable } from '@/lib/domain/diasContables'
import { money } from '@/lib/domain/calculos'
import { MESES } from '@/lib/domain/quarters'
import { parseLocal } from '@/lib/domain/quarters'

interface TripCardProps {
  id: string
  ciudad: string
  fechaLlegada: string
  fechaSalida: string
  dias: DiaContable[]
  totalGasto: number
  accent?: string
}

function fmtRange(a: string, b: string): string {
  const da = parseLocal(a)
  const db = parseLocal(b)
  if (da.getMonth() === db.getMonth()) {
    return `${da.getDate()}–${db.getDate()} ${MESES[da.getMonth()]}`
  }
  return `${da.getDate()} ${MESES[da.getMonth()]} – ${db.getDate()} ${MESES[db.getMonth()]}`
}

export function TripCard({
  id,
  ciudad,
  fechaLlegada,
  fechaSalida,
  dias,
  totalGasto,
  accent = '#2A6FDB',
}: TripCardProps) {
  const contables = dias.filter((d) => d.estado === 'cuenta').length
  const perDay = contables > 0 ? totalGasto / contables : null

  return (
    <Link href={`/viajes/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Card pad={16} style={{ cursor: 'pointer' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: accent + '14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="pin" size={19} color={accent} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 16.5,
                  fontWeight: 730,
                  color: '#181B21',
                  letterSpacing: -0.3,
                }}
              >
                {ciudad}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#949BA6',
                  fontWeight: 540,
                  marginTop: 1,
                }}
              >
                {fmtRange(fechaLlegada, fechaSalida)}
              </div>
            </div>
          </div>
          <Pill level="verde">{contables} días</Pill>
        </div>

        <DayStrip dias={dias} accent={accent} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
            paddingTop: 13,
            borderTop: '1px solid #EEF1F5',
          }}
        >
          <div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 740,
                color: '#181B21',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {money(totalGasto)}
            </span>
            <span
              style={{ fontSize: 13, color: '#949BA6', fontWeight: 540 }}
            >
              {' '}
              total
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#59616E', fontWeight: 600 }}>
              {perDay != null ? money(perDay) : '—'}
              <span style={{ color: '#949BA6', fontWeight: 500 }}> /día</span>
            </span>
            <Icon name="chevR" size={16} color="#949BA6" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
