/* ============================================================
   Formularios de captura — Gasto y Viaje (bottom sheets)
   ============================================================ */

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 680, color: C.ink2, marginBottom: 7, letterSpacing: 0.1 }}>{label}</div>
      {children}
    </div>
  );
}
const inputStyle = {
  width: '100%', boxSizing: 'border-box', border: '1px solid ' + C.line,
  background: C.card, borderRadius: 13, padding: '13px 14px', fontSize: 15.5,
  fontFamily: 'inherit', color: C.ink, outline: 'none', fontWeight: 500,
};
function PrimaryBtn({ children, onClick, accent, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', border: 'none', borderRadius: 15, padding: '15px', marginTop: 4,
      background: disabled ? C.track : accent, color: disabled ? C.ink3 : '#fff',
      fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: disabled ? 'default' : 'pointer',
      letterSpacing: -0.2, transition: 'background .15s',
    }}>{children}</button>
  );
}

function AddExpenseSheet({ open, onClose, accent, presetTrip, presetDate, onSave }) {
  const [monto, setMonto] = React.useState('');
  const [cat, setCat] = React.useState('comida');
  const [fecha, setFecha] = React.useState(TRK.TODAY);
  const [tripId, setTripId] = React.useState(presetTrip || '');
  const [nota, setNota] = React.useState('');
  React.useEffect(() => { if (open) { setMonto(''); setCat('comida'); setFecha(presetDate || TRK.TODAY); setTripId(presetTrip || ''); setNota(''); } }, [open, presetTrip, presetDate]);

  const cats = ['hospedaje', 'avion', 'comida', 'extra'];
  const valid = parseFloat(monto) > 0;
  const q = TRK.quarterOf(fecha);

  return (
    <Sheet open={open} onClose={onClose} title="Nuevo gasto">
      {/* monto grande */}
      <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontSize: 30, fontWeight: 600, color: valid ? C.ink : C.ink3 }}>$</span>
          <input
            autoFocus type="number" inputMode="decimal" placeholder="0.00" value={monto}
            onChange={(e) => setMonto(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 46, fontWeight: 770, color: valid ? C.ink : C.ink3, width: 'auto', maxWidth: 220, letterSpacing: -1.5, textAlign: 'left' }}
          />
        </div>
        <div style={{ fontSize: 12.5, color: C.ink3, fontWeight: 560, marginTop: 2 }}>Se asigna a {q.label} por su fecha</div>
      </div>

      <Field label="Categoría">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {cats.map((k) => {
            const on = cat === k;
            return (
              <button key={k} onClick={() => setCat(k)} style={{
                border: '1.5px solid ' + (on ? TRK.CAT[k].color : C.line), borderRadius: 14, padding: '12px 4px',
                background: on ? TRK.CAT[k].color + '12' : C.card, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all .15s',
              }}>
                <CatIcon cat={k} size={21} />
                <span style={{ fontSize: 11.5, fontWeight: 640, color: on ? C.ink : C.ink2 }}>{TRK.CAT[k].label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Fecha"><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={inputStyle} /></Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Viaje (opcional)">
            <select value={tripId} onChange={(e) => setTripId(e.target.value)} style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}>
              <option value="">Sin viaje</option>
              {TRK.TRIPS.map((t) => <option key={t.id} value={t.id}>{t.ciudad} · {TRK.fmtRange(t.llegada, t.salida)}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <Field label="Nota"><input type="text" placeholder="Ej. Hotel Roma · 5 noches" value={nota} onChange={(e) => setNota(e.target.value)} style={inputStyle} /></Field>

      <Field label="Recibo">
        <div style={{ border: '1.5px dashed ' + C.line, borderRadius: 14, padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, color: C.ink3, cursor: 'pointer' }}>
          <Icon name="camera" size={20} color={C.ink3} />
          <span style={{ fontSize: 14, fontWeight: 560 }}>Agregar foto del recibo</span>
        </div>
      </Field>

      <PrimaryBtn accent={accent} disabled={!valid} onClick={() => { onSave({ id: 'e' + Date.now(), cat, monto: parseFloat(monto), fecha, tripId: tripId || null, nota }); onClose(); }}>
        Guardar gasto
      </PrimaryBtn>
    </Sheet>
  );
}

function AddTripSheet({ open, onClose, accent, onSave }) {
  const [ciudad, setCiudad] = React.useState('CDMX');
  const [llegada, setLlegada] = React.useState('');
  const [salida, setSalida] = React.useState('');
  React.useEffect(() => { if (open) { setCiudad('CDMX'); setLlegada(''); setSalida(''); } }, [open]);

  const valid = llegada && salida && TRK.parseD(salida) >= TRK.parseD(llegada);
  let preview = null;
  if (valid) {
    const tmp = { id: 'tmp', ciudad, llegada, salida };
    preview = { days: TRK.tripDays(tmp), cont: TRK.countableOf(tmp), q: TRK.quarterOf(llegada) };
  }

  return (
    <Sheet open={open} onClose={onClose} title="Nuevo viaje">
      <Field label="Ciudad"><input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} style={inputStyle} /></Field>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}><Field label="Llegada"><input type="date" value={llegada} onChange={(e) => setLlegada(e.target.value)} style={inputStyle} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Salida"><input type="date" value={salida} onChange={(e) => setSalida(e.target.value)} style={inputStyle} /></Field></div>
      </div>

      {/* preview de días contables */}
      <div style={{ background: valid ? accent + '0E' : C.line2, borderRadius: 16, padding: 16, marginBottom: 18, transition: 'background .2s' }}>
        {valid ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: C.ink2, fontWeight: 600 }}>Días que contarían · {preview.q.label}</span>
              <span style={{ fontSize: 22, fontWeight: 770, color: accent, letterSpacing: -0.5 }}>{preview.cont}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {preview.days.map((d, i) => {
                const isC = d.estado === 'cuenta';
                return (
                  <div key={i} style={{ flex: '1 1 0', minWidth: 26, textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: C.ink3, fontWeight: 600, marginBottom: 3 }}>{TRK.DIAS[d.dow][0]}</div>
                    <div style={{ height: 24, borderRadius: 7, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isC ? accent : (d.estado === 'festivo' ? '#E3E6EB' : C.track), color: isC ? '#fff' : C.ink3 }}>{TRK.parseD(d.fecha).getDate()}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11.5, color: C.ink3, fontWeight: 500, marginTop: 9 }}>Se descuentan domingos y festivos automáticamente.</div>
          </div>
        ) : (
          <div style={{ fontSize: 13.5, color: C.ink3, fontWeight: 540, textAlign: 'center' }}>Elige las fechas para ver los días que cuentan.</div>
        )}
      </div>

      <PrimaryBtn accent={accent} disabled={!valid} onClick={() => { onSave({ id: 't' + Date.now(), ciudad, llegada, salida }); onClose(); }}>
        Guardar viaje
      </PrimaryBtn>
    </Sheet>
  );
}

Object.assign(window, { AddExpenseSheet, AddTripSheet, DaySheet, EditExpenseSheet });

function EditExpenseSheet({ open, onClose, accent, expense, onSave, onDelete }) {
  const [monto, setMonto] = React.useState('');
  const [cat, setCat] = React.useState('comida');
  const [fecha, setFecha] = React.useState(TRK.TODAY);
  const [tripId, setTripId] = React.useState('');
  const [nota, setNota] = React.useState('');
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (open && expense) {
      setMonto(String(expense.monto));
      setCat(expense.cat);
      setFecha(expense.fecha);
      setTripId(expense.tripId || '');
      setNota(expense.nota || '');
      setConfirmDelete(false);
    }
  }, [open, expense]);

  if (!expense) return null;
  const cats = ['hospedaje', 'avion', 'comida', 'extra'];
  const valid = parseFloat(monto) > 0;
  const q = TRK.quarterOf(fecha);

  if (confirmDelete) {
    return (
      <Sheet open={open} onClose={onClose} title="Eliminar gasto" maxH={0.45}>
        <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 16, fontWeight: 640, color: C.ink, marginBottom: 6 }}>¿Eliminar este gasto?</div>
          <div style={{ fontSize: 14, color: C.ink3, fontWeight: 540 }}>{TRK.money(expense.monto)} · {TRK.CAT[expense.cat].label}</div>
        </div>
        <button onClick={() => onDelete(expense.id)} style={{
          width: '100%', border: 'none', borderRadius: 15, padding: '15px', marginBottom: 10,
          background: '#C5392F', color: '#fff', fontSize: 16, fontWeight: 700,
          fontFamily: 'inherit', cursor: 'pointer', letterSpacing: -0.2,
        }}>Sí, eliminar</button>
        <button onClick={() => setConfirmDelete(false)} style={{
          width: '100%', border: 'none', borderRadius: 15, padding: '15px',
          background: C.track, color: C.ink2, fontSize: 16, fontWeight: 640,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>Cancelar</button>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onClose={onClose} title="Editar gasto">
      <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontSize: 30, fontWeight: 600, color: valid ? C.ink : C.ink3 }}>$</span>
          <input
            autoFocus type="number" inputMode="decimal" placeholder="0.00" value={monto}
            onChange={(e) => setMonto(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 46, fontWeight: 770, color: valid ? C.ink : C.ink3, width: 'auto', maxWidth: 220, letterSpacing: -1.5, textAlign: 'left' }}
          />
        </div>
        <div style={{ fontSize: 12.5, color: C.ink3, fontWeight: 560, marginTop: 2 }}>Se asigna a {q.label} por su fecha</div>
      </div>

      <Field label="Categoría">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {cats.map((k) => {
            const on = cat === k;
            return (
              <button key={k} onClick={() => setCat(k)} style={{
                border: '1.5px solid ' + (on ? TRK.CAT[k].color : C.line), borderRadius: 14, padding: '12px 4px',
                background: on ? TRK.CAT[k].color + '12' : C.card, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all .15s',
              }}>
                <CatIcon cat={k} size={21} />
                <span style={{ fontSize: 11.5, fontWeight: 640, color: on ? C.ink : C.ink2 }}>{TRK.CAT[k].label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Fecha"><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={inputStyle} /></Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Viaje (opcional)">
            <select value={tripId} onChange={(e) => setTripId(e.target.value)} style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}>
              <option value="">Sin viaje</option>
              {TRK.TRIPS.map((t) => <option key={t.id} value={t.id}>{t.ciudad} · {TRK.fmtRange(t.llegada, t.salida)}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <Field label="Nota"><input type="text" placeholder="Ej. Hotel Roma · 5 noches" value={nota} onChange={(e) => setNota(e.target.value)} style={inputStyle} /></Field>

      <PrimaryBtn accent={accent} disabled={!valid} onClick={() => {
        onSave(expense.id, { cat, monto: parseFloat(monto), fecha, tripId: tripId || null, nota });
        onClose();
      }}>Guardar cambios</PrimaryBtn>

      <button onClick={() => setConfirmDelete(true)} style={{
        width: '100%', border: 'none', borderRadius: 15, padding: '13px', marginTop: 8,
        background: 'transparent', color: '#C5392F', fontSize: 15, fontWeight: 640,
        fontFamily: 'inherit', cursor: 'pointer',
      }}>Eliminar gasto</button>
    </Sheet>
  );
}

// ---- Hoja de detalle de un día ------------------------------
function DaySheet({ open, onClose, accent, day, onAddExpense }) {
  const d = day || TRK.TODAY;
  const dobj = TRK.parseD(d);
  const st = (typeof dayState === 'function') ? dayState(d) : null;
  const estado = st ? st.estado : 'libre';
  const trip = st ? st.trip : null;
  const hol = st ? st.hol : TRK.isHoliday(d);
  const gastos = TRK.EXPENSES.filter((e) => TRK.sameDay(e.fecha, d)).sort((a, b) => b.monto - a.monto);
  const totalDia = gastos.reduce((s, e) => s + e.monto, 0);
  const q = TRK.quarterOf(d);

  const badge = {
    cuenta: { txt: 'Cuenta como día de oficina', lvl: 'verde' },
    festivo: { txt: hol ? 'Festivo · ' + hol.nombre : 'Festivo', lvl: 'amarillo' },
    domingo: { txt: 'Domingo · no cuenta', lvl: null },
    libre: { txt: 'Fuera de viaje · no cuenta', lvl: null },
  }[estado];

  return (
    <Sheet open={open} onClose={onClose} title={TRK.DIAS_L[dobj.getDay()] + ' ' + TRK.fmtShort(d)} maxH={0.82}>
      {/* estado del día */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '4px 0 14px' }}>
        {badge.lvl
          ? <Pill level={badge.lvl}>{estado === 'cuenta' && <Icon name="check" size={13} color={NIV[badge.lvl].fg} stroke={2.6} />}{badge.txt}</Pill>
          : <span style={{ fontSize: 12.5, fontWeight: 680, color: C.ink2, background: C.track, padding: '4px 11px', borderRadius: 999 }}>{badge.txt}</span>}
        <span style={{ fontSize: 12.5, color: C.ink3, fontWeight: 600 }}>{q.label}</span>
        {trip && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 620, color: accent, background: accent + '12', padding: '4px 10px', borderRadius: 999 }}>
            <Icon name="pin" size={13} color={accent} />{trip.ciudad}
          </span>
        )}
      </div>

      {/* gastos del día */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.ink2, textTransform: 'uppercase', letterSpacing: 0.3 }}>Gastos de este día</span>
        {gastos.length > 0 && <span style={{ fontSize: 15, fontWeight: 740, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{TRK.money(totalDia)}</span>}
      </div>

      {gastos.length > 0 ? (
        <Card pad={0} style={{ marginBottom: 16 }}>
          {gastos.map((e, i) => <ExpenseRow key={e.id} e={e} last={i === gastos.length - 1} />)}
        </Card>
      ) : (
        <div style={{ textAlign: 'center', color: C.ink3, fontSize: 14, fontWeight: 540, padding: '18px 0 22px', background: C.card, borderRadius: 16, marginBottom: 16, border: '1px dashed ' + C.line }}>
          Sin gastos registrados en este día.
        </div>
      )}

      <PrimaryBtn accent={accent} onClick={() => onAddExpense(d, trip ? trip.id : null)}>
        + Agregar gasto a este día
      </PrimaryBtn>
    </Sheet>
  );
}
