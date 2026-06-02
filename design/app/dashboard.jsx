/* ============================================================
   Dashboard — pantalla estrella
   Ritmo/holgura prominente + 3 visualizaciones de progreso
   ============================================================ */

function RhythmHero({ s, accent }) {
  const n = NIV[s.diasNivel];
  const finTxt = (() => { const f = TRK.parseD(TRK.QUARTER.fin); return f.getDate() + ' ' + TRK.MESES[f.getMonth()]; })();
  const head = { verde: 'Vas bien.', amarillo: 'Vas justo.', rojo: 'Vas atrasado.' }[s.diasNivel];
  const sub = {
    verde: 'Al ritmo actual cumples los ' + s.meta + ' días con margen de sobra.',
    amarillo: 'Aún puedes cumplir, pero casi sin margen. Cuida cada día.',
    rojo: 'Con los días disponibles ya no alcanzas la meta. Necesitas un plan.',
  }[s.diasNivel];
  const tag = { verde: 'Factible', amarillo: 'Apretado', rojo: 'En riesgo' }[s.diasNivel];

  // gauge: base = disponibles; relleno = faltan; resto = holgura
  const base = Math.max(s.disponibles, s.faltan);
  const needFrac = Math.min(1, s.faltan / base);
  const overflow = s.holgura < 0;

  return (
    <div style={{
      background: n.bg, borderRadius: 24, padding: 20,
      border: '0.5px solid ' + n.dot + '33',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name={s.diasNivel === 'rojo' ? 'alert' : 'spark'} size={18} color={n.fg} stroke={2.1} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: n.fg, letterSpacing: 0.3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Ritmo del quarter</span>
        </div>
        <Pill level={s.diasNivel}><span style={{ width: 6, height: 6, borderRadius: 99, background: n.dot, display: 'inline-block' }} />{tag}</Pill>
      </div>

      <div style={{ fontSize: 27, fontWeight: 770, color: C.ink, letterSpacing: -0.7, lineHeight: 1.05 }}>{head}</div>
      <div style={{ fontSize: 15, color: C.ink2, marginTop: 7, lineHeight: 1.4, fontWeight: 480 }}>{sub}</div>

      {/* frase de datos */}
      <div style={{ fontSize: 15, color: C.ink, marginTop: 14, lineHeight: 1.5, fontWeight: 500 }}>
        Te faltan <b style={{ fontWeight: 760 }}>{s.faltan} días</b> y tienes <b style={{ fontWeight: 760 }}>{s.disponibles} disponibles</b> antes del {finTxt}.
      </div>

      {/* gauge holgura */}
      <div style={{ marginTop: 14 }}>
        <div style={{ position: 'relative', height: 12, borderRadius: 7, background: '#fff', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px ' + n.dot + '22' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (needFrac * 100) + '%', background: overflow ? NIV.rojo.dot : C.ink, opacity: overflow ? 1 : 0.82, borderRadius: 7 }} />
          {!overflow && (
            <div style={{ position: 'absolute', left: (needFrac * 100) + '%', top: 0, bottom: 0, right: 0, background: n.dot, opacity: 0.5 }} />
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12.5, color: C.ink2, fontWeight: 560, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: C.ink, opacity: .82 }} />Necesitas {s.faltan}
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 720, color: n.fg }}>
            Holgura {s.holgura >= 0 ? '+' : ''}{s.holgura} días
          </span>
        </div>
      </div>
    </div>
  );
}

function DayProgressCard({ s, accent, viz, setViz }) {
  return (
    <Card pad={18}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 720, color: C.ink, letterSpacing: -0.3 }}>Días en oficina</div>
          <div style={{ fontSize: 13, color: C.ink3, marginTop: 1, fontWeight: 500, whiteSpace: 'nowrap' }}>Lun–Sáb · {s.meta} días = 6 semanas</div>
        </div>
        <Pill level={s.diasNivel}>{Math.round(s.cumplidos / s.meta * 100)}%</Pill>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Segmented
          accent={accent}
          value={viz}
          onChange={setViz}
          options={[{ value: 'anillo', label: 'Anillo' }, { value: 'semanas', label: 'Semanas' }, { value: 'barra', label: 'Barra' }]}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', minHeight: viz === 'anillo' ? 188 : 'auto', alignItems: 'center', padding: viz === 'anillo' ? '4px 0' : '4px 2px' }}>
        {viz === 'anillo' && <RingViz value={s.cumplidos} max={s.meta} accent={accent} />}
        {viz === 'semanas' && <WeeksViz value={s.cumplidos} accent={accent} />}
        {viz === 'barra' && <BarViz value={s.cumplidos} max={s.meta} accent={accent} />}
      </div>
    </Card>
  );
}

function BudgetCard({ s, onNav }) {
  const n = NIV[s.dineroNivel];
  const frac = Math.min(1, s.gastado / s.limite);
  const projFrac = s.proyeccion != null ? Math.min(1, s.proyeccion / s.limite) : 0;
  const msg = { verde: 'Dentro de presupuesto.', amarillo: 'Cerca del límite.', rojo: 'Te pasas del límite.' }[s.dineroNivel];
  return (
    <Card pad={18} onClick={() => onNav('gastos')}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 720, color: C.ink, letterSpacing: -0.3 }}>Presupuesto</div>
        <Pill level={s.dineroNivel}>{msg}</Pill>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
        <span style={{ fontSize: 30, fontWeight: 760, color: C.ink, letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums' }}>{TRK.money(s.gastado)}</span>
        <span style={{ fontSize: 14, color: C.ink3, fontWeight: 560 }}>de {TRK.money(s.limite, false)}</span>
      </div>

      {/* barra con marcador de proyección */}
      <div style={{ position: 'relative', height: 12, borderRadius: 7, background: C.track, overflow: 'hidden', marginTop: 13 }}>
        <div style={{ position: 'absolute', inset: 0, width: (projFrac * 100) + '%', background: n.bg }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (frac * 100) + '%', background: n.dot, borderRadius: 7 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, color: C.ink2, fontWeight: 540 }}>
          Proyección <b style={{ color: n.fg, fontWeight: 720 }}>{s.proyeccion != null ? TRK.money(s.proyeccion, false) : '—'}</b> <span style={{ color: C.ink3 }}>est.</span>
        </span>
        <Icon name="chevR" size={16} color={C.ink3} />
      </div>
    </Card>
  );
}

function MiniStats({ s }) {
  const items = [
    { label: 'Costo por día', value: s.costoDia != null ? TRK.money(s.costoDia) : '—', sub: 'gasto ÷ días' },
    { label: 'Días cumplidos', value: s.cumplidos + ' / ' + s.meta, sub: TRK.TRIPS.length + ' viajes' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {items.map((it, i) => (
        <Card key={i} pad={16}>
          <div style={{ fontSize: 12.5, color: C.ink3, fontWeight: 600, letterSpacing: 0.1 }}>{it.label}</div>
          <div style={{ fontSize: 23, fontWeight: 760, color: C.ink, letterSpacing: -0.6, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{it.value}</div>
          <div style={{ fontSize: 12, color: C.ink3, marginTop: 2, fontWeight: 500 }}>{it.sub}</div>
        </Card>
      ))}
    </div>
  );
}

function Dashboard({ s, accent, viz, setViz, onNav }) {
  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <RhythmHero s={s} accent={accent} />
      <DayProgressCard s={s} accent={accent} viz={viz} setViz={setViz} />
      <BudgetCard s={s} onNav={onNav} />
      <MiniStats s={s} />
    </div>
  );
}

Object.assign(window, { Dashboard });
