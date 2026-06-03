import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buildDiasParaViaje } from '@/lib/domain/diasContables'
import { money } from '@/lib/domain/calculos'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { Icon } from '@/components/ui/Icon'
import { MESES, parseLocal } from '@/lib/domain/quarters'
import { DIAS_L } from '@/lib/domain/festivos'
import { TripGastosClient } from '@/components/viajes/TripGastosClient'

const ACCENT = '#2A6FDB'

function fmtMed(s: string): string {
  const d = parseLocal(s)
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: viaje }, { data: gastos }, { data: festivosData }, { data: todosViajes }] =
    await Promise.all([
      supabase
        .from('viajes')
        .select('*')
        .eq('id', id)
        .single(),
      supabase
        .from('gastos')
        .select('*')
        .eq('viaje_id', id)
        .order('fecha', { ascending: false }),
      supabase.from('festivos').select('fecha, nombre'),
      supabase
        .from('viajes')
        .select('id, ciudad, fecha_llegada, fecha_salida')
        .order('fecha_llegada', { ascending: true }),
    ])

  if (!viaje) notFound()

  const festivosMap = new Map(
    (festivosData ?? []).map((f) => [f.fecha as string, f.nombre as string])
  )

  const dias = buildDiasParaViaje(
    {
      id: viaje.id,
      fechaLlegada: viaje.fecha_llegada,
      fechaSalida: viaje.fecha_salida,
    },
    festivosMap
  )

  const contables = dias.filter((d) => d.estado === 'cuenta').length
  const totalGasto = (gastos ?? []).reduce(
    (s, g) => s + Number(g.monto),
    0
  )
  const perDay = contables > 0 ? totalGasto / contables : null

  const stLabel: Record<string, string> = {
    cuenta: 'Cuenta',
    domingo: 'Domingo',
    festivo: 'Festivo',
    'fuera-de-viaje': 'Fuera',
  }

  const gastosData = (gastos ?? []).map((g) => ({
    id: g.id as string,
    monto: Number(g.monto),
    categoria: g.categoria as string,
    fecha: g.fecha as string,
    nota: g.nota as string | null,
    viaje_id: g.viaje_id as string | null,
  }))

  const viajesData = (todosViajes ?? []).map((v) => ({
    id: v.id as string,
    ciudad: v.ciudad as string,
    fechaLlegada: v.fecha_llegada as string,
    fechaSalida: v.fecha_salida as string,
  }))

  return (
    <div className="page-container">
      {/* Back */}
      <Link
        href="/viajes"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 14,
          fontWeight: 600,
          color: '#2A6FDB',
          textDecoration: 'none',
          marginBottom: 20,
        }}
      >
        <Icon name="chevL" size={16} color="#2A6FDB" />
        Viajes
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Summary */}
        <Card pad={18}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: ACCENT + '14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="pin" size={22} color={ACCENT} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 760,
                  color: '#181B21',
                  letterSpacing: -0.4,
                }}
              >
                {viaje.ciudad}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: '#949BA6',
                  fontWeight: 540,
                }}
              >
                {fmtMed(viaje.fecha_llegada)} → {fmtMed(viaje.fecha_salida)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 4,
            }}
          >
            {[
              { l: 'Días', v: String(contables), q: 'contables' },
              {
                l: 'Total',
                v: money(totalGasto, false),
                q: `${(gastos ?? []).length} gastos`,
              },
              {
                l: 'Costo/día',
                v: perDay != null ? money(perDay, false) : '—',
                q: 'gasto ÷ días',
              },
            ].map((it, i) => (
              <div
                key={i}
                style={{
                  textAlign: i === 0 ? 'left' : 'center',
                  borderLeft: i ? `1px solid #EEF1F5` : 'none',
                  paddingLeft: i ? 6 : 0,
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#949BA6',
                    fontWeight: 600,
                  }}
                >
                  {it.l}
                </div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 760,
                    color: '#181B21',
                    letterSpacing: -0.4,
                    marginTop: 3,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {it.v}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: '#949BA6',
                    fontWeight: 500,
                    marginTop: 1,
                  }}
                >
                  {it.q}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Days */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#59616E',
              textTransform: 'uppercase',
              letterSpacing: 0.3,
              padding: '0 4px 9px',
            }}
          >
            Días del viaje
          </div>
          <Card pad={0}>
            {dias.map((d, i) => {
              const isC = d.estado === 'cuenta'
              const dateNum = parseLocal(d.fecha).getDate()
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom:
                      i < dias.length - 1 ? '1px solid #EEF1F5' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: isC ? ACCENT : '#F0F2F5',
                      color: isC ? '#fff' : '#949BA6',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 740,
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {dateNum}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#181B21',
                      }}
                    >
                      {DIAS_L[d.dow]}
                    </div>
                    {d.festivoNombre && (
                      <div
                        style={{
                          fontSize: 12.5,
                          color: '#949BA6',
                          fontWeight: 500,
                        }}
                      >
                        {d.festivoNombre}
                      </div>
                    )}
                  </div>
                  {isC ? (
                    <Pill level="verde">
                      <Icon
                        name="check"
                        size={13}
                        color="#138A4E"
                        stroke={2.6}
                      />
                      Cuenta
                    </Pill>
                  ) : (
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 640,
                        color: '#949BA6',
                        background: '#EEF1F5',
                        padding: '4px 11px',
                        borderRadius: 999,
                      }}
                    >
                      {stLabel[d.estado]}
                    </span>
                  )}
                </div>
              )
            })}
          </Card>
        </div>

        {/* Expenses */}
        <TripGastosClient
          gastos={gastosData}
          viajeId={id}
          viajes={viajesData}
        />
      </div>
    </div>
  )
}
