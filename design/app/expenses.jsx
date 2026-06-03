/* ============================================================
   Gastos — lista, desglose por categoría y filtros
   ============================================================ */

function ExpenseRow({ e, last, showTrip, onEdit }) {
  const cat = TRK.CAT[e.cat];
  const trip = e.tripId ? TRK.TRIPS.find((t) => t.id === e.tripId) : null;
  return (
    <div
      onClick={onEdit ? () => onEdit(e.id) : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: last ? 'none' : '1px solid ' + C.line2, cursor: onEdit ? 'pointer' : 'default' }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 11, background: cat.color + '16', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <CatIcon cat={e.cat} size={19} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.nota || cat.label}</div>
        <div style={{ fontSize: 12.5, color: C.ink3, fontWeight: 540, marginTop: 1 }}>
          {cat.label} · {TRK.fmtShort(e.fecha)}{showTrip && trip ? ' · ' + trip.ciudad : ''}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{TRK.money(e.monto)}</div>
        {onEdit && <Icon name="chevR" size={15} color={C.ink3} />}
      </div>
    </div>
  );
}

function CatBreakdown({ totals, total, accent }) {
  const order = ['hospedaje', 'avion', 'comida', 'extra'];
  return (
    <Card pad={18}>
      <div style={{ fontSize: 13, color: C.ink3, fontWeight: 600 }}>Gastado · {TRK.QUARTER.label}</div>
      <div style={{ fontSize: 32, fontWeight: 770, color: C.ink, letterSpacing: -0.9, marginTop: 2, marginBottom: 14, fontVariantNumeric: 'tabular-nums' }}>{TRK.money(total)}</div>
      {/* barra apilada */}
      <div style={{ display: 'flex', height: 12, borderRadius: 7, overflow: 'hidden', marginBottom: 16 }}>
        {order.map((k) => (
          <div key={k} style={{ width: (totals[k] / total * 100) + '%', background: TRK.CAT[k].color }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
        {order.map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: TRK.CAT[k].color, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: C.ink2, fontWeight: 560, flex: 1 }}>{TRK.CAT[k].label}</span>
            <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 680, fontVariantNumeric: 'tabular-nums' }}>{TRK.money(totals[k], false)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Expenses({ accent, onAdd, onEditExpense }) {
  const [filter, setFilter] = React.useState('todos');
  const totals = TRK.catTotals();
  const total = TRK.gastado();
  const filtered = TRK.EXPENSES
    .filter((e) => filter === 'todos' || e.cat === filter)
    .slice()
    .sort((a, b) => TRK.parseD(b.fecha) - TRK.parseD(a.fecha));

  const chips = [
    { value: 'todos', label: 'Todos' },
    { value: 'hospedaje', label: 'Hospedaje' },
    { value: 'avion', label: 'Avión' },
    { value: 'comida', label: 'Comida' },
    { value: 'extra', label: 'Extra' },
  ];

  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <CatBreakdown totals={totals} total={total} accent={accent} />

      {/* filtros */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 0 2px', margin: '0 -16px', paddingLeft: 16, paddingRight: 16 }}>
        {chips.map((ch) => {
          const on = ch.value === filter;
          return (
            <button key={ch.value} onClick={() => setFilter(ch.value)} style={{
              flexShrink: 0, border: 'none', cursor: 'pointer', borderRadius: 999,
              padding: '9px 15px', fontSize: 13.5, fontWeight: 640, fontFamily: 'inherit',
              background: on ? C.ink : C.card, color: on ? '#fff' : C.ink2,
              boxShadow: on ? 'none' : '0 1px 2px rgba(20,28,45,0.05), 0 0 0 0.5px ' + C.line,
              transition: 'all .15s',
            }}>{ch.label}</button>
          );
        })}
      </div>

      <Card pad={0}>
        {filtered.map((e, i) => <ExpenseRow key={e.id} e={e} last={i === filtered.length - 1} showTrip onEdit={onEditExpense} />)}
      </Card>
    </div>
  );
}

Object.assign(window, { ExpenseRow, CatBreakdown, Expenses });
