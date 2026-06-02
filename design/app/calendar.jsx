/* ============================================================
   Calendario por quarter
   Viajes como bloques · días que cuentan resaltados ·
   domingos y festivos en gris · festivos etiquetados
   ============================================================ */

function dayState(dateStr) {
  const d = TRK.parseD(dateStr);
  const isSun = d.getDay() === 0;
  const hol = TRK.isHoliday(dateStr);
  let trip = null;
  for (const t of TRK.TRIPS) {
    if (TRK.parseD(t.llegada) <= d && d <= TRK.parseD(t.salida)) { trip = t; break; }
  }
  let estado;
  if (trip && !isSun && !hol) estado = 'cuenta';
  else if (hol) estado = 'festivo';
  else if (isSun) estado = 'domingo';
  else estado = 'libre';
  return { estado, trip, hol, isSun, isToday: TRK.sameDay(dateStr, TRK.TODAY) };
}

function MonthGrid({ year, month, accent, onDay }) {
  const first = new Date(year, month, 1);
  const startCol = (first.getDay() + 6) % 7; // Lun-first
  const nDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= nDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthHols = TRK.HOLIDAYS.filter((h) => { const hd = TRK.parseD(h.fecha); return hd.getFullYear() === year && hd.getMonth() === month; });

  return (
    <div>
      <div style={{ fontSize: 17, fontWeight: 740, color: C.ink, letterSpacing: -0.3, marginBottom: 12, textTransform: 'capitalize' }}>
        {TRK.MESES_L[month]} <span style={{ color: C.ink3, fontWeight: 600 }}>{year}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 6 }}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: i === 6 ? C.ink3 : C.ink2 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />;
          const ds = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
          const st = dayState(ds);
          const hasGasto = TRK.EXPENSES.some((e) => TRK.sameDay(e.fecha, ds));
          let bg = 'transparent', col = C.ink, weight = 500, ring = 'none';
          if (st.estado === 'cuenta') { bg = accent; col = '#fff'; weight = 700; }
          else if (st.estado === 'festivo') { bg = '#EFF1F4'; col = C.ink3; weight = 600; }
          else if (st.estado === 'domingo') { col = C.ink3; }
          if (st.isToday) ring = '0 0 0 2px ' + accent;
          return (
            <button key={i} onClick={() => onDay && onDay(ds)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 11, background: bg, color: col, fontWeight: weight,
                fontSize: 14.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontVariantNumeric: 'tabular-nums', boxShadow: ring, transition: 'background .3s',
                position: 'relative',
              }}>
                {d}
                {st.estado === 'festivo' && <span style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 99, background: C.ink3 }} />}
              </div>
              <span style={{ height: 7, marginTop: 2, display: 'flex', alignItems: 'center' }}>
                {hasGasto && <span style={{ width: 5, height: 5, borderRadius: 99, background: st.estado === 'cuenta' ? accent : TRK.CAT.comida.color }} />}
              </span>
            </button>
          );
        })}
      </div>
      {monthHols.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {monthHols.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: C.ink3, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: C.ink2, fontWeight: 560 }}>{TRK.parseD(h.fecha).getDate()} {TRK.MESES[month]} · {h.nombre}</span>
              <span style={{
                fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3,
                color: h.origen === 'ley' ? C.ink3 : (h.origen === 'empresa' ? accent : '#9A7BD0'),
                background: h.origen === 'empresa' ? accent + '14' : C.line2, padding: '2px 7px', borderRadius: 6,
              }}>{h.origen}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CalLegend({ accent }) {
  const items = [
    { c: accent, label: 'Cuenta' },
    { c: '#EFF1F4', label: 'Festivo', dot: true },
    { c: 'transparent', label: 'Domingo', muted: true },
    { c: 'transparent', label: 'Hoy', ring: accent },
  ];
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '2px 2px 4px' }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            width: 16, height: 16, borderRadius: 5, background: it.c,
            boxShadow: it.ring ? '0 0 0 2px ' + it.ring : 'none',
            border: it.muted ? '1px solid ' + C.line : 'none', position: 'relative',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {it.dot && <span style={{ width: 4, height: 4, borderRadius: 99, background: C.ink3 }} />}
            {it.muted && <span style={{ fontSize: 9, color: C.ink3 }}>D</span>}
          </span>
          <span style={{ fontSize: 12.5, color: C.ink2, fontWeight: 560 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function Calendar({ accent, onDay }) {
  const c = TRK.cumplidos();
  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card pad={16}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: C.ink3, fontWeight: 600 }}>Días contables · {TRK.QUARTER.label}</div>
            <div style={{ fontSize: 26, fontWeight: 760, color: C.ink, letterSpacing: -0.6, marginTop: 2 }}>{c} <span style={{ fontSize: 16, color: C.ink3, fontWeight: 600 }}>/ {TRK.QUARTER.meta}</span></div>
          </div>
          <Pill level="verde">{TRK.TRIPS.length} viajes</Pill>
        </div>
      </Card>
      <Card pad={16}>
        <CalLegend accent={accent} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, paddingTop: 12, borderTop: '1px solid ' + C.line2 }}>
          <span style={{ width: 16, height: 16, borderRadius: 5, background: accent + '14', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={11} color={accent} stroke={2.6} />
          </span>
          <span style={{ fontSize: 12.5, color: C.ink2, fontWeight: 540 }}>Toca un día para ver y agregar gastos · <span style={{ color: C.ink3 }}>el punto marca días con gasto</span></span>
        </div>
      </Card>
      <Card pad={18}><MonthGrid year={2025} month={9} accent={accent} onDay={onDay} /></Card>
      <Card pad={18}><MonthGrid year={2025} month={10} accent={accent} onDay={onDay} /></Card>
      <Card pad={18}><MonthGrid year={2025} month={11} accent={accent} onDay={onDay} /></Card>
    </div>
  );
}

Object.assign(window, { Calendar, dayState });
