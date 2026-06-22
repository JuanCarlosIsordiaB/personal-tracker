import { addDays, isSunday, isAfter } from 'date-fns'
import { parseLocal, formatYMD } from './quarters'

export type DiaEstado = 'cuenta' | 'domingo' | 'sabado' | 'festivo' | 'fuera-de-viaje'

export interface DiaContable {
  fecha: string // 'YYYY-MM-DD'
  estado: DiaEstado
  dow: number // 0=Dom..6=Sáb
  viajeId: string | null
  festivoNombre?: string
}

export interface ViajeRange {
  id: string
  fechaLlegada: string
  fechaSalida: string
}

// R1: build day-by-day array for a date range
// A day 'cuenta' iff: not Sunday, not Saturday AND not holiday AND within a trip
export function buildDiasContables(
  from: string,
  to: string,
  viajes: ViajeRange[],
  festivosMap: Map<string, string> // fecha → nombre
): DiaContable[] {
  const result: DiaContable[] = []
  let current = parseLocal(from)
  const end = parseLocal(to)

  while (!isAfter(current, end)) {
    const iso = formatYMD(current)
    const dow = current.getDay()

    const viaje = viajes.find(
      (v) => iso >= v.fechaLlegada && iso <= v.fechaSalida
    )

    let estado: DiaEstado
    const festivoNombre = festivosMap.get(iso)

    if (isSunday(current)) {
      estado = 'domingo'
    } else if (dow === 6) {
      estado = 'sabado'
    } else if (festivoNombre) {
      estado = 'festivo'
    } else if (!viaje) {
      estado = 'fuera-de-viaje'
    } else {
      estado = 'cuenta'
    }

    result.push({
      fecha: iso,
      estado,
      dow,
      viajeId: viaje?.id ?? null,
      festivoNombre,
    })

    current = addDays(current, 1)
  }

  return result
}

// Build dias for a single trip (used in TripDetail)
export function buildDiasParaViaje(
  viaje: ViajeRange,
  festivosMap: Map<string, string>
): DiaContable[] {
  return buildDiasContables(
    viaje.fechaLlegada,
    viaje.fechaSalida,
    [viaje],
    festivosMap
  )
}
