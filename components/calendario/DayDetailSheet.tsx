'use client'

import { Sheet } from '@/components/shell/Sheet'
import { Pill, NIV } from '@/components/ui/Pill'
import { Icon, CatIcon, CAT_LABELS, CAT_COLORS } from '@/components/ui/Icon'
import { money } from '@/lib/domain/calculos'
import { MESES, parseLocal } from '@/lib/domain/quarters'
import { DIAS_L } from '@/lib/domain/festivos'
import type { DiaContable } from '@/lib/domain/diasContables'
import type { CatKey } from '@/components/ui/Icon'

const ACCENT = '#2A6FDB'

interface Gasto {
  id: string
  monto: number
  categoria: string
  fecha: string
  nota?: string
}

interface Viaje {
  id: string
  ciudad: string
}

interface DayDetailSheetProps {
  open: boolean
  onClose: () => void
  fecha: string
  dia: DiaContable | undefined
  gastosDia: Gasto[]
  viaje: Viaje | undefined
  quarterId: string
  onAddExpense: () => void
}

function fmtShort(s: string): string {
  const d = parseLocal(s)
  return `${d.getDate()} ${MESES[d.getMonth()]}`
}

const ESTADO_BADGE: Record<
  string,
  { text: string; level?: 'verde' | 'amarillo'; muted?: boolean }
> = {
  cuenta:           { text: 'Cuenta como día de oficina', level: 'verde' },
  festivo:          { text: 'Festivo', level: 'amarillo' },
  domingo:          { text: 'Domingo · no cuenta', muted: true },
  'fuera-de-viaje': { text: 'Fuera de viaje · no cuenta', muted: true },
}

export function DayDetailSheet({
  open,
  onClose,
  fecha,
  dia,
  gastosDia,
  viaje,
  quarterId,
  onAddExpense,
}: DayDetailSheetProps) {
  const dow = dia?.dow ?? parseLocal(fecha).getDay()
  const title = `${DIAS_L[dow]} ${fmtShort(fecha)}`
  const estado = dia?.estado ?? 'fuera-de-viaje'
  const badge = ESTADO_BADGE[estado] ?? ESTADO_BADGE['fuera-de-viaje']
  const totalDia = gastosDia.reduce((s, g) => s + g.monto, 0)
  const festivoNombre = dia?.festivoNombre

  return (
    <Sheet open={open} onClose={onClose} title={title} maxH={0.82}>
      {/* Status badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          padding: '4px 0 16px',
        }}
      >
        {badge.level ? (
          <Pill level={badge.level}>
            {estado === 'cuenta' && (
              <Icon name="check" size={13} color={NIV[badge.level].fg} stroke={2.6} />
            )}
            {estado === 'festivo' && festivoNombre ? `${badge.text} · ${festivoNombre}` : badge.text}
          </Pill>
        ) : (
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 680,
              color: '#59616E',
              background: '#E9ECF1',
              padding: '4px 11px',
              borderRadius: 999,
            }}
          >
            {badge.text}
          </span>
        )}

        <span style={{ fontSize: 12.5, color: '#949BA6', fontWeight: 600 }}>
          {quarterId.replace('-', ' · ')}
        </span>

        {viaje && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12.5,
              fontWeight: 620,
              color: ACCENT,
              background: ACCENT + '12',
              padding: '4px 10px',
              borderRadius: 999,
            }}
          >
            <Icon name="pin" size={13} color={ACCENT} />
            {viaje.ciudad}
          </span>
        )}
      </div>

      {/* Expenses section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#59616E',
            textTransform: 'uppercase',
            letterSpacing: 0.3,
          }}
        >
          Gastos de este día
        </span>
        {gastosDia.length > 0 && (
          <span
            style={{
              fontSize: 15,
              fontWeight: 740,
              color: '#181B21',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {money(totalDia)}
          </span>
        )}
      </div>

      {gastosDia.length > 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            border: '0.5px solid #EEF1F5',
            overflow: 'hidden',
            marginBottom: 18,
            boxShadow: '0 1px 2px rgba(20,28,45,0.04)',
          }}
        >
          {gastosDia.map((g, i) => {
            const cat = g.categoria as CatKey
            const color = CAT_COLORS[cat]
            return (
              <div
                key={g.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderBottom:
                    i < gastosDia.length - 1 ? '1px solid #EEF1F5' : 'none',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: color + '16',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CatIcon cat={cat} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: '#181B21',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {g.nota || CAT_LABELS[cat]}
                  </div>
                  <div style={{ fontSize: 12, color: '#949BA6', fontWeight: 540, marginTop: 1 }}>
                    {CAT_LABELS[cat]}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#181B21',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  }}
                >
                  {money(g.monto)}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            color: '#949BA6',
            fontSize: 14,
            fontWeight: 540,
            padding: '20px 0 24px',
            background: '#FFFFFF',
            borderRadius: 14,
            marginBottom: 18,
            border: '1px dashed #E7EAEF',
          }}
        >
          Sin gastos registrados en este día.
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onAddExpense}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 15,
          padding: '15px',
          background: ACCENT,
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: 'pointer',
          letterSpacing: -0.2,
        }}
      >
        + Agregar gasto a este día
      </button>
    </Sheet>
  )
}
