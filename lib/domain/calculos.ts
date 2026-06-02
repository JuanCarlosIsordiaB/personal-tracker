import type { DiaContable } from './diasContables'

export type Nivel = 'verde' | 'amarillo' | 'rojo'

// R2: count days where estado === 'cuenta'
export function diasCumplidos(dias: DiaContable[]): number {
  return dias.filter((d) => d.estado === 'cuenta').length
}

// Filter dias to those falling within a quarter date range (for cross-quarter trips)
export function diasEnQuarter(
  dias: DiaContable[],
  fechaInicio: string,
  fechaFin: string
): DiaContable[] {
  return dias.filter((d) => d.fecha >= fechaInicio && d.fecha <= fechaFin)
}

// R3: holgura calculation
export function calcHolgura(params: {
  meta: number
  cumplidos: number
  disponiblesRestantes: number
}): { faltan: number; holgura: number; alerta: boolean; nivel: Nivel } {
  const faltan = Math.max(0, params.meta - params.cumplidos)
  const holgura = params.disponiblesRestantes - faltan
  const nivel: Nivel =
    holgura <= 0 ? 'rojo' : holgura < 5 ? 'amarillo' : 'verde'
  return { faltan, holgura, alerta: holgura < 0, nivel }
}

// R4: cost per day — null if no days completed
export function costoPorDia(
  gastoTotal: number,
  cumplidos: number
): number | null {
  return cumplidos === 0 ? null : gastoTotal / cumplidos
}

// R5: projected total spend
export function proyeccionGasto(params: {
  gastado: number
  faltan: number
  cpd: number | null
}): number | null {
  if (params.cpd === null) return null
  return params.gastado + params.faltan * params.cpd
}

// Budget nivel based on proyeccion vs limite
export function dineroNivel(
  proyeccion: number | null,
  limite: number | null
): Nivel {
  if (!proyeccion || !limite) return 'verde'
  const ratio = proyeccion / limite
  if (ratio > 1) return 'rojo'
  if (ratio > 0.85) return 'amarillo'
  return 'verde'
}

// Format MXN currency
export function money(n: number, decimals = true): string {
  return (
    '$' +
    Number(n).toLocaleString('es-MX', {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0,
    })
  )
}
