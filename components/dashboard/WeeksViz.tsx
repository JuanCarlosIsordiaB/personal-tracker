interface WeeksVizProps {
  value: number
  accent?: string
}

export function WeeksViz({ value, accent = '#2A6FDB' }: WeeksVizProps) {
  const weeks = 8
  const perWeek = 5
  const cells: boolean[] = []
  for (let i = 0; i < weeks * perWeek; i++) cells.push(i < value)
  const dl = ['L', 'M', 'M', 'J', 'V']

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: 9,
          paddingLeft: 30,
          marginBottom: 8,
        }}
      >
        {dl.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: '#949BA6',
            }}
          >
            {d}
          </div>
        ))}
      </div>
      {Array.from({ length: weeks }).map((_, w) => (
        <div
          key={w}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            marginBottom: w < weeks - 1 ? 8 : 0,
          }}
        >
          <div
            style={{
              width: 21,
              fontSize: 11,
              fontWeight: 600,
              color: '#949BA6',
              textAlign: 'right',
            }}
          >
            S{w + 1}
          </div>
          {Array.from({ length: perWeek }).map((__, d) => {
            const on = cells[w * perWeek + d]
            return (
              <div
                key={d}
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 6,
                  background: on ? accent : '#E9ECF1',
                  transition: 'background .4s',
                  transitionDelay: `${(w * perWeek + d) * 12}ms`,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
