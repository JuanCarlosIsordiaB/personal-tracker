'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const CATEGORIAS = ['hospedaje', 'avion', 'comida', 'extra'] as const

const GastoSchema = z.object({
  monto: z.coerce.number().positive('El monto debe ser mayor a 0'),
  categoria: z.enum(CATEGORIAS, { message: 'Categoría inválida' }),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  viajeId: z.string().uuid().nullable().optional(),
  nota: z.string().optional(),
})

export type GastoState = {
  errors?: Record<string, string[]>
  message?: string
}

export async function createGasto(
  _prev: GastoState,
  formData: FormData
): Promise<GastoState> {
  const viajeIdRaw = formData.get('viajeId') as string
  const raw = {
    monto: formData.get('monto') as string,
    categoria: formData.get('categoria') as string,
    fecha: formData.get('fecha') as string,
    viajeId: viajeIdRaw || null,
    nota: formData.get('nota') as string || undefined,
  }

  const parsed = GastoSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('gastos').insert({
    monto: parsed.data.monto,
    categoria: parsed.data.categoria,
    fecha: parsed.data.fecha,
    viaje_id: parsed.data.viajeId ?? null,
    nota: parsed.data.nota,
  })

  if (error) return { message: error.message }

  revalidatePath('/', 'layout')
  return {}
}

export async function deleteGasto(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('gastos').delete().eq('id', id)
  revalidatePath('/', 'layout')
}
