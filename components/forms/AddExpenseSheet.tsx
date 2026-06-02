'use client'

import { useActionState, useState, useEffect } from 'react'
import { Sheet } from '@/components/shell/Sheet'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { CatIcon, CAT_LABELS, CAT_COLORS } from '@/components/ui/Icon'
import { createGasto, type GastoState } from '@/lib/actions/gastos'
import type { CatKey } from '@/components/ui/Icon'

const ACCENT = '#2A6FDB'
const CATS: CatKey[] = ['hospedaje', 'avion', 'comida', 'extra']

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #E7EAEF',
  background: '#FFFFFF',
  borderRadius: 13,
  padding: '13px 14px',
  fontSize: 15.5,
  fontFamily: 'inherit',
  color: '#181B21',
  outline: 'none',
  fontWeight: 500,
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 680,
          color: '#59616E',
          marginBottom: 7,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

interface Viaje {
  id: string
  ciudad: string
  fechaLlegada: string
  fechaSalida: string
}

interface AddExpenseSheetProps {
  open: boolean
  onClose: () => void
  viajes?: Viaje[]
  presetViajeId?: string
  presetFecha?: string
}

const initialState: GastoState = {}

export function AddExpenseSheet({
  open,
  onClose,
  viajes = [],
  presetViajeId,
  presetFecha,
}: AddExpenseSheetProps) {
  const today = new Date().toISOString().split('T')[0]
  const [state, action] = useActionState(createGasto, initialState)
  const [monto, setMonto] = useState('')
  const [cat, setCat] = useState<CatKey>('comida')
  const [fecha, setFecha] = useState(presetFecha ?? today)
  const [viajeId, setViajeId] = useState(presetViajeId ?? '')
  const [nota, setNota] = useState('')

  useEffect(() => {
    if (open) {
      setMonto('')
      setCat('comida')
      setFecha(presetFecha ?? today)
      setViajeId(presetViajeId ?? '')
      setNota('')
    }
  }, [open, presetViajeId, presetFecha])

  const valid = parseFloat(monto) > 0

  return (
    <Sheet open={open} onClose={onClose} title="Nuevo gasto">
      <form action={action}>
        {/* big amount input */}
        <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 600,
                color: valid ? '#181B21' : '#949BA6',
              }}
            >
              $
            </span>
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              name="monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: 46,
                fontWeight: 770,
                color: valid ? '#181B21' : '#949BA6',
                width: 'auto',
                maxWidth: 220,
                letterSpacing: -1.5,
                textAlign: 'left',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: '#949BA6',
              fontWeight: 560,
              marginTop: 2,
            }}
          >
            Se asigna al quarter por su fecha
          </div>
        </div>

        {/* hidden field for cat (buttons control it) */}
        <input type="hidden" name="categoria" value={cat} />

        <Field label="Categoría">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: 8,
            }}
          >
            {CATS.map((k) => {
              const on = cat === k
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCat(k)}
                  style={{
                    border: `1.5px solid ${on ? CAT_COLORS[k] : '#E7EAEF'}`,
                    borderRadius: 14,
                    padding: '12px 4px',
                    background: on ? CAT_COLORS[k] + '12' : '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all .15s',
                  }}
                >
                  <CatIcon cat={k} size={21} />
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 640,
                      color: on ? '#181B21' : '#59616E',
                    }}
                  >
                    {CAT_LABELS[k]}
                  </span>
                </button>
              )
            })}
          </div>
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Fecha">
              <input
                type="date"
                name="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Viaje (opcional)">
              <select
                name="viajeId"
                value={viajeId}
                onChange={(e) => setViajeId(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="">Sin viaje</option>
                {viajes.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.ciudad} · {v.fechaLlegada}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <Field label="Nota">
          <input
            type="text"
            name="nota"
            placeholder="Ej. Hotel Roma · 5 noches"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            style={inputStyle}
          />
        </Field>

        {state?.message && (
          <div
            style={{
              fontSize: 13,
              color: '#C5392F',
              marginBottom: 12,
              fontWeight: 560,
            }}
          >
            {state.message}
          </div>
        )}

        <SubmitButton disabled={!valid} accent={ACCENT}>
          Guardar gasto
        </SubmitButton>
      </form>
    </Sheet>
  )
}
