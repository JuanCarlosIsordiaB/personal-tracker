import { addDays, isSunday, startOfDay, isAfter, format, parseISO } from 'date-fns'

export type QuarterId = string // 'FY26-Q1' etc.

export interface QuarterBounds {
  fechaInicio: string // 'YYYY-MM-DD'
  fechaFin: string
}

// R0: date → fiscal quarter ID
// FY: Jul–Dec → FY of (year+1), Jan–Jun → FY of same year
// Q1=Jul-Sep, Q2=Oct-Dec, Q3=Jan-Mar, Q4=Apr-Jun
export function dateToQuarterId(date: Date | string): QuarterId {
  const d = typeof date === 'string' ? parseLocal(date) : date
  const month = d.getMonth() + 1 // 1-12
  const year = d.getFullYear()

  const fy = month >= 7 ? year + 1 : year

  let q: number
  if (month >= 7 && month <= 9) q = 1
  else if (month >= 10 && month <= 12) q = 2
  else if (month >= 1 && month <= 3) q = 3
  else q = 4

  return `FY${String(fy).slice(-2)}-Q${q}`
}

export function getCurrentQuarterId(): QuarterId {
  return dateToQuarterId(new Date())
}

// Parse YYYY-MM-DD as local date (avoids UTC timezone shifting)
export function parseLocal(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Available Mon-Sat days from `from` (inclusive) to `to` (inclusive), minus holidays
export function diasDisponiblesRestantes(
  from: Date,
  to: Date,
  festivosSet: Set<string>
): number {
  let count = 0
  let current = startOfDay(from)
  const end = startOfDay(to)
  const today = startOfDay(new Date())

  // Only count from today onwards
  const start = isAfter(today, current) ? today : current

  let d = startOfDay(start)
  while (!isAfter(d, end)) {
    const iso = formatYMD(d)
    if (!isSunday(d) && !festivosSet.has(iso)) {
      count++
    }
    d = addDays(d, 1)
  }
  return count
}

export function formatYMD(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

// Quarter label for display: 'FY26 · Q2'
export function quarterLabel(id: QuarterId): string {
  // 'FY26-Q2' → 'FY26 · Q2'
  return id.replace('-', ' · ')
}

// Quarter title: 'Oct – Dic 2025'
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function quarterTitle(fechaInicio: string, fechaFin: string): string {
  const a = parseLocal(fechaInicio)
  const b = parseLocal(fechaFin)
  const mA = MESES_L[a.getMonth()]
  const mA2 = mA.charAt(0).toUpperCase() + mA.slice(1)
  const mB = MESES_L[b.getMonth()]
  const mB2 = mB.charAt(0).toUpperCase() + mB.slice(1)
  return `${mA2} – ${mB2} ${b.getFullYear()}`
}

export { MESES, MESES_L }

// Reconstruct dates from a quarter ID without hitting the DB
// 'FY26-Q2' → { fecha_inicio: '2025-10-01', fecha_fin: '2025-12-31' }
export function quarterBoundsFromId(id: QuarterId): { fecha_inicio: string; fecha_fin: string } {
  const m = id.match(/^FY(\d+)-Q([1-4])$/)
  if (!m) throw new Error(`Invalid quarter ID: ${id}`)
  const fy = parseInt(m[1]) + (parseInt(m[1]) < 100 ? 2000 : 0)
  const q = parseInt(m[2])
  switch (q) {
    case 1: return { fecha_inicio: `${fy - 1}-07-01`, fecha_fin: `${fy - 1}-09-30` }
    case 2: return { fecha_inicio: `${fy - 1}-10-01`, fecha_fin: `${fy - 1}-12-31` }
    case 3: return { fecha_inicio: `${fy}-01-01`,     fecha_fin: `${fy}-03-31` }
    default: return { fecha_inicio: `${fy}-04-01`,    fecha_fin: `${fy}-06-30` }
  }
}

// Generate virtual quarter records for a fiscal year range
export interface VirtualQuarter {
  id: string
  fecha_inicio: string
  fecha_fin: string
}

export function generateQuarters(fromFY: number, toFY: number): VirtualQuarter[] {
  const result: VirtualQuarter[] = []
  for (let fy = fromFY; fy <= toFY; fy++) {
    const fyStr = String(fy).slice(-2)
    for (let q = 1; q <= 4; q++) {
      const id = `FY${fyStr}-Q${q}`
      result.push({ id, ...quarterBoundsFromId(id) })
    }
  }
  return result
}
