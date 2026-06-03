'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Icon, CatIcon, CAT_LABELS, CAT_COLORS } from '@/components/ui/Icon'
import { AddExpenseSheet } from '@/components/forms/AddExpenseSheet'
import { money } from '@/lib/domain/calculos'
import type { CatKey } from '@/components/ui/Icon'

const ACCENT = '#2A6FDB'

interface Gasto {
  id: string
  monto: number
  categoria: string
  fecha: string
  nota?: string | null
  viaje_id?: string | null
}

interface Viaje {
  id: string
  ciudad: string
  fechaLlegada: string
  fechaSalida: string
}

interface TripGastosClientProps {
  gastos: Gasto[]
  viajeId: string
  viajes: Viaje[]
}

export function TripGastosClient({ gastos, viajeId, viajes }: TripGastosClientProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4px 9px',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#59616E',
            textTransform: 'uppercase',
            letterSpacing: 0.3,
          }}
        >
          Gastos del viaje
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            border: 'none',
            background: 'transparent',
            color: ACCENT,
            fontSize: 14,
            fontWeight: 680,
            fontFamily: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: 0,
          }}
        >
          <Icon name="plus" size={16} color={ACCENT} stroke={2.3} />
          Agregar
        </button>
      </div>

      <Card pad={0}>
        {gastos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#949BA6',
              fontSize: 14,
              fontWeight: 540,
              padding: '24px 0',
            }}
          >
            Sin gastos registrados para este viaje.
          </div>
        ) : (
          gastos.map((g, i) => {
            const cat = g.categoria as CatKey
            const color = CAT_COLORS[cat]
            return (
              <div
                key={g.id}
                onClick={() => setEditingGasto(g)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderBottom: i < gastos.length - 1 ? '1px solid #EEF1F5' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: color + '16',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CatIcon cat={cat} size={19} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#181B21',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {g.nota || CAT_LABELS[cat]}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: '#949BA6',
                      fontWeight: 540,
                      marginTop: 1,
                    }}
                  >
                    {CAT_LABELS[cat]} · {g.fecha}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 15.5,
                      fontWeight: 700,
                      color: '#181B21',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {money(g.monto)}
                  </div>
                  <Icon name="chevR" size={15} color="#949BA6" />
                </div>
              </div>
            )
          })
        )}
      </Card>

      <AddExpenseSheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        viajes={viajes}
        presetViajeId={viajeId}
      />

      <AddExpenseSheet
        open={editingGasto !== null}
        onClose={() => setEditingGasto(null)}
        viajes={viajes}
        gasto={
          editingGasto
            ? {
                id: editingGasto.id,
                monto: editingGasto.monto,
                categoria: editingGasto.categoria,
                fecha: editingGasto.fecha,
                viaje_id: editingGasto.viaje_id ?? null,
                nota: editingGasto.nota ?? null,
              }
            : undefined
        }
      />
    </div>
  )
}
