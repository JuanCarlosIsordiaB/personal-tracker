import type { DiaContable } from '@/lib/domain/diasContables'
import { DIAS } from '@/lib/domain/festivos'
import { parseLocal } from '@/lib/domain/quarters'

interface DayStripProps {
  dias: DiaContable[]
  accent?: string
}

export function DayStrip({ dias, accent = '#2A6FDB' }: DayStripProps) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {dias.map((d, i) => {
        const isC = d.estado === 'cuenta'
        const dateNum = parseLocal(d.fecha).getDate()
        return (
          <div key={i} style={{ width: 26, textAlign: 'center' }}>
            <div
              style={{
                fontSize: 9.5,
                color: '#949BA6',
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              {DIAS[d.dow][0]}
            </div>
            <div
              style={{
                height: 26,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                background:
                  isC
                    ? accent
                    : d.estado === 'festivo'
                    ? '#EFF1F4'
                    : '#E9ECF1',
                color: isC ? '#fff' : '#949BA6',
              }}
            >
              {dateNum}
            </div>
          </div>
        )
      })}
    </div>
  )
}
