import { createClient } from '@/lib/supabase/server'
import { getCurrentQuarterId, parseLocal, formatYMD, quarterBoundsFromId } from '@/lib/domain/quarters'
import { buildDiasContables } from '@/lib/domain/diasContables'
import { diasCumplidos, DEFAULT_META_DIAS } from '@/lib/domain/calculos'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { CalLegend } from '@/components/calendario/CalLegend'
import { CalendarioClient } from '@/components/calendario/CalendarioClient'
import { QuarterNav } from '@/components/shell/QuarterNav'

const ACCENT_NORMAL = '#2A6FDB'
const ACCENT_FUTURE = '#7C3AED'

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ quarter?: string }>
}) {
  const { quarter: qParam } = await searchParams
  const quarterId = qParam ?? getCurrentQuarterId()
  const supabase = await createClient()

  const [{ data: quarterDb }, { data: viajes }, { data: festivosData }, { data: gastosData }] =
    await Promise.all([
      supabase
        .from('quarters')
        .select('id, fecha_inicio, fecha_fin, meta_dias')
        .eq('id', quarterId)
        .single(),
      supabase
        .from('viajes')
        .select('id, fecha_llegada, fecha_salida, ciudad'),
      supabase.from('festivos').select('fecha, nombre, origen'),
      supabase
        .from('gastos')
        .select('id, monto, categoria, fecha, nota, viaje_id'),
    ])

  // Fallback: reconstruct quarter from ID even if not in DB (future quarters)
  const quarter = quarterDb ?? {
    id: quarterId,
    ...quarterBoundsFromId(quarterId),
    meta_dias: DEFAULT_META_DIAS,
    limite: null,
  }

  // Detect if this is a future quarter
  const todayStr = formatYMD(new Date())
  const isFuture = quarter.fecha_inicio > todayStr
  const ACCENT = isFuture ? ACCENT_FUTURE : ACCENT_NORMAL

  const festivosMap = new Map(
    (festivosData ?? []).map((f) => [f.fecha as string, f.nombre as string])
  )
  const festivosList = (festivosData ?? []) as {
    fecha: string
    nombre: string
    origen: 'ley' | 'empresa' | 'personal'
  }[]

  const viajesData = (viajes ?? []).map((v) => ({
    id: v.id,
    ciudad: v.ciudad,
    fechaLlegada: v.fecha_llegada,
    fechaSalida: v.fecha_salida,
  }))

  const dias = buildDiasContables(
    quarter.fecha_inicio,
    quarter.fecha_fin,
    viajesData,
    festivosMap
  )

  const cumplidos = diasCumplidos(dias)

  // Full gastos for the quarter (by fecha del gasto)
  const gastosCompletos = (gastosData ?? []).map((g) => ({
    id: g.id,
    monto: Number(g.monto),
    categoria: g.categoria as string,
    fecha: g.fecha as string,
    nota: g.nota ?? undefined,
    viaje_id: g.viaje_id ?? undefined,
  }))

  const gastoFechas = new Set(gastosCompletos.map((g) => g.fecha))

  // Build months array for this quarter
  const startD = parseLocal(quarter.fecha_inicio)
  const endD = parseLocal(quarter.fecha_fin)
  const months: { year: number; month: number }[] = []
  let cur = new Date(startD.getFullYear(), startD.getMonth(), 1)
  while (cur <= endD) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() })
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
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
              Calendario
            </h1>
            {isFuture && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: ACCENT_FUTURE,
                background: ACCENT_FUTURE + '12',
                padding: '3px 9px',
                borderRadius: 999,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}>
                Futuro
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, color: isFuture ? ACCENT_FUTURE : '#949BA6', fontWeight: 500, margin: 0 }}>
            {quarterId.replace('-', ' · ')}
          </p>
        </div>
        <QuarterNav currentId={quarterId} isFuture={isFuture} />
      </div>

      {/* Summary card */}
      <Card pad={16} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: '#949BA6', fontWeight: 600 }}>
              Días contables · {quarterId.replace('-', ' · ')}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 760,
                color: '#181B21',
                letterSpacing: -0.6,
                marginTop: 2,
              }}
            >
              {cumplidos}{' '}
              <span style={{ fontSize: 16, color: '#949BA6', fontWeight: 600 }}>
                / {quarter.meta_dias}
              </span>
            </div>
          </div>
          <Pill level="verde">
            {viajesData.length} viaje{viajesData.length !== 1 ? 's' : ''}
          </Pill>
        </div>
      </Card>

      {/* Legend card */}
      <Card pad={16} style={{ marginBottom: 14 }}>
        <CalLegend accent={ACCENT} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid #EEF1F5',
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 5,
              background: ACCENT + '14',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: 99, background: '#E0903B' }} />
          </span>
          <span style={{ fontSize: 12.5, color: '#59616E', fontWeight: 540 }}>
            Toca un día para ver sus gastos o agregar uno nuevo.
          </span>
        </div>
      </Card>

      <CalendarioClient
        months={months}
        diasContables={dias}
        festivos={festivosList}
        gastos={gastosCompletos}
        viajes={viajesData}
        gastoFechas={gastoFechas}
        todayStr={todayStr}
        quarterId={quarterId}
        accent={ACCENT}
      />
    </div>
  )
}
