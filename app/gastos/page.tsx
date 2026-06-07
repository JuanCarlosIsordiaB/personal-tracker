import { createClient } from '@/lib/supabase/server'
import { getCurrentQuarterId } from '@/lib/domain/quarters'
import { GastosClient } from '@/components/gastos/GastosClient'
import { QuarterNav } from '@/components/shell/QuarterNav'

export default async function GastosPage({
  searchParams,
}: {
  searchParams: Promise<{ quarter?: string }>
}) {
  const { quarter: qParam } = await searchParams
  const quarterId = qParam ?? getCurrentQuarterId()
  const supabase = await createClient()

  // Need quarter bounds to filter gastos
  const { data: quarter } = await supabase
    .from('quarters')
    .select('id, fecha_inicio, fecha_fin')
    .eq('id', quarterId)
    .single()

  const [{ data: gastos }, { data: viajes }] = await Promise.all([
    quarter
      ? supabase
          .from('gastos')
          .select('id, monto, categoria, fecha, nota, viaje_id')
          .gte('fecha', quarter.fecha_inicio)
          .lte('fecha', quarter.fecha_fin)
          .order('fecha', { ascending: false })
      : Promise.resolve({ data: [] }),
    supabase
      .from('viajes')
      .select('id, ciudad, fecha_llegada, fecha_salida')
      .order('fecha_llegada', { ascending: true }),
  ])

  const gastosData = (gastos ?? []).map((g) => ({
    id: g.id,
    monto: Number(g.monto),
    categoria: g.categoria,
    fecha: g.fecha,
    nota: g.nota ?? undefined,
    viaje_id: g.viaje_id ?? undefined,
  }))

  const viajesData = (viajes ?? []).map((v) => ({
    id: v.id,
    ciudad: v.ciudad,
    fechaLlegada: v.fecha_llegada,
    fechaSalida: v.fecha_salida,
  }))

  const catTotals = { hospedaje: 0, avion: 0, comida: 0, extra: 0 }
  let total = 0
  gastosData.forEach((g) => {
    const k = g.categoria as keyof typeof catTotals
    if (k in catTotals) {
      catTotals[k] += g.monto
    }
    total += g.monto
  })

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div>
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
            Gastos
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#949BA6',
              fontWeight: 500,
              margin: '4px 0 0',
            }}
          >
            {quarterId.replace('-', ' · ')}
          </p>
        </div>
        <QuarterNav currentId={quarterId} />
      </div>

      <GastosClient
        gastos={gastosData}
        viajes={viajesData}
        catTotals={catTotals}
        total={total}
        quarterId={quarterId}
      />
    </div>
  )
}
