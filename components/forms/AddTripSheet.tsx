'use client'

import { useActionState, useState, useEffect } from 'react'
import { Sheet } from '@/components/shell/Sheet'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { createViaje, type ViajeState } from '@/lib/actions/viajes'
import { buildDiasParaViaje } from '@/lib/domain/diasContables'
import { DIAS } from '@/lib/domain/festivos'
import { parseLocal } from '@/lib/domain/quarters'

const ACCENT = '#2A6FDB'

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
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string
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
      {error && (
        <div
          style={{
            fontSize: 12,
            color: '#C5392F',
            marginTop: 4,
            fontWeight: 560,
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

interface AddTripSheetProps {
  open: boolean
  onClose: () => void
  festivosMap?: Map<string, string>
}

const initialState: ViajeState = {}

export function AddTripSheet({
  open,
  onClose,
  festivosMap = new Map(),
}: AddTripSheetProps) {
  const [state, action] = useActionState(createViaje, initialState)
  const [llegada, setLlegada] = useState('')
  const [salida, setSalida] = useState('')

  useEffect(() => {
    if (open) {
      setLlegada('')
      setSalida('')
    }
  }, [open])

  // Close on success
  useEffect(() => {
    if (state && !state.errors && !state.message && Object.keys(state).length === 0) {
      // successful save resets state — we check for empty object after first submit
    }
  }, [state])

  const valid =
    llegada &&
    salida &&
    parseLocal(salida) >= parseLocal(llegada)

  let preview: { dias: ReturnType<typeof buildDiasParaViaje>; contables: number } | null = null
  if (valid) {
    const tmpViaje = { id: 'tmp', fechaLlegada: llegada, fechaSalida: salida }
    const diasTmp = buildDiasParaViaje(tmpViaje, festivosMap)
    preview = {
      dias: diasTmp,
      contables: diasTmp.filter((d) => d.estado === 'cuenta').length,
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Nuevo viaje">
      <form action={action}>
        <Field label="Ciudad" error={state?.errors?.ciudad?.[0]}>
          <input
            type="text"
            name="ciudad"
            defaultValue="CDMX"
            style={inputStyle}
          />
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Llegada" error={state?.errors?.fechaLlegada?.[0]}>
              <input
                type="date"
                name="fechaLlegada"
                value={llegada}
                onChange={(e) => setLlegada(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Salida" error={state?.errors?.fechaSalida?.[0]}>
              <input
                type="date"
                name="fechaSalida"
                value={salida}
                onChange={(e) => setSalida(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>
        </div>

        {/* preview */}
        <div
          style={{
            background: valid ? ACCENT + '0E' : '#EEF1F5',
            borderRadius: 16,
            padding: 16,
            marginBottom: 18,
            transition: 'background .2s',
          }}
        >
          {valid && preview ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: '#59616E',
                    fontWeight: 600,
                  }}
                >
                  Días que contarían
                </span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 770,
                    color: ACCENT,
                    letterSpacing: -0.5,
                  }}
                >
                  {preview.contables}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {preview.dias.map((d, i) => {
                  const isC = d.estado === 'cuenta'
                  const dateNum = parseLocal(d.fecha).getDate()
                  return (
                    <div
                      key={i}
                      style={{ flex: '1 1 0', minWidth: 26, textAlign: 'center' }}
                    >
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
                          height: 24,
                          borderRadius: 7,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
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
              <div
                style={{
                  fontSize: 11.5,
                  color: '#949BA6',
                  fontWeight: 500,
                  marginTop: 9,
                }}
              >
                Se descuentan domingos y festivos automáticamente.
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: 13.5,
                color: '#949BA6',
                fontWeight: 540,
                textAlign: 'center',
              }}
            >
              Elige las fechas para ver los días que cuentan.
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

        <SubmitButton disabled={!valid} accent={ACCENT}>
          Guardar viaje
        </SubmitButton>
      </form>
    </Sheet>
  )
}
