import { createClient } from '@/lib/supabase/server'
import { getCurrentQuarterId } from '@/lib/domain/quarters'
import { buildDiasParaViaje } from '@/lib/domain/diasContables'
import { money } from '@/lib/domain/calculos'
import { TripCard } from '@/components/viajes/TripCard'
import { ViajesClient } from '@/components/viajes/ViajesClient'

const ACCENT = '#2A6FDB'

export default async function ViajesPage({
  searchParams,
}: {
  searchParams: Promise<{ quarter?: string }>
}) {
  const { quarter: qParam } = await searchParams
  const supabase = await createClient()

  const quarterId = qParam ?? getCurrentQuarterId()

  const [{ data: quarter }, { data: viajes }, { data: festivosData }] =
    await Promise.all([
      supabase
        .from('quarters')
        .select('id, fecha_inicio, fecha_fin, meta_dias')
        .eq('id', quarterId)
        .single(),
      supabase
        .from('viajes')
        .select('id, fecha_llegada, fecha_salida, ciudad')
        .order('fecha_llegada', { ascending: true }),
      supabase.from('festivos').select('fecha, nombre'),
    ])

  const festivosMap = new Map(
    (festivosData ?? []).map((f) => [f.fecha as string, f.nombre as string])
  )

  const viajesData = viajes ?? []

  // For each trip, compute dias + expenses
  const gastosByTrip: Record<string, number> = {}
  if (viajesData.length > 0) {
    const { data: gastos } = await supabase
      .from('gastos')
      .select('viaje_id, monto')
      .in(
        'viaje_id',
        viajesData.map((v) => v.id)
      )
    ;(gastos ?? []).forEach((g) => {
      if (g.viaje_id) {
        gastosByTrip[g.viaje_id] =
          (gastosByTrip[g.viaje_id] ?? 0) + Number(g.monto)
      }
    })
  }

  const tripsWithDias = viajesData.map((v) => {
    const dias = buildDiasParaViaje(
      { id: v.id, fechaLlegada: v.fecha_llegada, fechaSalida: v.fecha_salida },
      festivosMap
    )
    return { viaje: v, dias, totalGasto: gastosByTrip[v.id] ?? 0 }
  })

  const totalDays = tripsWithDias.reduce(
    (s, t) => s + t.dias.filter((d) => d.estado === 'cuenta').length,
    0
  )
  const totalCost = tripsWithDias.reduce((s, t) => s + t.totalGasto, 0)

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 770,
            color: '#181B21',
            letterSpacing: -0.6,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Viajes
        </h1>
        <p style={{ fontSize: 14, color: '#949BA6', fontWeight: 500, margin: '4px 0 0' }}>
          Todos los viajes registrados
        </p>
      </div>

      <ViajesClient
        totalDays={totalDays}
        totalCost={money(totalCost, false)}
        nViajes={viajesData.length}
        quarterId={quarterId}
        festivosMap={Array.from(festivosMap.entries())}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {tripsWithDias.map(({ viaje, dias, totalGasto }) => (
            <TripCard
              key={viaje.id}
              id={viaje.id}
              ciudad={viaje.ciudad}
              fechaLlegada={viaje.fecha_llegada}
              fechaSalida={viaje.fecha_salida}
              dias={dias}
              totalGasto={totalGasto}
              accent={ACCENT}
            />
          ))}
          {viajesData.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#949BA6',
                fontSize: 15,
                padding: '48px 0',
                fontWeight: 500,
              }}
            >
              No hay viajes registrados. ¡Agrega tu primer viaje!
            </div>
          )}
        </div>
      </ViajesClient>
    </div>
  )
}
