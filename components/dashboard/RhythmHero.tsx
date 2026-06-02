import { Icon } from '@/components/ui/Icon'
import { Pill, NIV } from '@/components/ui/Pill'
import type { Nivel } from '@/components/ui/Pill'
import { MESES } from '@/lib/domain/quarters'
import { parseLocal } from '@/lib/domain/quarters'

interface RhythmHeroProps {
  nivel: Nivel
  faltan: number
  disponibles: number
  holgura: number
  meta: number
  fechaFin: string
}

const HEADS: Record<Nivel, string> = {
  verde: 'Vas bien.',
  amarillo: 'Vas justo.',
  rojo: 'Vas atrasado.',
}
const SUBS: Record<Nivel, string> = {
  verde: (meta: number) => `Al ritmo actual cumples los ${meta} días con margen de sobra.`,
  amarillo: () => 'Aún puedes cumplir, pero casi sin margen. Cuida cada día.',
  rojo: () => 'Con los días disponibles ya no alcanzas la meta. Necesitas un plan.',
} as unknown as Record<Nivel, string>
const TAGS: Record<Nivel, string> = {
  verde: 'Factible',
  amarillo: 'Apretado',
  rojo: 'En riesgo',
}

export function RhythmHero({
  nivel,
  faltan,
  disponibles,
  holgura,
  meta,
  fechaFin,
}: RhythmHeroProps) {
  const n = NIV[nivel]
  const finD = parseLocal(fechaFin)
  const finTxt = `${finD.getDate()} ${MESES[finD.getMonth()]}`
  const head = HEADS[nivel]
  const sub = nivel === 'verde'
    ? `Al ritmo actual cumples los ${meta} días con margen de sobra.`
    : nivel === 'amarillo'
    ? 'Aún puedes cumplir, pero casi sin margen. Cuida cada día.'
    : 'Con los días disponibles ya no alcanzas la meta. Necesitas un plan.'
  const tag = TAGS[nivel]

  const base = Math.max(disponibles, faltan)
  const needFrac = base > 0 ? Math.min(1, faltan / base) : 0
  const overflow = holgura < 0

  return (
    <div
      style={{
        background: n.bg,
        borderRadius: 24,
        padding: 20,
        border: `0.5px solid ${n.dot}33`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 13,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon
            name={nivel === 'rojo' ? 'alert' : 'spark'}
            size={18}
            color={n.fg}
            stroke={2.1}
          />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: n.fg,
              letterSpacing: 0.3,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Ritmo del quarter
          </span>
        </div>
        <Pill level={nivel}>{tag}</Pill>
      </div>

      <div
        className="rhythm-headline"
        style={{
          fontWeight: 770,
          color: '#181B21',
          letterSpacing: -0.7,
          lineHeight: 1.05,
        }}
      >
        {head}
      </div>
      <div
        style={{
          fontSize: 15,
          color: '#59616E',
          marginTop: 7,
          lineHeight: 1.4,
          fontWeight: 480,
        }}
      >
        {sub}
      </div>

      <div
        style={{
          fontSize: 15,
          color: '#181B21',
          marginTop: 14,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        Te faltan{' '}
        <b style={{ fontWeight: 760 }}>{faltan} días</b> y tienes{' '}
        <b style={{ fontWeight: 760 }}>{disponibles} disponibles</b> antes del{' '}
        {finTxt}.
      </div>

      {/* gauge */}
      <div style={{ marginTop: 14 }}>
        <div
          style={{
            position: 'relative',
            height: 12,
            borderRadius: 7,
            background: '#fff',
            overflow: 'hidden',
            boxShadow: `inset 0 0 0 1px ${n.dot}22`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${needFrac * 100}%`,
              background: overflow ? NIV.rojo.dot : '#181B21',
              opacity: overflow ? 1 : 0.82,
              borderRadius: 7,
            }}
          />
          {!overflow && (
            <div
              style={{
                position: 'absolute',
                left: `${needFrac * 100}%`,
                top: 0,
                bottom: 0,
                right: 0,
                background: n.dot,
                opacity: 0.5,
              }}
            />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontSize: 12.5,
              color: '#59616E',
              fontWeight: 560,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: '#181B21',
                opacity: 0.82,
                display: 'inline-block',
              }}
            />
            Necesitas {faltan}
          </span>
          <span
            style={{ fontSize: 12.5, fontWeight: 720, color: n.fg }}
          >
            Holgura {holgura >= 0 ? '+' : ''}
            {holgura} días
          </span>
        </div>
      </div>
    </div>
  )
}
