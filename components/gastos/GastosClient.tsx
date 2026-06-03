'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon, CatIcon, CAT_LABELS, CAT_COLORS } from '@/components/ui/Icon'
import { Card } from '@/components/ui/Card'
import { AddExpenseSheet } from '@/components/forms/AddExpenseSheet'
import { money } from '@/lib/domain/calculos'
import type { CatKey } from '@/components/ui/Icon'

const ACCENT = '#2A6FDB'

interface Gasto {
  id: string
  monto: number
  categoria: string
  fecha: string
  nota?: string
  viaje_id?: string
}

interface Viaje {
  id: string
  ciudad: string
  fechaLlegada: string
  fechaSalida: string
}

interface CatTotals {
  hospedaje: number
  avion: number
  comida: number
  extra: number
}

interface GastosClientProps {
  gastos: Gasto[]
  viajes: Viaje[]
  catTotals: CatTotals
  total: number
  quarterId: string
}

const CHIPS = [
  { value: 'todos', label: 'Todos' },
  { value: 'hospedaje', label: 'Hospedaje' },
  { value: 'avion', label: 'Avión' },
  { value: 'comida', label: 'Comida' },
  { value: 'extra', label: 'Extra' },
]

const ORDER: CatKey[] = ['hospedaje', 'avion', 'comida', 'extra']

export function GastosClient({
  gastos,
  viajes,
  catTotals,
  total,
  quarterId,
}: GastosClientProps) {
  const [filter, setFilter] = useState('todos')
  const [showAdd, setShowAdd] = useState(false)
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null)

  const filtered = gastos
    .filter((g) => filter === 'todos' || g.categoria === filter)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  const viajeMap = new Map(viajes.map((v) => [v.id, v]))

  return (
    <>
      {/* CatBreakdown */}
      <Card pad={18} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <div>
            <div style={{ fontSize: 13, color: '#949BA6', fontWeight: 600 }}>
              Gastado · {quarterId.replace('-', ' · ')}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 770,
                color: '#181B21',
                letterSpacing: -0.9,
                marginTop: 2,
                marginBottom: 14,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {money(total)}
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              border: 'none',
              background: ACCENT,
              color: '#fff',
              borderRadius: 12,
              height: 40,
              padding: '0 14px',
              fontSize: 14,
              fontWeight: 680,
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 4,
            }}
          >
            <Icon name="plus" size={17} color="#fff" stroke={2.4} />
            Gasto
          </button>
        </div>

        {/* stacked bar */}
        {total > 0 && (
          <div
            style={{
              display: 'flex',
              height: 12,
              borderRadius: 7,
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            {ORDER.map((k) => (
              <div
                key={k}
                style={{
                  width: `${(catTotals[k] / total) * 100}%`,
                  background: CAT_COLORS[k],
                }}
              />
            ))}
          </div>
        )}

        <div
          className="grid-2col"
          style={{ gap: '12px 16px' }}
        >
          {ORDER.map((k) => (
            <div
              key={k}
              style={{ display: 'flex', alignItems: 'center', gap: 9 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: CAT_COLORS[k],
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 13.5,
                  color: '#59616E',
                  fontWeight: 560,
                  flex: 1,
                }}
              >
                {CAT_LABELS[k]}
              </span>
              <span
                style={{
                  fontSize: 13.5,
                  color: '#181B21',
                  fontWeight: 680,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {money(catTotals[k], false)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 2,
          marginBottom: 14,
        }}
      >
        {CHIPS.map((ch) => {
          const on = ch.value === filter
          return (
            <button
              key={ch.value}
              onClick={() => setFilter(ch.value)}
              style={{
                flexShrink: 0,
                border: 'none',
                cursor: 'pointer',
                borderRadius: 999,
                padding: '9px 15px',
                fontSize: 13.5,
                fontWeight: 640,
                fontFamily: 'inherit',
                background: on ? '#181B21' : '#FFFFFF',
                color: on ? '#fff' : '#59616E',
                boxShadow: on
                  ? 'none'
                  : '0 1px 2px rgba(20,28,45,0.05), 0 0 0 0.5px #E7EAEF',
                transition: 'all .15s',
              }}
            >
              {ch.label}
            </button>
          )
        })}
      </div>

      {/* Expense list */}
      <Card pad={0}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#949BA6',
              fontSize: 14,
              fontWeight: 540,
              padding: '32px 0',
            }}
          >
            Sin gastos {filter !== 'todos' ? `en "${CAT_LABELS[filter as CatKey]}"` : 'registrados'}.
          </div>
        ) : (
          filtered.map((g, i) => {
            const cat = g.categoria as CatKey
            const color = CAT_COLORS[cat]
            const viaje = g.viaje_id ? viajeMap.get(g.viaje_id) : null
            return (
              <div
                key={g.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderBottom:
                    i < filtered.length - 1 ? '1px solid #EEF1F5' : 'none',
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
                    {viaje ? ` · ${viaje.ciudad}` : ''}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 15.5,
                    fontWeight: 700,
                    color: '#181B21',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  }}
                >
                  {money(g.monto)}
                </div>
                <button
                  onClick={() => setEditingGasto(g)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '4px 2px',
                    color: '#C0C5CE',
                    fontSize: 18,
                    lineHeight: 1,
                    flexShrink: 0,
                    letterSpacing: 1,
                  }}
                  aria-label="Editar gasto"
                >
                  ···
                </button>
              </div>
            )
          })
        )}
      </Card>

      <AddExpenseSheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        viajes={viajes}
      />

      <AddExpenseSheet
        open={editingGasto !== null}
        onClose={() => setEditingGasto(null)}
        viajes={viajes}
        gasto={editingGasto ?? undefined}
      />
    </>
  )
}
