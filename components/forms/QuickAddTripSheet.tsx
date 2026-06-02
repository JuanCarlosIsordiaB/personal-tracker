'use client'

import { useActionState, useState, useEffect } from 'react'
import { Sheet } from '@/components/shell/Sheet'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Icon } from '@/components/ui/Icon'
import { createViaje, type ViajeState } from '@/lib/actions/viajes'
import { buildDiasParaViaje } from '@/lib/domain/diasContables'
import { MESES, MESES_L, parseLocal } from '@/lib/domain/quarters'
import { DIAS } from '@/lib/domain/festivos'
import { money } from '@/lib/domain/calculos'

const ACCENT = '#2A6FDB'

function fmtRange(a: string, b: string): string {
  const da = parseLocal(a)
  const db = parseLocal(b)
  if (da.getMonth() === db.getMonth()) {
    return `${da.getDate()}–${db.getDate()} ${MESES[da.getMonth()]}`
  }
  return `${da.getDate()} ${MESES[da.getMonth()]} – ${db.getDate()} ${MESES[db.getMonth()]}`
}

interface QuickAddTripSheetProps {
  open: boolean
  onClose: () => void
  fechaLlegada: string
  fechaSalida: string
  festivosMap: Map<string, string>
}

const initialState: ViajeState = {}

export function QuickAddTripSheet({
  open,
  onClose,
  fechaLlegada,
  fechaSalida,
  festivosMap,
}: QuickAddTripSheetProps) {
  const [state, action] = useActionState(createViaje, initialState)
  const [monto, setMonto] = useState('')

  useEffect(() => {
    if (open) setMonto('')
  }, [open])

  const dias =
    fechaLlegada && fechaSalida
      ? buildDiasParaViaje({ id: 'tmp', fechaLlegada, fechaSalida }, festivosMap)
      : []
  const contables = dias.filter((d) => d.estado === 'cuenta').length
  const valid = parseFloat(monto) > 0

  return (
    <Sheet open={open} onClose={onClose} title="Nuevo viaje" maxH={0.75}>
      <form action={action}>
        <input type="hidden" name="fechaLlegada" value={fechaLlegada} />
        <input type="hidden" name="fechaSalida" value={fechaSalida} />
        <input type="hidden" name="ciudad" value="CDMX" />
        <input type="hidden" name="hospedajeMonto" value={monto || '0'} />

        {/* Trip summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 0 16px',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: ACCENT + '14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="pin" size={20} color={ACCENT} />
          </div>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 740,
                color: '#181B21',
                letterSpacing: -0.3,
              }}
            >
              CDMX
            </div>
            <div style={{ fontSize: 13, color: '#949BA6', fontWeight: 540 }}>
              {fmtRange(fechaLlegada, fechaSalida)} ·{' '}
              <span style={{ color: ACCENT, fontWeight: 640 }}>
                {contables} día{contables !== 1 ? 's' : ''} contable{contables !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Day strip preview */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            marginBottom: 20,
            padding: '12px 14px',
            background: ACCENT + '0A',
            borderRadius: 14,
          }}
        >
          {dias.map((d, i) => {
            const isC = d.estado === 'cuenta'
            const dateNum = parseLocal(d.fecha).getDate()
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 9,
                    color: '#949BA6',
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  {DIAS[d.dow][0]}
                </div>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    background: isC
                      ? ACCENT
                      : d.estado === 'festivo'
                      ? '#E3E6EB'
                      : '#E9ECF1',
                    color: isC ? '#fff' : '#949BA6',
                  }}
                >
                  {dateNum}
                </div>
              </div>
            )
          })}
        </div>

        {/* Hotel amount */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 680,
              color: '#59616E',
              marginBottom: 10,
              letterSpacing: 0.1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: '#7A6CE0',
                display: 'inline-block',
              }}
            />
            Total hospedaje
            <span style={{ color: '#949BA6', fontWeight: 500 }}>(opcional)</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 4,
              background: '#FFFFFF',
              border: '1px solid #E7EAEF',
              borderRadius: 16,
              padding: '14px 18px',
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: valid ? '#181B21' : '#949BA6',
              }}
            >
              $
            </span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: 36,
                fontWeight: 760,
                color: valid ? '#181B21' : '#949BA6',
                width: '100%',
                letterSpacing: -1,
              }}
            />
          </div>

          {valid && (
            <div
              style={{
                fontSize: 12,
                color: '#949BA6',
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              Se registrará como gasto de hospedaje · {money(parseFloat(monto))}
            </div>
          )}
        </div>

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

        <SubmitButton accent={ACCENT}>
          Guardar viaje
        </SubmitButton>
      </form>
    </Sheet>
  )
}
