'use client'

import type { DiaContable } from '@/lib/domain/diasContables'
import { MESES_L, MESES, parseLocal } from '@/lib/domain/quarters'

interface Festivo {
  fecha: string
  nombre: string
  origen: 'ley' | 'empresa' | 'personal'
}

interface MonthGridProps {
  year: number
  month: number // 0-indexed
  diasContables: DiaContable[]
  festivos: Festivo[]
  gastoFechas: Set<string>
  todayStr: string
  accent?: string
  onDayClick?: (fecha: string) => void
  rangeStart?: string | null
  rangeEnd?: string | null
  selectingRange?: boolean
  arrivalDepartureDates?: Set<string>
}

const ACCENT = '#2A6FDB'

export function MonthGrid({
  year,
  month,
  diasContables,
  festivos,
  gastoFechas,
  todayStr,
  accent = ACCENT,
  onDayClick,
  rangeStart,
  rangeEnd,
  selectingRange = false,
  arrivalDepartureDates,
}: MonthGridProps) {
  const first = new Date(year, month, 1)
  // Monday-first: getDay() 0=Sun..6=Sat → offset: Mon=0,Tue=1..Sun=6
  const startCol = (first.getDay() + 6) % 7
  const nDays = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startCol; i++) cells.push(null)
  for (let d = 1; d <= nDays; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  // Build lookup map for this month
  const diasMap = new Map(
    diasContables.map((d) => [d.fecha, d])
  )

  const monthHols = festivos.filter((h) => {
    const hd = parseLocal(h.fecha)
    return hd.getFullYear() === year && hd.getMonth() === month
  })

  return (
    <div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 740,
          color: '#181B21',
          letterSpacing: -0.3,
          marginBottom: 12,
        }}
      >
        {MESES_L[month].charAt(0).toUpperCase() + MESES_L[month].slice(1)}{' '}
        <span style={{ color: '#949BA6', fontWeight: 600 }}>{year}</span>
      </div>

      {/* Day headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gap: 4,
          marginBottom: 6,
        }}
      >
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: i === 6 ? '#949BA6' : '#59616E',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gap: 4,
        }}
      >
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />

          const pad = String(month + 1).padStart(2, '0')
          const dayPad = String(d).padStart(2, '0')
          const iso = `${year}-${pad}-${dayPad}`
          const dia = diasMap.get(iso)
          const hasGasto = gastoFechas.has(iso)
          const isToday = iso === todayStr

          // Range selection overlay
          const isRangeStart = rangeStart === iso
          const isRangeEnd = rangeEnd === iso
          const inRange =
            rangeStart && rangeEnd
              ? iso > rangeStart && iso < rangeEnd
              : false

          let bg = 'transparent'
          let col = '#181B21'
          let weight = 500
          let cellRadius = 11

          const inTrip = !!dia?.viajeId
          const isArrivalOrDeparture = !!arrivalDepartureDates?.has(iso)

          if (isRangeStart || isRangeEnd) {
            bg = accent
            col = '#fff'
            weight = 700
            cellRadius = 11
          } else if (inRange) {
            bg = accent + '22'
            col = '#181B21'
            weight = 600
            cellRadius = 0
          } else if (dia?.estado === 'cuenta') {
            bg = accent
            col = '#fff'
            weight = 700
          } else if (dia?.estado === 'festivo' && inTrip) {
            // Festivo dentro de un viaje: fondo festivo con tinte azul
            bg = accent + '18'
            col = '#949BA6'
            weight = 600
          } else if (dia?.estado === 'festivo') {
            bg = '#EFF1F4'
            col = '#949BA6'
            weight = 600
          } else if (dia?.estado === 'domingo' && inTrip) {
            // Domingo dentro de un viaje: tinte azul muy suave, texto gris
            bg = accent + '12'
            col = '#949BA6'
            weight = 500
          } else if (dia?.estado === 'domingo') {
            col = '#949BA6'
          }

          // Round only the outer edges when in range
          const borderRadius =
            isRangeStart && rangeEnd
              ? '11px 0 0 11px'
              : isRangeEnd && rangeStart
              ? '0 11px 11px 0'
              : inRange
              ? 0
              : cellRadius

          const ring =
            isRangeStart && !rangeEnd
              ? `0 0 0 2.5px ${accent}`
              : isToday && !isRangeStart && !isRangeEnd
              ? `0 0 0 2px ${accent}`
              : 'none'

          const rowBg =
            inRange
              ? accent + '11'
              : isRangeStart && rangeEnd
              ? accent + '11'
              : isRangeEnd && rangeStart
              ? accent + '11'
              : 'transparent'

          return (
            <button
              key={i}
              onClick={() => onDayClick?.(iso)}
              style={{
                background: rowBg,
                border: 'none',
                padding: 0,
                cursor: onDayClick ? 'pointer' : 'default',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: borderRadius,
                  background: bg,
                  color: col,
                  fontWeight: weight,
                  fontSize: 14.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontVariantNumeric: 'tabular-nums',
                  boxShadow: ring,
                  position: 'relative',
                  transition: 'background .3s',
                }}
              >
                {d}
                {/* Red dot for arrival/departure day */}
                {isArrivalOrDeparture && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 6,
                      height: 6,
                      borderRadius: 99,
                      background: '#E0463B',
                      border: '1.5px solid',
                      borderColor: dia?.estado === 'cuenta' ? 'rgba(255,255,255,0.8)' : '#F3F5F8',
                    }}
                  />
                )}
                {dia?.estado === 'festivo' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 3,
                      width: 4,
                      height: 4,
                      borderRadius: 99,
                      background: inTrip ? accent : '#949BA6',
                      opacity: inTrip ? 0.7 : 1,
                    }}
                  />
                )}
                {dia?.estado === 'domingo' && inTrip && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 3,
                      width: 4,
                      height: 4,
                      borderRadius: 99,
                      background: accent,
                      opacity: 0.5,
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  height: 7,
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {hasGasto && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 99,
                      background:
                        dia?.estado === 'cuenta' ? accent : '#E0903B',
                    }}
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Holiday labels */}
      {monthHols.length > 0 && (
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          {monthHols.map((h, i) => {
            const hd = parseLocal(h.fecha)
            return (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 9 }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    background: '#949BA6',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: '#59616E',
                    fontWeight: 560,
                  }}
                >
                  {hd.getDate()} {MESES[hd.getMonth()]} · {h.nombre}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.3,
                    color:
                      h.origen === 'ley'
                        ? '#949BA6'
                        : h.origen === 'empresa'
                        ? accent
                        : '#9A7BD0',
                    background:
                      h.origen === 'empresa' ? accent + '14' : '#EEF1F5',
                    padding: '2px 7px',
                    borderRadius: 6,
                  }}
                >
                  {h.origen}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
