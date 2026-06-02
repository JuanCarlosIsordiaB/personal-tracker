/* ============================================================
   Viajes — lista + detalle (días contables, gastos, costo/día)
   ============================================================ */

function DayStrip({ trip, accent }) {
  const days = TRK.tripDays(trip);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {days.map((d, i) => {
        const isC = d.estado === 'cuenta';
        return (
          <div key={i} style={{
            width: 26, textAlign: 'center',
          }}>
            <div style={{ fontSize: 9.5, color: C.ink3, fontWeight: 600, marginBottom: 3 }}>{TRK.DIAS[d.dow][0]}</div>
            <div style={{
              height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              background: isC ? accent : (d.estado === 'festivo' ? '#EFF1F4' : C.track),
              color: isC ? '#fff' : C.ink3,
            }}>{TRK.parseD(d.fecha).getDate()}</div>
          </div>
        );
      })}
    </div>
  );
}

function TripCard({ trip, accent, onOpen }) {
  const cont = TRK.countableOf(trip);
  const total = TRK.tripTotal(trip.id);
  const q = TRK.quarterOf(trip.llegada);
  const perDay = cont ? total / cont : null;
  return (
    <Card onClick={() => onOpen(trip.id)} pad={16}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: accent + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="pin" size={19} color={accent} />
          </div>
          <div>
            <div style={{ fontSize: 16.5, fontWeight: 730, color: C.ink, letterSpacing: -0.3 }}>{trip.ciudad}</div>
            <div style={{ fontSize: 13, color: C.ink3, fontWeight: 540, marginTop: 1 }}>{TRK.fmtRange(trip.llegada, trip.salida)} · {q.label}</div>
          </div>
        </div>
        <Pill level="verde">{cont} días</Pill>
      </div>

      <DayStrip trip={trip} accent={accent} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 13, borderTop: '1px solid ' + C.line2 }}>
        <div>
          <span style={{ fontSize: 17, fontWeight: 740, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{TRK.money(total)}</span>
          <span style={{ fontSize: 13, color: C.ink3, fontWeight: 540 }}> total</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: C.ink2, fontWeight: 600 }}>{perDay != null ? TRK.money(perDay) : '—'}<span style={{ color: C.ink3, fontWeight: 500 }}> /día</span></span>
          <Icon name="chevR" size={16} color={C.ink3} />
        </div>
      </div>
    </Card>
  );
}

function TripsList({ accent, onOpen, onAdd }) {
  const totalDays = TRK.cumplidos();
  const totalCost = TRK.TRIPS.reduce((s, t) => s + TRK.tripTotal(t.id), 0);
  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      <Card pad={16}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: C.ink3, fontWeight: 600 }}>{TRK.TRIPS.length} viajes · {TRK.QUARTER.label}</div>
            <div style={{ fontSize: 20, fontWeight: 760, color: C.ink, letterSpacing: -0.5, marginTop: 2, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{totalDays} días · {TRK.money(totalCost, false)}</div>
          </div>
          <button onClick={onAdd} style={{ border: 'none', background: accent, color: '#fff', borderRadius: 12, height: 40, padding: '0 14px', fontSize: 14, fontWeight: 680, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="plus" size={17} color="#fff" stroke={2.4} />Viaje
          </button>
        </div>
      </Card>
      {TRK.TRIPS.map((t) => <TripCard key={t.id} trip={t} accent={accent} onOpen={onOpen} />)}
    </div>
  );
}

function TripDetail({ tripId, accent, onAddExpense, onDay }) {
  const trip = TRK.TRIPS.find((t) => t.id === tripId);
  const days = TRK.tripDays(trip);
  const cont = TRK.countableOf(trip);
  const exps = TRK.expensesOf(trip.id);
  const total = TRK.tripTotal(trip.id);
  const perDay = cont ? total / cont : null;
  const q = TRK.quarterOf(trip.llegada);

  const stLabel = { cuenta: 'Cuenta', domingo: 'Domingo', festivo: 'Festivo', 'fuera-de-viaje': 'Fuera' };

  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* resumen */}
      <Card pad={18}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: accent + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="pin" size={22} color={accent} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 760, color: C.ink, letterSpacing: -0.4 }}>{trip.ciudad}</div>
            <div style={{ fontSize: 13.5, color: C.ink3, fontWeight: 540 }}>{TRK.fmtMed(trip.llegada)} → {TRK.fmtMed(trip.salida)}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
          {[
            { l: 'Días', v: cont, q: q.label },
            { l: 'Total', v: TRK.money(total, false), q: exps.length + ' gastos' },
            { l: 'Costo/día', v: perDay != null ? TRK.money(perDay, false) : '—', q: 'gasto ÷ días' },
          ].map((it, i) => (
            <div key={i} style={{ textAlign: i === 0 ? 'left' : 'center', borderLeft: i ? '1px solid ' + C.line2 : 'none', paddingLeft: i ? 6 : 0 }}>
              <div style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>{it.l}</div>
              <div style={{ fontSize: 19, fontWeight: 760, color: C.ink, letterSpacing: -0.4, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>{it.v}</div>
              <div style={{ fontSize: 10.5, color: C.ink3, fontWeight: 500, marginTop: 1 }}>{it.q}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* días */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink2, textTransform: 'uppercase', letterSpacing: 0.3, padding: '0 4px 9px' }}>Días del viaje</div>
        <Card pad={0}>
          {days.map((d, i) => {
            const isC = d.estado === 'cuenta';
            return (
              <button key={i} onClick={() => onDay && onDay(d.fecha)} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < days.length - 1 ? '1px solid ' + C.line2 : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: isC ? accent : '#F0F2F5', color: isC ? '#fff' : C.ink3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 740, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{TRK.parseD(d.fecha).getDate()}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{TRK.DIAS_L[d.dow]}</div>
                  {d.holiday && <div style={{ fontSize: 12.5, color: C.ink3, fontWeight: 500 }}>{d.holiday.nombre}</div>}
                </div>
                {isC
                  ? <Pill level="verde"><Icon name="check" size={13} color={NIV.verde.fg} stroke={2.6} />Cuenta</Pill>
                  : <span style={{ fontSize: 12.5, fontWeight: 640, color: C.ink3, background: C.line2, padding: '4px 11px', borderRadius: 999 }}>{stLabel[d.estado]}</span>}
                <Icon name="chevR" size={15} color={C.ink3} style={{ marginLeft: 2 }} />
              </button>
            );
          })}
        </Card>
      </div>

      {/* gastos */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 9px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink2, textTransform: 'uppercase', letterSpacing: 0.3 }}>Gastos del viaje</div>
          <button onClick={() => onAddExpense(trip.id)} style={{ border: 'none', background: 'transparent', color: accent, fontSize: 14, fontWeight: 680, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: 0 }}>
            <Icon name="plus" size={16} color={accent} stroke={2.3} />Agregar
          </button>
        </div>
        <Card pad={0}>
          {exps.map((e, i) => <ExpenseRow key={e.id} e={e} last={i === exps.length - 1} />)}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { TripsList, TripDetail, DayStrip, TripCard });
