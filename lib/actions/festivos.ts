'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const FestivoSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  nombre: z.string().min(1, 'Nombre requerido'),
  origen: z.enum(['ley', 'empresa', 'personal']),
})

export type FestivoState = {
  errors?: Record<string, string[]>
  message?: string
}

export async function upsertFestivo(
  _prev: FestivoState,
  formData: FormData
): Promise<FestivoState> {
  const raw = {
    fecha: formData.get('fecha') as string,
    nombre: formData.get('nombre') as string,
    origen: formData.get('origen') as string,
  }

  const parsed = FestivoSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('festivos')
    .upsert(parsed.data, { onConflict: 'fecha' })

  if (error) return { message: error.message }

  revalidatePath('/', 'layout')
  return {}
}

export async function deleteFestivo(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('festivos').delete().eq('id', id)
  revalidatePath('/', 'layout')
}
