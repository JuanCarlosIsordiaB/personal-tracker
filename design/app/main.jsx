/* ============================================================
   App shell — header, tab bar, ruteo, FAB, Tweaks
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2A6FDB",
  "scenario": "bien",
  "viz": "anillo"
}/*EDITMODE-END*/;

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'calendario', label: 'Calendario', icon: 'calendar' },
  { id: 'viajes', label: 'Viajes', icon: 'trips' },
  { id: 'gastos', label: 'Gastos', icon: 'wallet' },
];

function TabBar({ tab, onTab, accent }) {
  return (
    <div style={{
      flexShrink: 0, display: 'flex', padding: '8px 8px 24px',
      background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(18px) saturate(180%)',
      WebkitBackdropFilter: 'blur(18px) saturate(180%)', borderTop: '0.5px solid ' + C.line,
    }}>
      {TABS.map((t) => {
        const on = t.id === tab;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{
            flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0',
            fontFamily: 'inherit',
          }}>
            <Icon name={t.icon} size={24} color={on ? accent : C.ink3} stroke={on ? 2.1 : 1.8} />
            <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 560, color: on ? accent : C.ink3, letterSpacing: 0.1 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function QuarterSheet({ open, onClose, accent }) {
  const qs = [
    { id: 'Q1', label: 'FY26 · Q1', sub: 'Jul – Sep 2025', dis: true },
    { id: 'Q2', label: 'FY26 · Q2', sub: 'Oct – Dic 2025', dis: false },
    { id: 'Q3', label: 'FY26 · Q3', sub: 'Ene – Mar 2026', dis: true },
    { id: 'Q4', label: 'FY26 · Q4', sub: 'Abr – Jun 2026', dis: true },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Quarter fiscal" maxH={0.6}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 4 }}>
        {qs.map((q) => {
          const active = q.id === 'Q2';
          return (
            <div key={q.id} onClick={() => !q.dis && onClose()} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 16px', borderRadius: 15, cursor: q.dis ? 'default' : 'pointer',
              background: active ? accent + '12' : C.card, border: '1px solid ' + (active ? accent + '40' : C.line2),
              opacity: q.dis ? 0.5 : 1,
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 720, color: C.ink }}>{q.label}</div>
                <div style={{ fontSize: 13, color: C.ink3, fontWeight: 540, marginTop: 1 }}>{q.sub}</div>
              </div>
              {active ? <Icon name="check" size={20} color={accent} stroke={2.4} />
                : <span style={{ fontSize: 12, color: C.ink3, fontWeight: 600 }}>{q.dis ? 'Sin datos' : ''}</span>}
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

function Header({ tab, tripId, onBack, onQuarter, accent }) {
  const titles = { inicio: 'Inicio', calendario: 'Calendario', viajes: 'Viajes', gastos: 'Gastos' };
  const inDetail = tab === 'viajes' && tripId;
  const trip = inDetail ? TRK.TRIPS.find((t) => t.id === tripId) : null;
  return (
    <div style={{ flexShrink: 0, padding: '54px 16px 12px', background: C.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {inDetail ? (
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', padding: 0, margin: '-2px 0' }}>
            <Icon name="chevL" size={22} color={accent} stroke={2.4} />
            <span style={{ fontSize: 28, fontWeight: 770, color: C.ink, letterSpacing: -0.6 }}>{trip ? trip.ciudad : 'Viaje'}</span>
          </button>
        ) : (
          <div style={{ fontSize: 28, fontWeight: 770, color: C.ink, letterSpacing: -0.6 }}>{titles[tab]}</div>
        )}

        <button onClick={onQuarter} style={{
          display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          background: C.card, borderRadius: 999, padding: '8px 12px',
          boxShadow: '0 1px 2px rgba(20,28,45,0.05), 0 0 0 0.5px ' + C.line,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: NIV.verde.dot }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, letterSpacing: -0.1 }}>FY26 · Q2</span>
          <Icon name="chevD" size={15} color={C.ink3} stroke={2.2} />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = t.accent;
  const [tab, setTab] = React.useState('inicio');
  const [tripId, setTripId] = React.useState(null);
  const [sheet, setSheet] = React.useState(null); // 'exp' | 'trip' | 'quarter' | 'day'
  const [presetTrip, setPresetTrip] = React.useState(null);
  const [presetDate, setPresetDate] = React.useState(null);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [bump, setBump] = React.useState(0);

  const s = React.useMemo(() => TRK.computeStatus(t.scenario), [t.scenario, bump]);

  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [tab, tripId]);

  function goTab(id) { setTripId(null); setTab(id); }
  function openTrip(id) { setTripId(id); }
  function openDay(date) { setSelectedDay(date); setSheet('day'); }
  function addExpenseFor(date, tid) { setPresetDate(date || null); setPresetTrip(tid_norm(tid)); setSheet('exp'); }
  function tid_norm(x) { return x || null; }
  function saveExpense(e) { TRK.EXPENSES.push(e); setBump((b) => b + 1); }
  function saveTrip(tr) { TRK.TRIPS.push(tr); setBump((b) => b + 1); }

  let screen;
  if (tab === 'inicio') screen = <Dashboard s={s} accent={accent} viz={t.viz} setViz={(v) => setTweak('viz', v)} onNav={goTab} />;
  else if (tab === 'calendario') screen = <Calendar accent={accent} onDay={openDay} />;
  else if (tab === 'viajes') screen = tripId
    ? <TripDetail tripId={tripId} accent={accent} onDay={openDay} onAddExpense={(id) => { setPresetDate(null); setPresetTrip(id); setSheet('exp'); }} />
    : <TripsList accent={accent} onOpen={openTrip} onAdd={() => setSheet('trip')} />;
  else if (tab === 'gastos') screen = <Expenses accent={accent} onAdd={() => setSheet('exp')} />;

  const showFab = !(tab === 'viajes' && !tripId);
  const fabAction = () => { setPresetDate(null); setPresetTrip(tab === 'viajes' && tripId ? tripId : null); setSheet('exp'); };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E7EAEF', padding: '24px 0' }}>
      <IOSDevice>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, position: 'relative', overflow: 'hidden', fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
          <Header tab={tab} tripId={tripId} onBack={() => setTripId(null)} onQuarter={() => setSheet('quarter')} accent={accent} />

          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', paddingBottom: 22, WebkitOverflowScrolling: 'touch' }}>
            {screen}
          </div>

          {/* FAB */}
          {showFab && (
            <button onClick={fabAction} style={{
              position: 'absolute', right: 18, bottom: 96, zIndex: 40,
              width: 54, height: 54, borderRadius: 18, border: 'none', cursor: 'pointer',
              background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px -4px ' + accent + '99, 0 2px 6px rgba(20,28,45,0.2)',
            }}>
              <Icon name="plus" size={26} color="#fff" stroke={2.6} />
            </button>
          )}

          <TabBar tab={tab} onTab={goTab} accent={accent} />

          {/* Sheets (AddExpense last so it layers on top during day→gasto) */}
          <AddTripSheet open={sheet === 'trip'} onClose={() => setSheet(null)} accent={accent} onSave={saveTrip} />
          <DaySheet open={sheet === 'day'} onClose={() => setSheet(null)} accent={accent} day={selectedDay} onAddExpense={addExpenseFor} />
          <QuarterSheet open={sheet === 'quarter'} onClose={() => setSheet(null)} accent={accent} />
          <AddExpenseSheet open={sheet === 'exp'} onClose={() => setSheet(null)} accent={accent} presetTrip={presetTrip} presetDate={presetDate} onSave={saveExpense} />
        </div>
      </IOSDevice>

      <TweaksPanel>
        <TweakSection label="Marca" />
        <TweakColor label="Color de acento" value={t.accent}
          options={['#2A6FDB', '#1B5FCC', '#3F6FA8', '#4C56D6']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Visualización de días" />
        <TweakRadio label="Por defecto" value={t.viz}
          options={[{ value: 'anillo', label: 'Anillo' }, { value: 'semanas', label: 'Semanas' }, { value: 'barra', label: 'Barra' }]}
          onChange={(v) => setTweak('viz', v)} />
        <TweakSection label="Estado de ejemplo" />
        <TweakRadio label="Semáforo" value={t.scenario}
          options={[{ value: 'bien', label: 'Vas bien' }, { value: 'justo', label: 'Justo' }, { value: 'riesgo', label: 'Riesgo' }]}
          onChange={(v) => setTweak('scenario', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
