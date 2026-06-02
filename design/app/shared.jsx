/* ============================================================
   Shared UI — tokens, iconos, visualizaciones de progreso, primitivos
   Expone a window. Cargar después de React/Babel y data.js
   ============================================================ */

// ---- Tokens de color ----------------------------------------
const C = {
  ink: '#181B21',
  ink2: '#59616E',
  ink3: '#949BA6',
  line: '#E7EAEF',
  line2: '#EEF1F5',
  bg: '#F3F5F8',
  card: '#FFFFFF',
  track: '#E9ECF1',
};

// semáforo
const NIV = {
  verde:    { fg: '#138A4E', bg: '#E6F4EC', soft: '#F0F9F3', dot: '#1FA862' },
  amarillo: { fg: '#B07A00', bg: '#FBF1D8', soft: '#FDF8EC', dot: '#E0A000' },
  rojo:     { fg: '#C5392F', bg: '#FBE8E6', soft: '#FDF1F0', dot: '#E0463B' },
};

// ---- Iconos (línea, minimalistas) ---------------------------
function Icon({ name, size = 22, color = 'currentColor', stroke = 1.9, fill = 'none', style }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <path {...p} d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9" />,
    calendar: <g {...p}><rect x="3.5" y="4.5" width="17" height="16" rx="2.5" /><path d="M3.5 9h17M8 2.5v4M16 2.5v4" /></g>,
    trips: <g {...p}><path d="M3.5 19h17" /><path d="M5 15.5 9 14l3.5-6c.5-1 1.6-1.4 2.5-1 .9.4 1.2 1.5.7 2.5L13 14l5-1.3c1-.2 1.8.3 2 1.2.2.9-.4 1.6-1.3 1.9L5.5 19" /></g>,
    wallet: <g {...p}><rect x="3" y="5.5" width="18" height="14" rx="3" /><path d="M3 9.5h18M16.5 14h1.5" /></g>,
    plane: <path {...p} d="M3 13.5 8 12l3.2-5.6c.45-.9 1.5-1.3 2.3-.9.8.4 1.1 1.4.65 2.3L11.5 13l4.8-1.3c.9-.2 1.6.3 1.8 1.1.2.8-.4 1.5-1.2 1.7L5 17" />,
    bed: <g {...p}><path d="M3 7v11M3 12h18v6M21 18v-4a3 3 0 0 0-3-3h-7v4" /><path d="M6.5 11.5a1.5 1.5 0 1 0 0-.01" /></g>,
    food: <g {...p}><path d="M6 3v8M9 3v8M7.5 11v10M7.5 3v3M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4m0-9v18" /></g>,
    extra: <g {...p}><circle cx="12" cy="12" r="8.5" /><path d="M9.5 10a2.5 2.5 0 1 1 3.2 2.4c-.5.2-.7.6-.7 1.1v.5M12 17h.01" /></g>,
    plus: <path {...p} d="M12 5v14M5 12h14" />,
    chevR: <path {...p} d="M9 5l7 7-7 7" />,
    chevL: <path {...p} d="M15 5l-7 7 7 7" />,
    chevD: <path {...p} d="M5 9l7 7 7-7" />,
    check: <path {...p} d="M5 12.5l4.5 4.5L19 6.5" />,
    clock: <g {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></g>,
    alert: <g {...p}><path d="M12 3.5 21 19H3L12 3.5Z" /><path d="M12 10v4M12 16.5h.01" /></g>,
    spark: <path {...p} d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />,
    camera: <g {...p}><rect x="3" y="6.5" width="18" height="13" rx="3" /><circle cx="12" cy="13" r="3.5" /><path d="M8 6.5l1.2-2h5.6L16 6.5" /></g>,
    pin: <g {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></g>,
    arrow: <path {...p} d="M5 12h14M13 6l6 6-6 6" />,
    edit: <g {...p}><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="M14 6l4 4" /></g>,
    flag: <g {...p}><path d="M6 21V4M6 5h11l-2 3.5L17 12H6" /></g>,
    x: <path {...p} d="M6 6l12 12M18 6 6 18" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function CatIcon({ cat, size = 18, color }) {
  const map = { avion: 'plane', hospedaje: 'bed', comida: 'food', extra: 'extra' };
  return <Icon name={map[cat]} size={size} color={color || TRK.CAT[cat].color} stroke={1.9} />;
}

// ---- VISUALIZACIÓN 1 — Anillo --------------------------------
function RingViz({ value, max, accent, size = 188, stroke = 16 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const frac = Math.min(1, value / max);
  const dash = circ * frac;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 46, fontWeight: 760, color: C.ink, letterSpacing: -1.5, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        <div style={{ fontSize: 15, color: C.ink3, fontWeight: 560, marginTop: 3 }}>de {max} días</div>
      </div>
    </div>
  );
}

// ---- VISUALIZACIÓN 2 — Semanas (6 × 6 Lun–Sáb) ---------------
function WeeksViz({ value, accent }) {
  // 36 = 6 semanas × 6 días (Lun–Sáb)
  const weeks = 6, perWeek = 6;
  const cells = [];
  for (let i = 0; i < weeks * perWeek; i++) cells.push(i < value);
  const dl = ['L', 'M', 'M', 'J', 'V', 'S'];
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 9, paddingLeft: 30, marginBottom: 8 }}>
        {dl.map((d, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 600, color: C.ink3 }}>{d}</div>)}
      </div>
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: w < weeks - 1 ? 8 : 0 }}>
          <div style={{ width: 21, fontSize: 11, fontWeight: 600, color: C.ink3, textAlign: 'right' }}>S{w + 1}</div>
          {Array.from({ length: perWeek }).map((__, d) => {
            const on = cells[w * perWeek + d];
            return (
              <div key={d} style={{
                flex: 1, height: 22, borderRadius: 6,
                background: on ? accent : C.track,
                transition: 'background .4s', transitionDelay: `${(w * perWeek + d) * 12}ms`,
              }} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---- VISUALIZACIÓN 3 — Barra segmentada por semana -----------
function BarViz({ value, max, accent }) {
  const weeks = 6, perWeek = max / weeks;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 44, fontWeight: 760, color: C.ink, letterSpacing: -1.5, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {value}<span style={{ fontSize: 22, color: C.ink3, fontWeight: 600 }}> / {max}</span>
        </div>
        <div style={{ fontSize: 14, color: C.ink3, fontWeight: 560 }}>{Math.round(value / max * 100)}% de la meta</div>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {Array.from({ length: weeks }).map((_, w) => {
          const start = w * perWeek;
          const fill = Math.max(0, Math.min(perWeek, value - start)) / perWeek;
          return (
            <div key={w} style={{ flex: 1 }}>
              <div style={{ height: 14, borderRadius: 7, background: C.track, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${fill * 100}%`, background: accent, borderRadius: 7, transition: 'width .6s cubic-bezier(.2,.8,.2,1)' }} />
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: C.ink3, textAlign: 'center', marginTop: 6 }}>Sem {w + 1}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Primitivos ---------------------------------------------
function Card({ children, style, onClick, pad = 18 }) {
  return (
    <div onClick={onClick} style={{
      background: C.card, borderRadius: 22, padding: pad,
      boxShadow: '0 1px 2px rgba(20,28,45,0.04), 0 6px 20px -8px rgba(20,28,45,0.08)',
      border: '0.5px solid ' + C.line2,
      ...(onClick ? { cursor: 'pointer' } : {}), ...style,
    }}>{children}</div>
  );
}

function Segmented({ options, value, onChange, accent }) {
  return (
    <div style={{ display: 'flex', background: C.track, borderRadius: 13, padding: 3, gap: 2 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            flex: 1, border: 'none', cursor: 'pointer', borderRadius: 10,
            padding: '8px 6px', fontSize: 13.5, fontWeight: 600,
            fontFamily: 'inherit', letterSpacing: -0.1,
            background: on ? C.card : 'transparent',
            color: on ? C.ink : C.ink2,
            boxShadow: on ? '0 1px 3px rgba(20,28,45,0.12)' : 'none',
            transition: 'all .18s',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function Pill({ children, level, style }) {
  const n = NIV[level] || { fg: C.ink2, bg: C.track };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: n.bg, color: n.fg, borderRadius: 999,
      padding: '4px 11px', fontSize: 12.5, fontWeight: 680, letterSpacing: -0.1, ...style,
    }}>{children}</span>
  );
}

// Bottom sheet
function Sheet({ open, onClose, children, title, maxH = 0.9 }) {
  const [mounted, setMounted] = React.useState(open);
  const [closing, setClosing] = React.useState(false);
  React.useEffect(() => {
    if (open) { setMounted(true); setClosing(false); }
    else if (mounted) { setClosing(true); const t = setTimeout(() => { setMounted(false); setClosing(false); }, 300); return () => clearTimeout(t); }
  }, [open]);
  if (!mounted) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 90, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(15,20,30,0.32)',
        opacity: closing ? 0 : 1, transition: 'opacity .28s ease',
        backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'relative', background: C.bg, borderRadius: '26px 26px 0 0',
        maxHeight: `${maxH * 100}%`, display: 'flex', flexDirection: 'column',
        transform: closing ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform .3s cubic-bezier(.2,.85,.25,1)',
        animation: closing ? 'none' : 'sheetIn .34s cubic-bezier(.2,.85,.25,1)',
        boxShadow: '0 -8px 40px rgba(15,20,30,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 9 }}>
          <div style={{ width: 38, height: 5, borderRadius: 99, background: '#D2D7DF' }} />
        </div>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 4px' }}>
            <div style={{ fontSize: 20, fontWeight: 720, color: C.ink, letterSpacing: -0.4, whiteSpace: 'nowrap' }}>{title}</div>
            <button onClick={onClose} style={{ border: 'none', background: C.track, width: 30, height: 30, borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} color={C.ink2} stroke={2.2} />
            </button>
          </div>
        )}
        <div style={{ overflowY: 'auto', padding: '6px 20px 26px' }}>{children}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  C, NIV, Icon, CatIcon, RingViz, WeeksViz, BarViz, Card, Segmented, Pill, Sheet,
});
