import { addDays, isSunday, startOfDay, isAfter, format, parseISO } from 'date-fns'

export type QuarterId = string // 'FY26-Q1' etc.

export interface QuarterBounds {
  fechaInicio: string // 'YYYY-MM-DD'
  fechaFin: string
}

// R0: date → fiscal quarter ID
// FY: Feb–Dec → FY of (year+1), Jan → FY of same year
// Q1=1-feb/2-may, Q2=3-may/1-ago, Q3=2-ago/31-oct, Q4=1-nov/30-ene
export function dateToQuarterId(date: Date | string): QuarterId {
  const d = typeof date === 'string' ? parseLocal(date) : date
  const month = d.getMonth() + 1 // 1-12
  const day = d.getDate()
  const year = d.getFullYear()

  // FY = year+1 for Feb–Dec; FY = year for Jan
  const fy = month === 1 ? year : year + 1

  let q: number
  if (month >= 2 && (month < 5 || (month === 5 && day <= 2))) q = 1
  else if ((month === 5 && day >= 3) || (month >= 6 && month < 8) || (month === 8 && day <= 1)) q = 2
  else if ((month === 8 && day >= 2) || month === 9 || month === 10) q = 3
  else q = 4 // Nov–Dec and Jan

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

// Available Mon-Fri days from `from` (inclusive) to `to` (inclusive), minus holidays
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
    if (!isSunday(d) && d.getDay() !== 6 && !festivosSet.has(iso)) {
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
// FY27 example (year = fy-1 = 2026):
//   Q1: 2026-02-01 / 2026-05-02
//   Q2: 2026-05-03 / 2026-08-01
//   Q3: 2026-08-02 / 2026-10-31
//   Q4: 2026-11-01 / 2027-01-30
export function quarterBoundsFromId(id: QuarterId): { fecha_inicio: string; fecha_fin: string } {
  const m = id.match(/^FY(\d+)-Q([1-4])$/)
  if (!m) throw new Error(`Invalid quarter ID: ${id}`)
  const fy = parseInt(m[1]) + (parseInt(m[1]) < 100 ? 2000 : 0)
  const q = parseInt(m[2])
  const y = fy - 1 // calendar year in which the FY starts (Feb)
  switch (q) {
    case 1: return { fecha_inicio: `${y}-02-01`, fecha_fin: `${y}-05-02` }
    case 2: return { fecha_inicio: `${y}-05-03`, fecha_fin: `${y}-08-01` }
    case 3: return { fecha_inicio: `${y}-08-02`, fecha_fin: `${y}-10-31` }
    default: return { fecha_inicio: `${y}-11-01`, fecha_fin: `${fy}-01-30` }
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
