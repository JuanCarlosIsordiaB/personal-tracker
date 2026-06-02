// Seed data for Mexican legal holidays (Feriados de ley MX)
// These are the mandatory holidays per Mexican law
export interface FestivoSeed {
  fecha: string
  nombre: string
  origen: 'ley' | 'empresa' | 'personal'
}

// FY26 holidays (Jul 2025 – Jun 2026)
export const FESTIVOS_FY26: FestivoSeed[] = [
  // Q1: Jul-Sep 2025
  { fecha: '2025-09-16', nombre: 'Día de la Independencia', origen: 'ley' },
  // Q2: Oct-Dec 2025
  { fecha: '2025-11-17', nombre: 'Día de la Revolución', origen: 'ley' },
  { fecha: '2025-12-25', nombre: 'Navidad', origen: 'ley' },
  // Q3: Jan-Mar 2026
  { fecha: '2026-01-01', nombre: 'Año Nuevo', origen: 'ley' },
  { fecha: '2026-02-02', nombre: 'Día de la Constitución', origen: 'ley' },
  { fecha: '2026-03-16', nombre: 'Natalicio de Benito Juárez', origen: 'ley' },
  // Q4: Apr-Jun 2026
  { fecha: '2026-05-01', nombre: 'Día del Trabajo', origen: 'ley' },
]

export const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export const DIAS_L = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]
