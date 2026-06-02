'use client'

import { useActionState, useState, useEffect } from 'react'
import { Sheet } from '@/components/shell/Sheet'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { upsertFestivo, type FestivoState } from '@/lib/actions/festivos'

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
        <div style={{ fontSize: 12, color: '#C5392F', marginTop: 4, fontWeight: 560 }}>
          {error}
        </div>
      )}
    </div>
  )
}

interface AddFestivoSheetProps {
  open: boolean
  onClose: () => void
  presetFecha?: string
}

const initialState: FestivoState = {}

export function AddFestivoSheet({
  open,
  onClose,
  presetFecha,
}: AddFestivoSheetProps) {
  const today = new Date().toISOString().split('T')[0]
  const [state, action] = useActionState(upsertFestivo, initialState)
  const [origen, setOrigen] = useState<'ley' | 'empresa' | 'personal'>('empresa')

  useEffect(() => {
    if (open) setOrigen('empresa')
  }, [open])

  const origenes: { value: 'ley' | 'empresa' | 'personal'; label: string }[] = [
    { value: 'ley', label: 'Ley' },
    { value: 'empresa', label: 'Empresa' },
    { value: 'personal', label: 'Personal' },
  ]

  return (
    <Sheet open={open} onClose={onClose} title="Agregar festivo">
      <form action={action}>
        <input type="hidden" name="origen" value={origen} />

        <Field label="Fecha" error={state?.errors?.fecha?.[0]}>
          <input
            type="date"
            name="fecha"
            defaultValue={presetFecha ?? today}
            style={inputStyle}
          />
        </Field>

        <Field label="Nombre" error={state?.errors?.nombre?.[0]}>
          <input
            type="text"
            name="nombre"
            placeholder="Ej. Cierre de empresa"
            style={inputStyle}
          />
        </Field>

        <Field label="Origen">
          <div style={{ display: 'flex', gap: 8 }}>
            {origenes.map((o) => {
              const on = origen === o.value
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setOrigen(o.value)}
                  style={{
                    flex: 1,
                    border: `1.5px solid ${on ? ACCENT : '#E7EAEF'}`,
                    borderRadius: 12,
                    padding: '10px 4px',
                    background: on ? ACCENT + '12' : '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 640,
                    color: on ? '#181B21' : '#59616E',
                    transition: 'all .15s',
                  }}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </Field>

        {state?.message && (
          <div style={{ fontSize: 13, color: '#C5392F', marginBottom: 12, fontWeight: 560 }}>
            {state.message}
          </div>
        )}

        <SubmitButton accent={ACCENT}>
          Guardar festivo
        </SubmitButton>
      </form>
    </Sheet>
  )
}
