import { createClient } from '@/lib/supabase/server'
import { getCurrentQuarterId, quarterLabel, quarterTitle, diasDisponiblesRestantes, parseLocal, formatYMD } from '@/lib/domain/quarters'
import { buildDiasContables } from '@/lib/domain/diasContables'
import { diasCumplidos as countCumplidos, calcHolgura, costoPorDia, proyeccionGasto, dineroNivel } from '@/lib/domain/calculos'
import { RhythmHero } from '@/components/dashboard/RhythmHero'
import { DayProgressCard } from '@/components/dashboard/DayProgressCard'
import { BudgetCard } from '@/components/dashboard/BudgetCard'
import { MiniStats } from '@/components/dashboard/MiniStats'
import { QuarterSelector } from '@/components/dashboard/QuarterSelector'
import { PageHeader } from '@/components/shell/PageHeader'

const ACCENT = '#2A6FDB'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ quarter?: string }>
}) {
  const { quarter: qParam } = await searchParams
  const supabase = await createClient()

  // Fetch all quarters for the selector
  const { data: allQuarters } = await supabase
    .from('quarters')
    .select('id, fecha_inicio, fecha_fin, meta_dias, limite')
    .order('fecha_inicio', { ascending: false })

  const quarters = allQuarters ?? []
  const currentId = qParam ?? getCurrentQuarterId()

  // Find the quarter to display (fallback to first available)
  const quarter =
    quarters.find((q) => q.id === currentId) ??
    quarters[0]

  if (!quarter) {
    return (
      <div className="page-container">
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 22,
            padding: 32,
            textAlign: 'center',
            border: '0.5px solid #EEF1F5',
          }}
        >
          <p style={{ color: '#59616E', fontSize: 15 }}>
            No hay quarters configurados. Ejecuta el schema SQL en Supabase para comenzar.
          </p>
        </div>
      </div>
    )
  }

  // Parallel fetch
  const [{ data: viajes }, { data: festivosData }, { data: gastosData }] =
    await Promise.all([
      supabase
        .from('viajes')
        .select('id, fecha_llegada, fecha_salida, ciudad')
        .lte('fecha_llegada', quarter.fecha_fin)
        .gte('fecha_salida', quarter.fecha_inicio),
      supabase
        .from('festivos')
        .select('fecha, nombre')
        .gte('fecha', quarter.fecha_inicio)
        .lte('fecha', quarter.fecha_fin),
      supabase
        .from('gastos')
        .select('monto')
        .gte('fecha', quarter.fecha_inicio)
        .lte('fecha', quarter.fecha_fin),
    ])

  const viajesData = viajes ?? []
  const festivosMap = new Map(
    (festivosData ?? []).map((f) => [f.fecha, f.nombre])
  )
  const festivosSet = new Set(festivosMap.keys())

  // Compute days for the full quarter range
  const dias = buildDiasContables(
    quarter.fecha_inicio,
    quarter.fecha_fin,
    viajesData.map((v) => ({
      id: v.id,
      fechaLlegada: v.fecha_llegada,
      fechaSalida: v.fecha_salida,
    })),
    festivosMap
  )

  const cumplidos = countCumplidos(dias)
  const gastado = (gastosData ?? []).reduce(
    (s, g) => s + Number(g.monto),
    0
  )

  const disponibles = diasDisponiblesRestantes(
    new Date(),
    parseLocal(quarter.fecha_fin),
    festivosSet
  )

  const { faltan, holgura, nivel } = calcHolgura({
    meta: quarter.meta_dias,
    cumplidos,
    disponiblesRestantes: disponibles,
  })

  const cpd = costoPorDia(gastado, cumplidos)
  const proyeccion = proyeccionGasto({ gastado, faltan, cpd })
  const dNivel = dineroNivel(proyeccion, quarter.limite)

  const titulo = quarterTitle(quarter.fecha_inicio, quarter.fecha_fin)

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
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
              Dashboard
            </h1>
            <p
              style={{
                fontSize: 14,
                color: '#949BA6',
                fontWeight: 500,
                margin: '4px 0 0',
              }}
            >
              {titulo} · {quarterLabel(quarter.id)}
            </p>
          </div>
          <QuarterSelector quarters={quarters} currentId={quarter.id} />
        </div>
      </div>

      {/* Screens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <RhythmHero
          nivel={nivel}
          faltan={faltan}
          disponibles={disponibles}
          holgura={holgura}
          meta={quarter.meta_dias}
          fechaFin={quarter.fecha_fin}
        />

        <DayProgressCard
          cumplidos={cumplidos}
          meta={quarter.meta_dias}
          nivel={nivel}
          accent={ACCENT}
        />

        <BudgetCard
          gastado={gastado}
          proyeccion={proyeccion}
          limite={quarter.limite ?? null}
          nivel={dNivel}
        />

        <MiniStats
          cumplidos={cumplidos}
          meta={quarter.meta_dias}
          nViajes={viajesData.length}
          costoPorDia={cpd}
        />
      </div>
    </div>
  )
}
