'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { deleteViaje } from '@/lib/actions/viajes'

const DANGER = '#C5392F'

export function DeleteViajeButton({ viajeId }: { viajeId: string }) {
  const router = useRouter()
  const [isDeleting, startDelete] = useTransition()

  const handleDelete = () => {
    if (!window.confirm('¿Eliminar este viaje y todos sus gastos? Esta acción no se puede deshacer.')) {
      return
    }
    startDelete(async () => {
      await deleteViaje(viajeId)
      router.push('/viajes')
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      style={{
        border: 'none',
        background: 'transparent',
        color: DANGER,
        fontSize: 13.5,
        fontWeight: 640,
        fontFamily: 'inherit',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        opacity: isDeleting ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '8px 0',
      }}
    >
      <Icon name="trash" size={15} color={DANGER} stroke={2} />
      {isDeleting ? 'Eliminando…' : 'Eliminar viaje'}
    </button>
  )
}
