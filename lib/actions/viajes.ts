'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const ViajeSchema = z.object({
  fechaLlegada: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  fechaSalida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  ciudad: z.string().min(1, 'Ciudad requerida').default('CDMX'),
  notas: z.string().optional(),
  hospedajeMonto: z.coerce.number().nonnegative().default(0),
}).refine((d) => d.fechaSalida >= d.fechaLlegada, {
  message: 'La salida debe ser igual o posterior a la llegada',
  path: ['fechaSalida'],
})

export type ViajeState = {
  errors?: Record<string, string[]>
  message?: string
}

export async function createViaje(
  _prev: ViajeState,
  formData: FormData
): Promise<ViajeState> {
  const raw = {
    fechaLlegada: formData.get('fechaLlegada') as string,
    fechaSalida: formData.get('fechaSalida') as string,
    ciudad: formData.get('ciudad') as string || 'CDMX',
    notas: formData.get('notas') as string || undefined,
    hospedajeMonto: formData.get('hospedajeMonto') as string || '0',
  }

  const parsed = ViajeSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const supabase = await createClient()
  const { data: newViaje, error } = await supabase
    .from('viajes')
    .insert({
      fecha_llegada: parsed.data.fechaLlegada,
      fecha_salida: parsed.data.fechaSalida,
      ciudad: parsed.data.ciudad,
      notas: parsed.data.notas,
    })
    .select('id')
    .single()

  if (error) return { message: error.message }

  if (parsed.data.hospedajeMonto > 0 && newViaje) {
    await supabase.from('gastos').insert({
      monto: parsed.data.hospedajeMonto,
      categoria: 'hospedaje',
      fecha: parsed.data.fechaLlegada,
      viaje_id: newViaje.id,
    })
  }

  revalidatePath('/', 'layout')
  return {}
}

export async function deleteViaje(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('viajes').delete().eq('id', id)
  revalidatePath('/', 'layout')
}
