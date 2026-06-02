'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Card } from '@/components/ui/Card'
import { AddFestivoSheet } from '@/components/forms/AddFestivoSheet'
import { AddExpenseSheet } from '@/components/forms/AddExpenseSheet'
import { QuickAddTripSheet } from '@/components/forms/QuickAddTripSheet'
import { DayDetailSheet } from './DayDetailSheet'
import { MonthGrid } from './MonthGrid'
import type { DiaContable } from '@/lib/domain/diasContables'

const ACCENT = '#2A6FDB'

interface Festivo {
  fecha: string
  nombre: string
  origen: 'ley' | 'empresa' | 'personal'
}

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

interface CalendarioClientProps {
  months: { year: number; month: number }[]
  diasContables: DiaContable[]
  festivos: Festivo[]
  gastos: Gasto[]
  viajes: Viaje[]
  gastoFechas: Set<string>
  todayStr: string
  quarterId: string
  accent?: string
}

export function CalendarioClient({
  months,
  diasContables,
  festivos,
  gastos,
  viajes,
  gastoFechas,
  todayStr,
  quarterId,
  accent = ACCENT,
}: CalendarioClientProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showDayDetail, setShowDayDetail] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddFestivo, setShowAddFestivo] = useState(false)

  // Range selection state
  const [rangeStart, setRangeStart] = useState<string | null>(null)
  const [rangeEnd, setRangeEnd] = useState<string | null>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const diasMap = new Map(diasContables.map((d) => [d.fecha, d]))
  const festivosMap = new Map(festivos.map((f) => [f.fecha, f.nombre]))

  // Set of arrival and departure dates across all trips
  const arrivalDepartureDates = new Set(
    viajes.flatMap((v) => [v.fechaLlegada, v.fechaSalida])
  )

  function handleDayClick(fecha: string) {
    const dia = diasMap.get(fecha)
    const hasViaje = !!dia?.viajeId

    // If in range selection mode, handle range logic
    if (rangeStart && !rangeEnd) {
      if (fecha === rangeStart) {
        // Tap same day = cancel
        setRangeStart(null)
        return
      }
      if (fecha < rangeStart) {
        // Earlier day = new start
        setRangeStart(fecha)
        return
      }
      // Valid end date
      setRangeEnd(fecha)
      setShowQuickAdd(true)
      return
    }

    // If day has a trip or expense → open day detail
    if (hasViaje || gastoFechas.has(fecha)) {
      setSelectedDay(fecha)
      setShowDayDetail(true)
      return
    }

    // Free day → start range selection
    setRangeStart(fecha)
    setRangeEnd(null)
  }

  function cancelRange() {
    setRangeStart(null)
    setRangeEnd(null)
    setShowQuickAdd(false)
  }

  function handleAddExpenseFromDay() {
    setShowDayDetail(false)
    setShowAddExpense(true)
  }

  const selectedDia = selectedDay ? diasMap.get(selectedDay) : undefined
  const gastosDia = selectedDay
    ? gastos.filter((g) => g.fecha === selectedDay)
    : []
  const viajeDelDia = selectedDia?.viajeId
    ? viajes.find((v) => v.id === selectedDia.viajeId)
    : undefined

  const selectingRange = !!rangeStart && !rangeEnd

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        {selectingRange ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              background: accent + '12',
              borderRadius: 12,
              fontSize: 13.5,
              fontWeight: 640,
              color: accent,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                background: accent,
                display: 'inline-block',
                animation: 'pulse 1.2s ease-in-out infinite',
              }}
            />
            Toca el día de salida
            <button
              onClick={cancelRange}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: accent,
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                padding: '0 4px',
              }}
            >
              Cancelar ×
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddFestivo(true)}
            style={{
              border: 'none',
              background: 'transparent',
              color: accent,
              fontSize: 13.5,
              fontWeight: 640,
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 0',
            }}
          >
            <Icon name="plus" size={16} color={accent} stroke={2.3} />
            Agregar festivo
          </button>
        )}
      </div>

      {/* Month grids */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {months.map(({ year, month }) => (
          <Card key={`${year}-${month}`} pad={18}>
            <MonthGrid
              year={year}
              month={month}
              diasContables={diasContables}
              festivos={festivos}
              gastoFechas={gastoFechas}
              todayStr={todayStr}
              accent={accent}
              onDayClick={handleDayClick}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              selectingRange={selectingRange}
              arrivalDepartureDates={arrivalDepartureDates}
            />
          </Card>
        ))}
      </div>

      {/* Quick add trip sheet (range selection) */}
      <QuickAddTripSheet
        open={showQuickAdd}
        onClose={cancelRange}
        fechaLlegada={rangeStart ?? ''}
        fechaSalida={rangeEnd ?? ''}
        festivosMap={festivosMap}
      />

      {/* Day detail sheet */}
      <DayDetailSheet
        open={showDayDetail}
        onClose={() => setShowDayDetail(false)}
        fecha={selectedDay ?? todayStr}
        dia={selectedDia}
        gastosDia={gastosDia}
        viaje={viajeDelDia}
        quarterId={quarterId}
        onAddExpense={handleAddExpenseFromDay}
      />

      {/* Add expense sheet (from day detail) */}
      <AddExpenseSheet
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        viajes={viajes}
        presetFecha={selectedDay ?? undefined}
        presetViajeId={viajeDelDia?.id}
      />

      {/* Add festivo sheet */}
      <AddFestivoSheet
        open={showAddFestivo}
        onClose={() => setShowAddFestivo(false)}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </>
  )
}
